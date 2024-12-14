import { useCallback, useState, useRef } from 'react';
import { FileUp, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { UploadZone } from './UploadZone';
import { UploadedFile } from './UploadedFile';
import { RewriteResults } from './RewriteResults';
import { TwitterContent } from '@/lib/api/types';

export function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TwitterContent[] | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  }, []);

  const validateFile = (file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      toast({
        title: 'Upload complete',
        description: 'Your PDF has been uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [file, toast]);

  const handleRewriteComplete = (content: TwitterContent[]) => {
    setResults(content);
    setUploading(false);
    setProgress(0);
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <UploadZone
          onFileSelect={handleFileSelect}
          fileInputRef={fileInputRef}
        />
      ) : (
        <UploadedFile
          file={file}
          uploading={uploading}
          progress={progress}
          onUpload={handleUpload}
          onRewriteComplete={handleRewriteComplete}
          onRemove={() => {
            setFile(null);
            setResults(null);
          }}
        />
      )}
      {results && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Generated Content</h2>
          <RewriteResults results={results} />
        </div>
      )}
    </div>
  );
}