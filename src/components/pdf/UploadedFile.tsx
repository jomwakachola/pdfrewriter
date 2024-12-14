import { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RewriteService } from '@/lib/api/rewrite.service';
import { callRewriteWebhook } from '@/lib/api/webhooks';
import { TwitterContent } from '@/lib/api/types';

interface UploadedFileProps {
  file: File;
  uploading: boolean;
  progress: number;
  onUpload: () => Promise<void>;
  onRewriteComplete: (content: TwitterContent[]) => void;
  onRemove: () => void;
}

export function UploadedFile({
  file,
  uploading,
  progress,
  onUpload,
  onRewriteComplete,
  onRemove,
}: UploadedFileProps) {
  const { toast } = useToast();
  const [isRewriting, setIsRewriting] = useState(false);

  const handleRewrite = async () => {
    if (uploading || isRewriting) return;
    
    try {
      setIsRewriting(true);
      await onUpload();
      const response = await callRewriteWebhook(file);
      
      if (response.twitter_content?.length > 0) {
        // Save to Supabase
        await RewriteService.saveRewrite(
          file.name,
          file.size,
          response.twitter_content
        );
        
        onRewriteComplete(response.twitter_content);
        toast({
          title: 'Success',
          description: 'Content has been generated successfully.',
        });
      } else {
        throw new Error('No content was generated');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to process PDF. Please try again.';
        
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      onRemove();
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{file.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {!uploading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          )}
        </div>

        {uploading ? (
          <div className="space-y-4">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Uploading... {progress}%
            </p>
          </div>
        ) : (
          <Button className="w-full" onClick={handleRewrite} disabled={isRewriting}>
            {isRewriting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isRewriting ? 'Processing...' : 'Rewrite Content'}
          </Button>
        )}
      </div>
    </Card>
  );
}