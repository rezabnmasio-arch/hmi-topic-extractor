import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 项目组类型
 */
export type ProjectGroup = 'PK1B' | 'LK1A26E' | 'PK2C8295';

/**
 * 项目组信息
 */
export const PROJECT_GROUPS: Record<ProjectGroup, { name: string; description: string }> = {
  'PK1B': {
    name: 'PK1B',
    description: 'PK1B 项目组（63字段）'
  },
  'LK1A26E': {
    name: 'LK1A26E',
    description: 'LK1A26E 项目组（40字段）'
  },
  'PK2C8295': {
    name: 'PK2C-8295',
    description: 'PK2C-8295 项目组（49字段）'
  }
};

// ============================================
// PK1B 表头定义（63个字段）
// ============================================

/**
 * PK1B TB导入字段接口定义（63个字段）
 */
export interface PK1BFields {
  "标题*": string;
  "父任务 ID": string;
  "父任务": string;
  "任务状态*": string;
  "任务分组": string;
  "任务列表": string;
  "执行者*": string;
  "参与者": string;
  "开始时间": string;
  "截止时间": string;
  "备注*": string;
  "缺陷分类*": string;
  "故障发生时间*": string;
  "指摘源*": string;
  "指摘阶段*": string;
  "发生概率*": string;
  "偶发的概率": string;
  "课题等级*": string;
  "指摘DA系统版本*": string;
  "指摘APP版本*": string;
  "CCM版本号*": string;
  "ZCU版本号*": string;
  "AR HUD版本号*": string;
  "TCU版本号*": string;
  "Xin1版本（VCM）*": string;
  "动力类型": string;
  "指摘车辆信息*": string;
  "指摘人": string;
  "关联部品": string;
  "手机型号": string;
  "其他部品版本": string;
  "课题解决天数": string;
  "重开次数": string;
  "缺陷类型": string;
  "标签": string;
  "发现途径": string;
  "检出责任": string;
  "验证者": string;
  "验证DA系统版本": string;
  "验证APP版本": string;
  "验证车辆信息": string;
  "优先级*": string;
  "关联功能": string;
  "关联部品的解决版本": string;
  "平台": string;
  "是否非PZ0&SA0的外部门课题": string;
  "缺陷明细导出*": string;
  "审批人": string;
  "解决者": string;
  "问题原因": string;
  "解决办法": string;
  "解决版本（系统）": string;
  "解决版本（CDC应用）": string;
  "解决版本": string;
  "开发解决天数": string;
  "课题解析天数（改bug分类前的计数）": string;
  "开发解决天数（改bug分组）": string;
  "bug分类变更次数": string;
  "Bug等级": string;
  "迭代": string;
  "重复项关联的TB号": string;
  "VIN码": string;
  "课题流出原因-实验填写": string;
}

/**
 * 创建默认 PK1B 字段
 */
function createPK1BFields(): PK1BFields {
  return {
    "标题*": "",
    "父任务 ID": "",
    "父任务": "",
    "任务状态*": "待处理",
    "任务分组": "",
    "任务列表": "",
    "执行者*": "徐天雅",
    "参与者": "",
    "开始时间": "",
    "截止时间": "",
    "备注*": "",
    "缺陷分类*": "其他ECU",
    "故障发生时间*": "",
    "指摘源*": "内部-交互",
    "指摘阶段*": "PT",
    "发生概率*": "必现",
    "偶发的概率": "",
    "课题等级*": "C3",
    "指摘DA系统版本*": getCurrentDate(),
    "指摘APP版本*": "-",
    "CCM版本号*": "-",
    "ZCU版本号*": "-",
    "AR HUD版本号*": "-",
    "TCU版本号*": "-",
    "Xin1版本（VCM）*": "-",
    "动力类型": "",
    "指摘车辆信息*": "-",
    "指摘人": "",
    "关联部品": "",
    "手机型号": "",
    "其他部品版本": "",
    "课题解决天数": "",
    "重开次数": "",
    "缺陷类型": "",
    "标签": "",
    "发现途径": "",
    "检出责任": "",
    "验证者": "",
    "验证DA系统版本": "",
    "验证APP版本": "",
    "验证车辆信息": "",
    "优先级*": "普通",
    "关联功能": "",
    "关联部品的解决版本": "",
    "平台": "",
    "是否非PZ0&SA0的外部门课题": "",
    "缺陷明细导出*": "是",
    "审批人": "",
    "解决者": "",
    "问题原因": "",
    "解决办法": "",
    "解决版本（系统）": "",
    "解决版本（CDC应用）": "",
    "解决版本": "",
    "开发解决天数": "",
    "课题解析天数（改bug分类前的计数）": "",
    "开发解决天数（改bug分组）": "",
    "bug分类变更次数": "",
    "Bug等级": "",
    "迭代": "",
    "重复项关联的TB号": "",
    "VIN码": "",
    "课题流出原因-实验填写": "UI走查"
  };
}

// ============================================
// LK1A26E 表头定义（40个字段，基于最新导入模板）
// ============================================

/**
 * LK1A26E TB导入字段接口定义（40个字段）
 */
export interface LK1A26EFields {
  "标题*": string;
  "父任务 ID": string;
  "父任务": string;
  "任务状态*": string;
  "任务分组": string;
  "任务列表": string;
  "执行者": string;
  "参与者": string;
  "开始时间": string;
  "截止时间": string;
  "备注*": string;
  "故障发生时间*": string;
  "缺陷分类*": string;
  "指摘人": string;
  "指摘源-新*": string;
  "指摘阶段*": string;
  "发生概率*": string;
  "偶发概率": string;
  "课题等级*": string;
  "优先级*": string;
  "指摘DA系统版本*": string;
  "指摘APP版本*": string;
  "缺陷类型": string;
  "标签": string;
  "指摘源": string;
  "解决者": string;
  "问题原因": string;
  "解决办法": string;
  "解决版本": string;
  "指摘车辆信息": string;
  "发现途径": string;
  "验证者": string;
  "验证ECU版本": string;
  "验证APP版本": string;
  "验证车辆信息": string;
  "重开次数": string;
  "课题解决天数": string;
  "缺陷明细导出*": string;
  "Bug等级": string;
  "责任科室*": string;
}

/**
 * 创建默认 LK1A26E 字段
 */
function createLK1A26EFields(): LK1A26EFields {
  return {
    "标题*": "",
    "父任务 ID": "",
    "父任务": "",
    "任务状态*": "待处理",
    "任务分组": "",
    "任务列表": "",
    "执行者": "徐天雅",
    "参与者": "",
    "开始时间": "",
    "截止时间": "",
    "备注*": "",
    "故障发生时间*": "",
    "缺陷分类*": "02 车辆设置",
    "指摘人": "",
    "指摘源-新*": "内部-交互",
    "指摘阶段*": "PT",
    "发生概率*": "必现",
    "偶发概率": "",
    "课题等级*": "C3",
    "优先级*": "普通",
    "指摘DA系统版本*": getCurrentDate(),
    "指摘APP版本*": "-",
    "缺陷类型": "",
    "标签": "",
    "指摘源": "",
    "解决者": "",
    "问题原因": "",
    "解决办法": "",
    "解决版本": "",
    "指摘车辆信息": "-",
    "发现途径": "",
    "验证者": "",
    "验证ECU版本": "",
    "验证APP版本": "",
    "验证车辆信息": "",
    "重开次数": "",
    "课题解决天数": "",
    "缺陷明细导出*": "是",
    "Bug等级": "",
    "责任科室*": "-"
  };
}

// ============================================
// PK2C-8295 表头定义（49个字段）
// ============================================

/**
 * PK2C-8295 TB导入字段接口定义（49个字段）
 */
export interface PK2C8295Fields {
  "标题*": string;
  "父任务 ID": string;
  "父任务": string;
  "任务状态*": string;
  "任务分组": string;
  "任务列表": string;
  "执行者": string;
  "参与者": string;
  "开始时间": string;
  "截止时间": string;
  "备注*": string;
  "故障时间点*": string;
  "缺陷分类*": string;
  "指摘人*": string;
  "是否走查活动*": string;
  "走查课题分类*": string;
  "走查课题检出角色A（走查人员）*": string;
  "走查课题检出角色B（该课题本应检出角色）*": string;
  "走查课题检出者B（该课题本应检出者）*": string;
  "走查课题检出者B是否已检出*": string;
  "走查课题关联TB*": string;
  "指摘源*": string;
  "指摘阶段*": string;
  "发生概率*": string;
  "偶发的概率*": string;
  "课题等级*": string;
  "优先级*": string;
  "指摘DA系统版本*": string;
  "指摘APP版本*": string;
  "是否面向工厂AIO活动*": string;
  "指摘车辆信息": string;
  "发现途径": string;
  "Bug等级": string;
  "缺陷类型": string;
  "解决者": string;
  "问题原因": string;
  "解决办法": string;
  "解决版本": string;
  "迭代": string;
  "标签": string;
  "验证者": string;
  "验证DA系统版本": string;
  "验证APP版本": string;
  "验证车辆信息": string;
  "缺陷明细导出*": string;
  "是否符合式样": string;
  "是否式样不合理": string;
  "未按式样实现的原因": string;
  "台架未检出的原因": string;
}

/**
 * 创建默认 PK2C-8295 字段
 */
function createPK2C8295Fields(): PK2C8295Fields {
  return {
    "标题*": "",
    "父任务 ID": "",
    "父任务": "",
    "任务状态*": "待处理",
    "任务分组": "",
    "任务列表": "",
    "执行者": "徐天雅",
    "参与者": "",
    "开始时间": "",
    "截止时间": "",
    "备注*": "",
    "故障时间点*": "",
    "缺陷分类*": "02 系统设置",
    "指摘人*": "徐天雅",
    "是否走查活动*": "否",
    "走查课题分类*": "缺陷类",
    "走查课题检出角色A（走查人员）*": "徐天雅",
    "走查课题检出角色B（该课题本应检出角色）*": "交互",
    "走查课题检出者B（该课题本应检出者）*": "徐天雅",
    "走查课题检出者B是否已检出*": "否",
    "走查课题关联TB*": "无",
    "指摘源*": "内部-交互",
    "指摘阶段*": "PT",
    "发生概率*": "必现",
    "偶发的概率*": "20%~50%",
    "课题等级*": "C1",
    "优先级*": "普通",
    "指摘DA系统版本*": getCurrentDate(),
    "指摘APP版本*": "-",
    "是否面向工厂AIO活动*": "否",
    "指摘车辆信息": "-",
    "发现途径": "",
    "Bug等级": "",
    "缺陷类型": "",
    "解决者": "",
    "问题原因": "",
    "解决办法": "",
    "解决版本": "",
    "迭代": "",
    "标签": "",
    "验证者": "",
    "验证DA系统版本": "",
    "验证APP版本": "",
    "验证车辆信息": "",
    "缺陷明细导出*": "是",
    "是否符合式样": "",
    "是否式样不合理": "",
    "未按式样实现的原因": "",
    "台架未检出的原因": ""
  };
}

// ============================================
// 通用数据结构
// ============================================

/**
 * 从LLM提取的数据结构
 */
export interface ExtractedData {
  title: string;
  precondition: string;
  steps: string;
  phenomenon: string;
  expectation: string;
  executor: string;
  priority: string;
  occurrenceTime: string;
  issueType: string;
  rawText?: string;
}

/**
 * TB导入字段联合类型
 */
export type TBImportFields = PK1BFields | LK1A26EFields | PK2C8295Fields;

// ============================================
// 通用工具函数
// ============================================

/**
 * 优先级映射表
 */
const PRIORITY_MAP: Record<string, string> = {
  'P0': '非常紧急',
  'P1': '非常紧急',
  'P2': '紧急',
  'P3': '普通',
  'P4': '普通',
  '建议类': '较低'
};

/**
 * 课题等级定级规则
 */
const ISSUE_GRADE_RULES: Record<string, string[]> = {
  'A': ['崩溃', '黑屏', '系统无法启动', '核心功能完全失效'],
  'B': ['核心功能部分失效', '导航无法规划', '电话无法拨出', '安全功能异常'],
  'C1': ['UI严重错乱', '逻辑死循环', '无法返回', '界面显示错位'],
  'C2': ['严重卡顿', '主要功能异常', '响应超时', '无响应'],
  'C3': ['间距偏差', '色差', '文案错误', '图标不一致', '样式问题'],
  'QLU': ['动效还原度低', '样式微调', '过渡动画不流畅', '颜色细微偏差']
};

/**
 * 根据问题类型判断课题等级
 */
function determineIssueGrade(issueType: string, title: string, phenomenon: string): string {
  const content = `${issueType} ${title} ${phenomenon}`.toLowerCase();
  
  if (ISSUE_GRADE_RULES['A'].some(keyword => content.includes(keyword.toLowerCase()))) {
    return 'A';
  }
  if (ISSUE_GRADE_RULES['B'].some(keyword => content.includes(keyword.toLowerCase()))) {
    return 'B';
  }
  if (ISSUE_GRADE_RULES['C1'].some(keyword => content.includes(keyword.toLowerCase()))) {
    return 'C1';
  }
  if (ISSUE_GRADE_RULES['C2'].some(keyword => content.includes(keyword.toLowerCase()))) {
    return 'C2';
  }
  if (ISSUE_GRADE_RULES['C3'].some(keyword => content.includes(keyword.toLowerCase()))) {
    return 'C3';
  }
  if (ISSUE_GRADE_RULES['QLU'].some(keyword => content.includes(keyword.toLowerCase()))) {
    return 'QLU';
  }
  
  return 'C3';
}

/**
 * 根据优先级和课题等级映射TB系统优先级
 */
function mapPriority(priority: string, issueGrade: string): string {
  if (PRIORITY_MAP[priority]) {
    return PRIORITY_MAP[priority];
  }
  
  if (['A', 'B'].includes(issueGrade)) {
    return '非常紧急';
  }
  if (['C1', 'C2'].includes(issueGrade)) {
    return '紧急';
  }
  return '普通';
}

/**
 * 格式化备注字段
 */
function formatRemark(precondition: string, steps: string, phenomenon: string, expectation: string): string {
  return `(前置条件)：${precondition}\n(操作步骤)：${steps}\n(故障现象)：${phenomenon}\n(期望现象)：${expectation}`;
}

/**
 * 获取当前日期（YYYY.MM.DD格式）
 */
function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// ============================================
// 数据转换函数
// ============================================

/**
 * 将提取的数据转换为指定项目组的TB导入格式
 */
export function convertToTBFields(data: ExtractedData, projectGroup: ProjectGroup): TBImportFields {
  const issueGrade = determineIssueGrade(data.issueType, data.title, data.phenomenon);
  const tbPriority = mapPriority(data.priority, issueGrade);
  
  if (projectGroup === 'LK1A26E') {
    const fields = createLK1A26EFields();
    fields["标题*"] = data.title || "未命名缺陷";
    fields["执行者"] = data.executor || "徐天雅";
    fields["备注*"] = formatRemark(
      data.precondition || "无",
      data.steps || "无",
      data.phenomenon || "无",
      data.expectation || "无"
    );
    fields["故障发生时间*"] = data.occurrenceTime || getCurrentDate();
    fields["课题等级*"] = issueGrade;
    fields["指摘DA系统版本*"] = getCurrentDate();
    fields["优先级*"] = tbPriority;

    if (data.rawText && (data.rawText.includes('偶发') || data.rawText.includes('概率性'))) {
      fields["发生概率*"] = "偶发";
    }

    return fields;
  } else if (projectGroup === 'PK2C8295') {
    const fields = createPK2C8295Fields();
    fields["标题*"] = data.title || "未命名缺陷";
    fields["执行者"] = data.executor || "徐天雅";
    fields["备注*"] = formatRemark(
      data.precondition || "无",
      data.steps || "无",
      data.phenomenon || "无",
      data.expectation || "无"
    );
    fields["故障时间点*"] = data.occurrenceTime || getCurrentDate();
    fields["课题等级*"] = issueGrade;
    fields["指摘DA系统版本*"] = getCurrentDate();
    fields["优先级*"] = tbPriority;
    
    if (data.rawText && (data.rawText.includes('偶发') || data.rawText.includes('概率性'))) {
      fields["发生概率*"] = "偶发";
      fields["偶发的概率*"] = "未知";
    }
    
    return fields;
  } else {
    // PK1B
    const fields = createPK1BFields();
    fields["标题*"] = data.title || "未命名缺陷";
    fields["执行者*"] = data.executor || "徐天雅";
    fields["备注*"] = formatRemark(
      data.precondition || "无",
      data.steps || "无",
      data.phenomenon || "无",
      data.expectation || "无"
    );
    fields["故障发生时间*"] = data.occurrenceTime || new Date().toISOString().replace('T', ' ').substring(0, 19);
    fields["课题等级*"] = issueGrade;
    fields["指摘DA系统版本*"] = getCurrentDate();
    fields["优先级*"] = tbPriority;
    
    if (data.rawText && (data.rawText.includes('偶发') || data.rawText.includes('概率性'))) {
      fields["发生概率*"] = "偶发";
      fields["偶发的概率"] = "未知";
    }
    
    return fields;
  }
}

// ============================================
// Excel 生成函数
// ============================================

/**
 * PK1B 列宽设置
 */
const PK1B_COL_WIDTHS = [
  {wch: 30}, {wch: 15}, {wch: 20}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 15},
  {wch: 20}, {wch: 20}, {wch: 50}, {wch: 15}, {wch: 20}, {wch: 15}, {wch: 10}, {wch: 10},
  {wch: 15}, {wch: 15}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15},
  {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 15},
  {wch: 12}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 10}, {wch: 15},
  {wch: 15}, {wch: 15}, {wch: 10}, {wch: 15}, {wch: 20}, {wch: 15}, {wch: 20}, {wch: 10},
  {wch: 10}, {wch: 10}, {wch: 20}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 12},
  {wch: 20}, {wch: 20}, {wch: 15}, {wch: 10}, {wch: 15}, {wch: 20}, {wch: 20}, {wch: 15}
];

/**
 * LK1A26E 列宽设置（40个字段）
 */
const LK1A26E_COL_WIDTHS = [
  {wch: 30}, {wch: 15}, {wch: 20}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 15},
  {wch: 20}, {wch: 20}, {wch: 50}, {wch: 20}, {wch: 15}, {wch: 10}, {wch: 12},
  {wch: 10}, {wch: 10}, {wch: 10}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 15},
  {wch: 15}, {wch: 15}, {wch: 12}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15},
  {wch: 15}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 10},
  {wch: 12}, {wch: 10}, {wch: 10}, {wch: 15}
];

/**
 * PK2C-8295 列宽设置
 */
const PK2C8295_COL_WIDTHS = [
  {wch: 30}, {wch: 15}, {wch: 20}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 15},
  {wch: 20}, {wch: 20}, {wch: 50}, {wch: 20}, {wch: 15}, {wch: 10},
  {wch: 12}, {wch: 15}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 15}, {wch: 15},
  {wch: 15}, {wch: 10}, {wch: 10}, {wch: 10}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15},
  {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15},
  {wch: 10}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 10},
  {wch: 12}, {wch: 10}, {wch: 10}, {wch: 15}
];

/**
 * 生成Excel文件
 * @param topics TB导入数据数组
 * @param projectGroup 项目组
 * @returns Blob对象
 */
export function generateExcel(topics: TBImportFields[], projectGroup: ProjectGroup): Blob {
  const wb = XLSX.utils.book_new();
  
  // 根据项目组选择不同的列宽
  const colWidths = projectGroup === 'LK1A26E' 
    ? LK1A26E_COL_WIDTHS 
    : projectGroup === 'PK2C8295' 
      ? PK2C8295_COL_WIDTHS 
      : PK1B_COL_WIDTHS;
  
  // 创建工作表数据
  const wsData = [
    Object.keys(topics[0] || {}),
    ...topics.map(topic => Object.values(topic))
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, '缺陷');
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// ============================================
// 文件下载
// ============================================

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// API 调用
// ============================================

/**
 * 调用后端API解析文本
 */
export async function parseText(content: string): Promise<ExtractedData[]> {
  const response = await fetch('/api/parse-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('文本解析失败');
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || '解析失败');
  }

  return Array.isArray(result.data) ? result.data : [result.data];
}

/**
 * 调用后端API解析图片
 */
export async function parseImage(file: File): Promise<ExtractedData[]> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/parse-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('图片解析失败');
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || '解析失败');
  }

  const extractedData = await parseText(result.data.text);
  return extractedData;
}

/**
 * 综合解析接口
 */
export async function parseContent(content?: string, file?: File): Promise<ExtractedData[]> {
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('文件解析失败');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || '解析失败');
    }

    return Array.isArray(result.data) ? result.data : [result.data];
  } else if (content) {
    return await parseText(content);
  } else {
    throw new Error('请提供文本内容或文件');
  }
}
