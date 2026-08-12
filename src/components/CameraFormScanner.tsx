import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw, Languages, FileText } from 'lucide-react';

interface CameraFormScannerProps {
  onScanComplete: (data: any) => void;
  language?: 'en' | 'bn' | 'hi';
}

export const CameraFormScanner: React.FC<CameraFormScannerProps> = ({ onScanComplete, language = 'en' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    setError(null);
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      setError('Could not access device camera. Please upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);
      setPreviewImage(base64);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const processScan = async () => {
    if (!previewImage) return;

    setIsScanning(true);
    setError(null);
    setScanStep('Initializing AI Multilingual OCR...');

    try {
      setTimeout(() => setScanStep('Detecting regional text (Bangla / Hindi / Urdu)...'), 800);
      setTimeout(() => setScanStep('Translating names and addresses into English...'), 1800);

      const response = await fetch('/api/ocr-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageBase64: previewImage,
          mimeType: 'image/jpeg'
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to parse form image.');
      }

      setScanStep('Form extracted successfully!');
      setTimeout(() => {
        setIsScanning(false);
        setIsOpen(false);
        setPreviewImage(null);
        onScanComplete(result.data);
      }, 600);

    } catch (err: any) {
      console.error(err);
      setIsScanning(false);
      setError(err.message || 'Error parsing paper form image. Please try again or fill manually.');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
        <Camera className="w-4 h-4" />
        <span>
          {language === 'bn' ? 'ফর্ম স্ক্যান ও অনুবাদ করুন (AI Camera)' : language === 'hi' ? 'फॉर्म स्कैन एवं अनुवाद (AI Camera)' : 'AI Scan & Translate Form'}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative space-y-5 text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    AI Form Scanner & Multilingual Translator
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Auto-converts Bangla, Hindi, Urdu & regional paper forms into English input fields
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  stopCamera();
                  setIsOpen(false);
                  setPreviewImage(null);
                }}
                className="text-neutral-400 hover:text-white p-1 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Scanning Overlay */}
            {isScanning ? (
              <div className="py-12 text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto flex items-center justify-center"></div>
                  <Sparkles className="w-8 h-8 text-amber-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-400 text-base">{scanStep}</h4>
                  <p className="text-xs text-neutral-400">Gemini AI is processing paper OCR and translating to English</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Live Camera Feed or Preview */}
                {isCameraActive ? (
                  <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border border-neutral-700 flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-4 bg-amber-500 hover:bg-amber-600 text-black font-black px-6 py-2.5 rounded-full shadow-xl flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" /> Capture Form Photo
                    </button>
                  </div>
                ) : previewImage ? (
                  <div className="relative bg-neutral-950 rounded-2xl p-2 border border-neutral-800 space-y-3">
                    <img src={previewImage} alt="Form preview" className="max-h-64 mx-auto rounded-xl object-contain border border-neutral-800" />
                    <div className="flex justify-between items-center px-2 text-xs text-neutral-400">
                      <span className="flex items-center gap-1"><Languages className="w-4 h-4 text-emerald-400" /> Form photo ready for AI scan</span>
                      <button 
                        type="button" 
                        onClick={() => setPreviewImage(null)}
                        className="text-amber-400 hover:underline font-bold"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-neutral-700 hover:border-amber-500/50 rounded-2xl p-8 text-center space-y-4 transition-colors">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-amber-400" /> Use Device Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-emerald-400" /> Upload Image File
                      </button>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </div>
                    <p className="text-xs text-neutral-500">
                      Upload or capture handwritten/printed form in Bangla, Hindi, Urdu or English
                    </p>
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setIsOpen(false);
                      setPreviewImage(null);
                    }}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  {previewImage && (
                    <button
                      type="button"
                      onClick={processScan}
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-200" />
                      Process & Fill Inputs
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
