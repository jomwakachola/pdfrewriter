import { useCallback, useState, RefObject } from 'react';
import { FileUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

export function UploadZone({ onFileSelect, fileInputRef }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    onFileSelect(droppedFile);
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted",
        "hover:border-primary hover:bg-primary/5"
      )}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <FileUp className="h-5 w-5 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Drop your PDF here</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          or click to browse from your computer
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileSelect}
        />
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>
      </div>
    </div>
  );
}