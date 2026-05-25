import 'dotenv/config';
import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import OpenAI from 'openai';

const app = express();

const PORT = process.env.PORT || process.env.BACKEND_PORT || 5001;

// 中间件配置
app.use(cors({
  origin: true, // 允许所有来源（生产环境便于部署）
  credentials: true
}));
app.use(express.json());

// 配置文件上传
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 初始化 DeepSeek 客户端
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const DEEPSEEK_MODEL = 'deepseek-chat';

/**
 * 调用 DeepSeek 进行文本生成（非流式）
 */
async function callDeepSeek(messages: OpenAI.Chat.ChatCompletionMessageParam[], temperature = 0.3) {
  const response = await deepseek.chat.completions.create({
    model: DEEPSEEK_MODEL,
    messages,
    temperature,
  });
  return response.choices[0].message.content || '';
}

/**
 * 从 LLM 响应中提取并解析 JSON 内容
 */
function parseJsonResponse(content: string): any[] {
  let jsonContent = content.trim();
  jsonContent = jsonContent.replace(/```json\s*/gi, '');
  jsonContent = jsonContent.replace(/```\s*/gi, '');
  jsonContent = jsonContent.trim();

  const arrayMatch = jsonContent.match(/\[[\s\S]*?\]/);
  const objectMatch = jsonContent.match(/\{[^{}]*"(?:title|precondition|steps|phenomenon|expectation|executor|priority|occurrenceTime|issueType)"[^{}]*\}/s);

  let data: any;
  if (arrayMatch) {
    data = JSON.parse(arrayMatch[0]);
  } else if (objectMatch) {
    data = JSON.parse(objectMatch[0]);
  } else {
    throw new Error('未找到有效的JSON数据');
  }

  return Array.isArray(data) ? data : [data];
}

/**
 * 提取走查笔记信息的 Prompt 模板
 */
const EXTRACTION_PROMPT = `你是一个专业的HMI（车载人机交互）设计走查笔记解析助手。请分析用户提供的走查笔记内容，提取所有课题的关键信息。

**重要：你必须只返回一个JSON数组，不要包含任何其他文字、说明或markdown标记。**

如果内容包含多个独立的课题，请为每个课题创建一个JSON对象。
课题的识别规则：
- 数字编号（1. 2. 3.）开头的为独立课题
- 换行分隔的不同问题描述为独立课题
- 同一个问题不要拆分成多个

每个课题需要提取的信息：
1. title（标题）：简明扼要的问题概括
2. precondition（前置条件）：触发问题前的环境状态
3. steps（操作步骤）：如何复现问题的步骤
4. phenomenon（故障现象）：实际发生的问题
5. expectation（期望现象）：应该出现的正确结果
6. executor（执行者）：识别@姓名，无则填"徐天雅"
7. priority（优先级）：P0/P1/P2/P3/P4/建议类
8. occurrenceTime（故障发生时间）：YYYY-MM-DD HH:MM:SS格式
9. issueType（问题类型）：崩溃/黑屏/核心功能失效/UI错乱/样式问题等

返回格式示例（只返回JSON数组，不要其他内容）：
单课题：[{"title":"标题","precondition":"前置条件","steps":"操作步骤","phenomenon":"故障现象","expectation":"期望现象","executor":"执行者","priority":"P0","occurrenceTime":"2026-03-27 10:00:00","issueType":"问题类型"}]

多课题：[{"title":"课题1标题","precondition":"前置条件","steps":"操作步骤","phenomenon":"故障现象","expectation":"期望现象","executor":"执行者","priority":"P0","occurrenceTime":"2026-03-27 10:00:00","issueType":"问题类型"},{"title":"课题2标题","precondition":"前置条件","steps":"操作步骤","phenomenon":"故障现象","expectation":"期望现象","executor":"执行者","priority":"P2","occurrenceTime":"2026-03-27 14:00:00","issueType":"样式问题"}]

现在请分析以下走查笔记内容并返回JSON数组：`;

/**
 * 健康检查接口
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * 文本解析接口
 */
app.post('/api/parse-text', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: '请提供要解析的文本内容'
      });
    }

    const raw = await callDeepSeek([
      { role: 'user', content: `${EXTRACTION_PROMPT}\n\n${content}` }
    ]);

    const extractedData = parseJsonResponse(raw);
    console.log(`成功解析JSON，共 ${extractedData.length} 个课题:`, extractedData);

    res.json({
      success: true,
      data: extractedData,
      count: extractedData.length
    });
  } catch (error) {
    console.error('文本解析错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '解析失败'
    });
  }
});

/**
 * 图片 OCR 识别接口
 * 注意：DeepSeek 不支持图片识别，此处返回提示信息
 */
app.post('/api/parse-image', upload.single('image'), async (req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    error: '当前使用 DeepSeek API，不支持图片识别。请改用文本输入方式。'
  });
});

/**
 * 综合解析接口（仅支持文本）
 */
app.post('/api/parse', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let textContent = '';

    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          error: '当前使用 DeepSeek API，不支持图片识别。请使用文本解析接口。'
        });
      }
      textContent = req.file.buffer.toString('utf-8');
    } else if (req.body.content) {
      textContent = req.body.content;
    } else {
      return res.status(400).json({
        success: false,
        error: '请提供文本内容或上传文件'
      });
    }

    const raw = await callDeepSeek([
      { role: 'user', content: `${EXTRACTION_PROMPT}\n\n${textContent}` }
    ]);

    const extractedData = parseJsonResponse(raw);
    console.log(`成功解析JSON，共 ${extractedData.length} 个课题:`, extractedData);

    res.json({
      success: true,
      data: extractedData,
      count: extractedData.length
    });
  } catch (error) {
    console.error('综合解析错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '解析失败'
    });
  }
});

// 提供静态文件服务（生产环境构建后）
app.use(express.static(path.join(process.cwd(), 'dist')));

// SPA 回退路由（确保前端路由刷新时不 404）
app.get('*', (req: Request, res: Response) => {
  if (!req.path.startsWith('/api')) {
    const distPath = path.join(process.cwd(), 'dist');
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
});

app.listen(PORT, () => {
  console.log(`后端服务已启动，端口: ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
});

export default app;
