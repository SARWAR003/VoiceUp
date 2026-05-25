import React, { useState } from 'react';
import { UploadCloud, File, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function CVUploader({ onFileExtracted }) {
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    setIsParsing(true);
    setError(null);
    try {
      if (file.type === 'application/pdf') {
        const { parsePDF } = await import('./parsePDF');
        const text = await parsePDF(file);
        onFileExtracted(text, 'text');
      } else if (file.name.endsWith('.docx')) {
        const { parseDOCX } = await import('./parseDOCX');
        const text = await parseDOCX(file);
        onFileExtracted(text, 'text');
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          onFileExtracted(base64, 'image', file.type);
        };
        reader.readAsDataURL(file);
      } else {
        throw new Error("Unsupported file type.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to parse file. Try another format.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`glass-card p-8 border-dashed border-2 transition-colors ${dragActive ? 'border-nvidia bg-nvidia/10' : 'border-gray-700 hover:border-gray-500'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="cv-upload" 
        className="hidden" 
        accept=".pdf,.docx,image/jpeg,image/png" 
        onChange={handleChange} 
      />
      
      <label htmlFor="cv-upload" className="flex flex-col items-center justify-center cursor-pointer h-40">
        {isParsing ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-nvidia animate-spin-slow mb-4" />
            <p className="text-gray-300 font-medium">Analyzing your CV...</p>
          </div>
        ) : (
          <>
            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-200 mb-2">
              Drop your CV here or click to upload
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><File size={14} /> PDF / DOCX</span>
              <span className="flex items-center gap-1"><ImageIcon size={14} /> JPG / PNG</span>
            </div>
            {error && <p className="text-red-400 mt-4 text-sm bg-red-900/30 px-3 py-1 rounded-full">{error}</p>}
          </>
        )}
      </label>
    </div>
  );
}
