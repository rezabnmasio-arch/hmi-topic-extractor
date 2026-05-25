import React from 'react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
}

export function FileUploader({ 
  onFileSelect, 
  acceptedTypes = 'image/*,.txt,.pdf,.doc,.docx' 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const isValidType = acceptedTypes.split(',').some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type || file.name.endsWith(type.replace('.', ''));
    });

    if (!isValidType) {
      toast.error('不支持的文件类型');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('文件大小不能超过10MB');
      return;
    }

    onFileSelect(file);
    toast.success(`已上传: ${file.name}`);
  };

  return (
    <motion.div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200',
        isDragging 
          ? 'border-slate-400 bg-slate-50' 
          : 'border-dashed border-slate-200 hover:border-slate-300 bg-slate-50'
      )}
      style={{ height: '220px' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileSelect}
      />
      
      <div className="text-center px-6">
        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center mx-auto mb-3">
          <i className="fa-solid fa-cloud-arrow-up text-slate-400 text-lg"></i>
        </div>
        
        <h3 className="text-sm font-medium text-slate-800 mb-2">
          上传文件
        </h3>
        
        <p className="text-xs text-slate-500 mb-2">
          拖拽文件到此处或
          <span 
            className="text-slate-700 font-medium cursor-pointer hover:underline"
            onClick={() => fileInputRef.current?.click()}
          >
            点击上传
          </span>
        </p>
        
        <p className="text-xs text-slate-400">
          支持图片、TXT、PDF、Word
        </p>
      </div>
    </motion.div>
  );
}
