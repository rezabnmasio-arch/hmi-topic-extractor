import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FileUploader } from '@/components/FileUploader';
import { useFileProcessor } from '@/hooks/useTheme';
import { 
  TBImportFields, 
  ExtractedData,
  ProjectGroup,
  PROJECT_GROUPS,
  parseContent,
  parseText,
  convertToTBFields, 
  generateExcel, 
  downloadFile 
} from '@/lib/excelUtils';

export default function Home() {
  const {
    selectedFile,
    previewUrl,
    processing,
    setProcessing,
    extractedTopics,
    setExtractedTopics,
    handleFileSelect,
    readFileContent,
    clearFile
  } = useFileProcessor();
  
  const [showPreview, setShowPreview] = useState(false);
  const [extractedDataList, setExtractedDataList] = useState<ExtractedData[]>([]);
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [projectGroup, setProjectGroup] = useState<ProjectGroup>('PK1B');

  // 全选/全不选
  const handleSelectAll = () => {
    if (selectedIndices.size === extractedTopics.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(extractedTopics.map((_, i) => i)));
    }
  };

  // 切换单个选择
  const handleToggleSelect = (index: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  // 处理文本输入解析
  const handleProcessText = async () => {
    if (!inputText.trim()) {
      toast.warning('请输入走查笔记内容');
      return;
    }

    setProcessing(true);
    try {
      const extractedDataArray = await parseText(inputText);
      // 传递当前选中的项目组进行转换
      const tbFieldsArray = extractedDataArray.map(data => convertToTBFields(data, projectGroup));
      
      setExtractedDataList(extractedDataArray);
      setExtractedTopics(tbFieldsArray);
      setSelectedIndices(new Set(extractedDataArray.map((_, i) => i))); // 默认全选
      
      toast.success(`解析完成，共提取 ${extractedDataArray.length} 个课题`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '解析失败，请重试');
      console.error('文本解析错误:', error);
    } finally {
      setProcessing(false);
    }
  };

  // 处理文件解析
  const handleProcessFile = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    try {
      let textContent: string | undefined;
      if (selectedFile.type.startsWith('text/') || 
          selectedFile.name.endsWith('.txt')) {
        textContent = await readFileContent(selectedFile);
      }

      const extractedDataArray = await parseContent(textContent, selectedFile);
      // 传递当前选中的项目组进行转换
      const tbFieldsArray = extractedDataArray.map(data => convertToTBFields(data, projectGroup));
      
      setExtractedDataList(extractedDataArray);
      setExtractedTopics(tbFieldsArray);
      setSelectedIndices(new Set(extractedDataArray.map((_, i) => i))); // 默认全选
      
      toast.success(`解析完成，共提取 ${extractedDataArray.length} 个课题`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '解析失败，请重试');
      console.error('文件解析错误:', error);
    } finally {
      setProcessing(false);
    }
  };

  // 生成并下载Excel文件
  const handleGenerateExcel = () => {
    if (selectedIndices.size === 0) {
      toast.warning('请至少选择一个课题导出');
      return;
    }

    try {
      // 只导出选中的课题
      const selectedTopics = Array.from(selectedIndices).map(i => extractedTopics[i]);
      const excelBlob = generateExcel(selectedTopics as TBImportFields[], projectGroup);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `HMI走查_${projectGroup}_${timestamp}.xlsx`;
      
      downloadFile(excelBlob, fileName);
      toast.success(`已导出 ${selectedIndices.size} 个课题至 ${projectGroup}`);
    } catch (error) {
      toast.error('Excel文件生成失败');
      console.error('Excel生成错误:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-5 max-w-7xl">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl font-semibold text-slate-800 mb-2">
              HMI走查笔记转换工具
            </h1>
            <p className="text-sm text-slate-500 mb-4">
              智能解析HMI走查笔记，自动提取关键信息并生成符合TB系统导入规范的Excel文件
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center">
                  <i className="fa-solid fa-pen-to-square text-slate-500 text-xs"></i>
                </div>
                <span>走查时随手记录的课题备忘录</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center">
                  <i className="fa-solid fa-image text-slate-500 text-xs"></i>
                </div>
                <span>直接上传走查表格的课题内容截图</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* TB导入流程说明 */}
        <motion.section 
          className="mb-8 bg-white rounded-xl p-6 border border-slate-200 card-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-info text-slate-600 text-sm"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-slate-800 mb-2">TB批量导入流程</h3>
              <div className="text-sm text-slate-600 space-y-1">
                <p>在TB项目界面，找到右上角的「...」图标 → 选择「导入任务」→「从Excel导入」→ 选中「缺陷」并勾选"完整导入父子任务" → 上传Excel文件</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 主要内容区 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 左侧：输入区域 */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-3 bg-white rounded-xl p-6 border border-slate-200 card-shadow"
          >
            {/* 模式切换 */}
            <div className="flex gap-2 mb-6 bg-slate-50 p-1 rounded-lg">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
                  inputMode === 'text'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <i className="fa-solid fa-keyboard mr-2"></i>文本输入
              </button>
              <button
                onClick={() => setInputMode('file')}
                className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
                  inputMode === 'file'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <i className="fa-solid fa-file-arrow-up mr-2"></i>文件上传
              </button>
            </div>

            {/* 文本输入模式 */}
            {inputMode === 'text' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    走查笔记内容
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`支持批量输入多个课题，例如：

1. @张三 设置页面图标间距不一致
前置条件：进入设置页面
操作步骤：查看设置页面的图标布局
故障现象：左侧图标距离边框5px，右侧距离10px
期望现象：图标间距应保持一致
建议调整

2. 音量调节弹窗位置偏右，P2问题

3. @李四 导航按钮点击无响应，偶发`}
                    className="w-full h-64 px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm resize-none transition-all focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleProcessText}
                    disabled={processing || !inputText.trim()}
                    className={`flex-1 py-2.5 px-6 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${
                      processing || !inputText.trim()
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {processing ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>解析中...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-magnifying-glass mr-2"></i>开始解析
                      </>
                    )}
                  </button>
                  
                  {inputText && (
                    <button
                      onClick={() => setInputText('')}
                      className="py-2.5 px-4 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <i className="fa-solid fa-eraser"></i>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* 文件上传模式 */}
            {inputMode === 'file' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FileUploader onFileSelect={handleFileSelect} />
                
                {selectedFile && (
                  <motion.div 
                    className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                          <i className={`fa-solid ${
                            selectedFile.type.startsWith('image/') ? 'fa-image text-slate-600' : 
                            'fa-file-lines text-slate-600'
                          }`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{selectedFile.name}</p>
                          <p className="text-xs text-slate-500">{Math.round(selectedFile.size / 1024)} KB</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleProcessFile}
                          disabled={processing}
                          className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium ${
                            processing 
                              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                          } transition-colors`}
                        >
                          {processing ? (
                            <>
                              <i className="fa-solid fa-spinner fa-spin mr-2"></i>解析中
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-magnifying-glass mr-2"></i>解析
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={clearFile}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {previewUrl && (
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <button 
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-sm mb-2 flex items-center text-slate-600 hover:text-slate-800"
                    >
                      {showPreview ? (
                        <>
                          <i className="fa-solid fa-eye-slash mr-1"></i>隐藏预览
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-eye mr-1"></i>显示预览
                        </>
                      )}
                    </button>
                    
                    {showPreview && (
                      <div className="rounded-lg overflow-hidden border border-slate-200">
                        <img 
                          src={previewUrl} 
                          alt="预览图" 
                          className="w-full h-auto max-h-64 object-contain"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.section>

          {/* 右侧：解析结果 */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 card-shadow"
          >
            {/* 项目组选择 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                目标项目组
              </label>
              <div className="flex gap-2">
                {(Object.keys(PROJECT_GROUPS) as ProjectGroup[]).map((group) => (
                  <button
                    key={group}
                    onClick={() => setProjectGroup(group)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      projectGroup === group
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {PROJECT_GROUPS[group].name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">解析结果</h3>
              <div className="flex items-center gap-3">
                {extractedTopics.length > 0 && (
                  <>
                    <button
                      onClick={handleSelectAll}
                      className="text-xs text-slate-600 hover:text-slate-800 flex items-center gap-1"
                    >
                      <i className={`fa-regular ${selectedIndices.size === extractedTopics.length ? 'fa-check-square' : 'fa-square'}`}></i>
                      {selectedIndices.size === extractedTopics.length ? '全不选' : '全选'}
                    </button>
                    <span className="text-xs bg-slate-800 text-white px-2 py-1 rounded">
                      已选 {selectedIndices.size}/{extractedTopics.length}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {extractedTopics.length > 0 ? (
              <>
                <div className="mb-4 max-h-96 overflow-y-auto space-y-3">
                  {extractedDataList.map((data, index) => (
                    <motion.div 
                      key={index}
                      onClick={() => handleToggleSelect(index)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedIndices.has(index) 
                          ? 'bg-white border-slate-400 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedIndices.has(index)}
                              onChange={() => handleToggleSelect(index)}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500 cursor-pointer"
                            />
                            <h4 className="font-medium text-slate-800 text-sm flex-1">{data.title}</h4>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                            (extractedTopics[index] as TBImportFields)['优先级*'] === '非常紧急' ? 'bg-red-100 text-red-700' :
                            (extractedTopics[index] as TBImportFields)['优先级*'] === '紧急' ? 'bg-orange-100 text-orange-700' :
                            (extractedTopics[index] as TBImportFields)['优先级*'] === '较低' ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {(extractedTopics[index] as TBImportFields)['优先级*']}
                          </span>
                        </div>
                        
                        <div className="text-xs space-y-1 text-slate-600 pl-6">
                          <p><span className="text-slate-400">执行者：</span>{data.executor}</p>
                          <p><span className="text-slate-400">等级：</span>{(extractedTopics[index] as TBImportFields)['课题等级*']}</p>
                          <p><span className="text-slate-400">现象：</span>{data.phenomenon}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  onClick={handleGenerateExcel}
                  disabled={selectedIndices.size === 0}
                  className={`w-full py-2.5 px-6 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                    selectedIndices.size === 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                  whileHover={selectedIndices.size > 0 ? { scale: 1.01 } : {}}
                  whileTap={selectedIndices.size > 0 ? { scale: 0.99 } : {}}
                >
                  <i className="fa-solid fa-file-excel mr-2"></i>
                  导出至 {projectGroup} {selectedIndices.size > 0 && `(${selectedIndices.size})`}
                </motion.button>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                {processing ? (
                  <>
                    <div className="mb-3 animate-spin">
                      <i className="fa-solid fa-circle-notch text-2xl"></i>
                    </div>
                    <p className="text-sm">正在解析...</p>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-inbox text-3xl mb-3"></i>
                    <p className="text-sm">暂无解析结果</p>
                    <p className="text-xs mt-1">请输入或上传走查笔记</p>
                  </>
                )}
              </div>
            )}
          </motion.section>
        </div>

        {/* 底部说明 */}
        <motion.section 
          className="mt-6 bg-white rounded-xl p-6 border border-slate-200 card-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
            <i className="fa-solid fa-book mr-2 text-slate-400"></i>
            使用说明
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-medium text-slate-600">1</span>
              <p>选择输入方式：文本输入或文件上传</p>
            </div>
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-medium text-slate-600">2</span>
              <p>输入内容，支持批量多个课题识别</p>
            </div>
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-medium text-slate-600">3</span>
              <p>点击"开始解析"，AI自动提取信息</p>
            </div>
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-medium text-slate-600">4</span>
              <p>系统自动定级和映射优先级</p>
            </div>
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-medium text-slate-600">5</span>
              <p>查看结果，生成Excel文件</p>
            </div>
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-medium text-slate-600">6</span>
              <p>按TB导入流程批量导入系统</p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* 底部信息 */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-6 text-center max-w-7xl">
          <p className="text-xs text-slate-400">
            © 2026 HMI走查笔记转换工具·Tiya
          </p>
        </div>
      </footer>
    </div>
  );
}
