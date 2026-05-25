# HMI走查笔记解析器

## 项目概览

HMI走查笔记解析器是一个智能化的车载HMI设计走查笔记处理工具，能够自动解析文本或图片格式的走查笔记，提取关键信息，并根据问题严重程度进行专业定级，最终生成符合TB系统导入规范的Excel文件。

### 核心功能
- **智能解析**：支持文本文件和图片文件的走查笔记解析
- **AI驱动**：使用LLM大语言模型进行智能信息提取和OCR识别
- **专业定级**：根据问题严重程度自动判断课题等级（A/B/C1/C2/C3/QLU）
- **优先级映射**：自动映射TB系统优先级（非常紧急/紧急/普通/较低）
- **完整字段**：生成包含63个字段的TB导入格式Excel文件

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 7
- **路由**: React Router DOM
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **通知**: Sonner
- **Excel处理**: XLSX

### 后端
- **运行时**: Node.js
- **框架**: Express
- **LLM SDK**: coze-coding-dev-sdk
- **文件上传**: Multer
- **跨域**: CORS

## 项目结构

```
.
├── server/                 # 后端服务
│   ├── index.ts           # Express服务器主文件
│   └── tsconfig.json      # TypeScript配置
├── src/                   # 前端源码
│   ├── components/        # React组件
│   │   ├── Empty.tsx
│   │   └── FileUploader.tsx
│   ├── contexts/          # React Context
│   ├── hooks/             # 自定义Hooks
│   ├── lib/               # 工具函数
│   │   ├── excelUtils.ts  # Excel处理和TB字段转换
│   │   └── utils.ts       # 通用工具函数
│   ├── pages/             # 页面组件
│   │   └── Home.tsx       # 主页面
│   ├── App.tsx            # 应用入口
│   ├── main.tsx           # React入口
│   └── index.css          # 全局样式
├── scripts/               # 部署脚本
│   ├── dev.sh            # 开发环境启动脚本
│   ├── build.sh          # 构建脚本
│   └── start.sh          # 生产环境启动脚本
├── package.json           # 依赖配置
├── vite.config.ts         # Vite配置
├── tailwind.config.js     # Tailwind配置
└── .coze                  # Coze配置文件
```

## 构建和测试命令

### 开发环境
```bash
# 安装依赖
pnpm install

# 启动开发环境（前端+后端）
bash ./scripts/dev.sh

# 或分别启动
pnpm run dev:frontend  # 仅前端（5000端口）
pnpm run dev:server    # 仅后端（5001端口）
```

### 生产环境
```bash
# 构建
bash ./scripts/build.sh

# 启动生产服务
bash ./scripts/start.sh
```

### 测试
```bash
# 类型检查
pnpm run ts-check

# 健康检查
curl http://localhost:5001/api/health

# 测试文本解析
curl -X POST -H 'Content-Type: application/json' \
  -d '{"content":"@张三\n中控屏黑屏\nP0优先级"}' \
  http://localhost:5001/api/parse-text
```

## 代码风格指南

### 命名规范
- **组件**: PascalCase (如 `FileUploader.tsx`)
- **函数**: camelCase (如 `handleProcessFile`)
- **常量**: UPPER_SNAKE_CASE (如 `PRIORITY_MAP`)
- **接口**: PascalCase (如 `TBImportFields`, `ExtractedData`)

### 文件组织
- 每个组件独立一个文件
- 工具函数按功能分组在 `lib/` 目录
- 类型定义与相关功能放在一起

### TypeScript规范
- 使用严格的类型检查
- 明确定义接口和类型
- 避免使用 `any` 类型

## 核心功能模块

### 1. 后端API服务 (`server/index.ts`)

#### 接口列表
- `GET /api/health` - 健康检查
- `POST /api/parse-text` - 解析文本内容
- `POST /api/parse-image` - 解析图片（OCR）
- `POST /api/parse` - 综合解析（文本/文件）

#### 使用示例
```typescript
// 文本解析
const response = await fetch('/api/parse-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: '走查笔记内容' })
});

// 图片解析
const formData = new FormData();
formData.append('image', file);
const response = await fetch('/api/parse-image', {
  method: 'POST',
  body: formData
});
```

### 2. TB字段转换 (`src/lib/excelUtils.ts`)

#### 核心函数
- `convertToTBFields(data: ExtractedData)` - 将提取数据转换为TB格式
- `determineIssueGrade()` - 根据问题类型判断课题等级
- `mapPriority()` - 映射TB系统优先级
- `generateExcel()` - 生成Excel文件
- `parseContent()` - 调用后端API解析内容

#### 数据流程
```
用户输入 → 后端API解析 → ExtractedData → convertToTBFields → TBImportFields → generateExcel
```

### 3. 专业定级规则

#### 课题等级定级标准
| 等级 | 严重程度 | 典型场景 |
|------|----------|----------|
| A | 致命 | 崩溃、黑屏、核心功能完全失效 |
| B | 严重 | 核心功能部分失效、安全功能异常 |
| C1 | 较严重 | UI严重错乱、逻辑死循环 |
| C2 | 一般 | 严重卡顿、主要功能异常 |
| C3 | 轻微 | 间距偏差、色差、文案错误 |
| QLU | 极轻微 | 动效还原度低、样式微调 |

#### 优先级映射
| 走查笔记优先级 | TB系统优先级 |
|---------------|--------------|
| P0/P1 | 非常紧急 |
| P2 | 紧急 |
| P3/P4 | 普通 |
| 建议类 | 较低 |

## 测试说明

### 单元测试
目前使用手动测试，主要测试场景：
1. 文本解析功能
2. 图片OCR功能
3. TB字段转换逻辑
4. Excel文件生成

### 集成测试
```bash
# 测试完整流程
npx tsx test-flow.ts
```

## 安全注意事项

1. **API密钥安全**: LLM API密钥通过环境变量管理，不在代码中硬编码
2. **文件上传限制**: 限制文件大小为10MB
3. **CORS配置**: 仅允许指定域名访问
4. **输入验证**: 验证文件类型和内容格式

## 常见问题

### 1. 服务启动失败
检查端口占用：
```bash
ss -tuln | grep -E ':5000|:5001'
```

### 2. API调用失败
检查后端服务状态：
```bash
curl http://localhost:5001/api/health
```

### 3. Excel生成错误
检查数据格式是否符合 `TBImportFields` 接口定义

## 开发指南

### 添加新的解析规则
在 `src/lib/excelUtils.ts` 中修改：
- `ISSUE_GRADE_RULES` - 课题等级规则
- `PRIORITY_MAP` - 优先级映射
- `determineIssueGrade()` - 定级逻辑

### 修改字段定义
在 `src/lib/excelUtils.ts` 中修改：
- `TBImportFields` 接口定义
- `createDefaultTBFields()` 函数

### 添加新的API接口
在 `server/index.ts` 中添加新的路由处理函数

## 性能优化建议

1. **前端优化**
   - 使用React.lazy进行组件懒加载
   - 图片压缩后再上传
   - 使用Web Worker处理大文件

2. **后端优化**
   - 实现请求缓存
   - 添加速率限制
   - 使用流式处理大文件

3. **Excel生成优化**
   - 批量处理多条记录
   - 压缩Excel文件大小

## 部署说明

项目部署在Coze平台上，使用以下环境变量：
- `COZE_WORKSPACE_PATH` - 项目工作目录
- `COZE_PROJECT_DOMAIN_DEFAULT` - 对外访问域名
- `DEPLOY_RUN_PORT` - 服务监听端口（5000）
- `COZE_PROJECT_ENV` - 环境标识（DEV/PROD）

## 联系方式

如有问题或建议，请联系项目维护者。
