import { TwitterContent } from '@/lib/api/types';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { callRewriteWebhook } from '@/lib/api/webhooks';

interface RewriteResultsProps {
  results: TwitterContent[];
}

export function RewriteResults({ results }: RewriteResultsProps) {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState<Record<number, boolean>>({});

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Content copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy content',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = async (id: number) => {
    setRefreshing(prev => ({ ...prev, [id]: true }));
    try {
      // TODO: Implement single version refresh
      toast({
        title: 'Coming Soon',
        description: 'Single version refresh will be available soon!',
      });
    } finally {
      setRefreshing(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {results.map((content) => (
        <Card key={content.id} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Version {content.id}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleCopy(content.topic)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleRefresh(content.id)}
                disabled={refreshing[content.id]}
              >
                <RefreshCw 
                  className={`h-4 w-4 ${refreshing[content.id] ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{content.topic}</p>
        </Card>
      ))}
    </div>
  );
}