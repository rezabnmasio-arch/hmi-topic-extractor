import React from 'react';
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };
}

// 文件处理自定义钩子
export function useFileProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedTopics, setExtractedTopics] = useState<any[]>([]);

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // 生成预览（如果是图片）
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
    
    // 清空之前的解析结果
    setExtractedTopics([]);
  };

  // 读取文件内容
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      if (file.type.startsWith('image/')) {
        // 对于图片，我们模拟OCR处理
        reader.onload = () => {
          // 这里是模拟的OCR结果
          resolve("HMI课题信息\n课题1: 车载信息娱乐系统界面设计\n课题2: 智能仪表盘交互逻辑");
        };
        reader.readAsDataURL(file);
      } else {
        // 对于文本文件
        reader.onload = (e) => {
          resolve(e.target?.result as string || '');
        };
        reader.readAsText(file);
      }
      
      reader.onerror = reject;
    });
  };

  // 清除选择的文件
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedTopics([]);
  };

  return {
    selectedFile,
    previewUrl,
    processing,
    setProcessing,
    extractedTopics,
    setExtractedTopics,
    handleFileSelect,
    readFileContent,
    clearFile
  };
}