# HMI 走查笔记解析器

智能解析车载 HMI 设计走查笔记，自动提取关键信息，生成符合 TB 系统导入规范的 Excel 文件。

## 技术栈

- **前端**: React 18 + TypeScript + Vite 7 + Tailwind CSS
- **后端**: Node.js + Express
- **AI**: DeepSeek API (OpenAI 兼容格式)

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发环境（前端+后端）
pnpm run dev:all

# 前端: http://localhost:3000
# 后端: http://localhost:5001
```

### 环境变量

在项目根目录创建 `.env` 文件：

```env
OPENAI_API_KEY=your_deepseek_api_key_here
```

## 部署到 Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### 手动部署步骤

1. **Fork 或 Push 代码到 GitHub**
2. 登录 [Render](https://dashboard.render.com)
3. 点击 **New +** → **Web Service**
4. 选择你的 GitHub 仓库 `hmi-topic-extractor`
5. 填写配置：

   | 配置项 | 值 |
   |--------|-----|
   | **Name** | `hmi-topic-extractor` |
   | **Runtime** | `Node` |
   | **Branch** | `main` |
   | **Build Command** | `pnpm install && pnpm run build` |
   | **Start Command** | `pnpm run start` |
   | **Plan** | `Free` |

6. 在 **Environment Variables** 添加：

   | Key | Value |
   |-----|-------|
   | `OPENAI_API_KEY` | 你的 DeepSeek API Key |

7. 点击 **Create Web Service**

部署完成后，Render 会生成一个 `https://hmi-topic-extractor.onrender.com` 的链接，分享给同事即可使用。

> **注意**: Render 免费版服务在 15 分钟无访问后会进入休眠，再次访问时会自动唤醒（约 30 秒）。

## 项目结构

```
├── server/             # Express 后端
│   └── index.ts        # API 服务入口
├── src/                # React 前端
│   ├── components/     # UI 组件
│   ├── lib/            # 工具函数（Excel 生成等）
│   ├── pages/          # 页面组件
│   └── App.tsx         # 应用入口
├── scripts/            # 部署脚本
└── package.json
```

## API 接口

- `GET /api/health` - 健康检查
- `POST /api/parse-text` - 解析文本
- `POST /api/parse` - 文本/文件解析
