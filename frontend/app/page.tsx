"use client";

import { useState } from "react";
import { Upload, Sparkles, Download } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [contentImage, setContentImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'content' | 'style') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'content') {
          setContentImage(reader.result as string);
        } else {
          setStyleImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!contentImage || !styleImage) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResultImage(contentImage);
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setContentImage(null);
    setStyleImage(null);
    setResultImage(null);
  };

  const handleDownload = () => {
    if (!resultImage) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'dream-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-light text-center mb-12 tracking-tight">
          Deep Dream Generator
        </h1>

        {!resultImage ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Image Upload */}
              <div 
                className={`aspect-[3/2] relative group cursor-pointer border border-border/50 rounded-lg overflow-hidden transition-all ${
                  contentImage ? '' : 'hover:border-primary/50'
                }`}
              >
                {contentImage ? (
                  <Image
                    src={contentImage}
                    alt="Content"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Content Image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'content')}
                    />
                  </label>
                )}
              </div>

              {/* Style Image Upload */}
              <div 
                className={`aspect-[3/2] relative group cursor-pointer border border-border/50 rounded-lg overflow-hidden transition-all ${
                  styleImage ? '' : 'hover:border-primary/50'
                }`}
              >
                {styleImage ? (
                  <Image
                    src={styleImage}
                    alt="Style"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Dream Controller</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'style')}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!contentImage || !styleImage || isLoading}
                className="group relative px-8 py-3 bg-background border border-border/50 rounded-full hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="flex items-center gap-2 text-sm">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Dream
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="aspect-[3/2] relative rounded-lg overflow-hidden">
              <Image
                src={resultImage}
                alt="Result"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetForm}
                className="group px-8 py-3 bg-background border border-border/50 rounded-full hover:border-primary/50 transition-all"
              >
                <span className="flex items-center gap-2 text-sm">
                  <Upload className="w-4 h-4" />
                  Upload New Images
                </span>
              </button>
              <button
                onClick={handleDownload}
                className="group px-8 py-3 bg-background border border-border/50 rounded-full hover:border-primary/50 transition-all"
              >
                <span className="flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Download Image
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}