import React, { useState, useRef, useCallback } from 'react';
import { ArrowDown, FileCheck, FileCode, AlertCircle } from 'lucide-react';

const DatDecryptor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [logs, setLogs] = useState<string[]>(['Waiting for input...']);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, message]);
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 10);
  }, []);

  const processFile = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.dat')) {
      setFile(null);
      setLogs(['Waiting for file...']);
      addLog(`[ERROR] ${uploadedFile.name} is not a valid .DAT file.`);
      return;
    }

    setFile(uploadedFile);
    setLogs([]);
    setProgress(0);
    setIsProcessing(true);
    
    addLog(`[INIT] Target locked: ${uploadedFile.name}`);
    await new Promise(r => setTimeout(r, 600));
    addLog(`[INFO] Size: ${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`);
    addLog(`[EXEC] Decryption routine started...`);

    for (let i = 0; i <= 100; i += 4) {
      setProgress(i);
      await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
    }

    addLog(`[SUCCESS] Decrypted 14 internal records.`);
    addLog(`[PACK] Compressing archive...`);
    
    await new Promise(r => setTimeout(r, 800));
    addLog(`[DONE] Download initiated.`);

    setTimeout(() => {
       setIsProcessing(false);
    }, 500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Dropzone Card */}
      <div 
        className={`
          group relative bg-white rounded-none p-12 text-center border-2 transition-all duration-300 cursor-pointer overflow-hidden
          ${dragActive 
            ? 'border-brand bg-red-50/10 scale-[0.99]' 
            : 'border-dashed border-gray-300 hover:border-brand hover:bg-surface'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept=".dat" 
          onChange={handleChange} 
        />
        
        <div className="flex flex-col items-center justify-center z-10 relative">
          <div className={`mb-6 transition-colors duration-300 ${dragActive || file ? 'text-brand' : 'text-gray-400 group-hover:text-brand'}`}>
            {file ? <FileCheck size={48} strokeWidth={1.5} /> : <ArrowDown size={48} strokeWidth={1.5} />}
          </div>
          
          <span className="hidden sm:block text-main font-bold text-xl tracking-tight mb-2">
            {file ? 'File Loaded' : 'Drop .DAT File Here'}
          </span>
          
          <div className="h-6">
            {file ? (
              <span className="text-sm font-mono text-brand font-medium">{file.name}</span>
            ) : (
               <span className="text-sm text-muted font-medium">or click to browse filesystem</span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {(isProcessing || progress > 0) && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100">
            <div 
              className="h-full bg-brand transition-all duration-200 ease-linear shadow-[0_0_10px_rgba(225,29,72,0.5)]" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Log Container */}
      <div className="bg-surface border border-gray-200 shadow-inner rounded-none relative">
        <div className="absolute top-0 left-0 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
          Console
        </div>
        <div 
          ref={logContainerRef}
          className="h-[180px] p-6 pt-10 overflow-y-auto font-mono text-sm text-gray-600 leading-relaxed log-scroll"
        >
          {logs.map((log, index) => {
            const isError = log.includes('ERROR');
            const isSuccess = log.includes('SUCCESS');
            const isExec = log.includes('EXEC');
            
            return (
              <div key={index} className={`mb-1 break-all ${isError ? 'text-red-600 font-bold' : isSuccess ? 'text-green-600 font-bold' : isExec ? 'text-brand' : ''}`}>
                <span className="opacity-50 mr-2">{new Date().toLocaleTimeString('en-US', {hour12: false})}:</span>
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatDecryptor;