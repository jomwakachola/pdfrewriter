import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText, ChevronDown, ChevronUp, Copy, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { RewriteService } from '@/lib/api/rewrite.service';
import type { RewriteHistory } from '@/lib/api/types';

export function RewritesPage() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<RewriteHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await RewriteService.getRewriteHistory();
      setHistory(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load rewrite history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  const handleDelete = async (id: string) => {
    try {
      await RewriteService.deleteRewrite(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Deleted',
        description: 'Rewrite has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete rewrite',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Rewrite History</h1>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No rewrites found. Start by rewriting a PDF!
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="p-4">
                <Collapsible
                  open={expandedItems[item.id]}
                  onOpenChange={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.fileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')} •{' '}
                        {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {expandedItems[item.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="mt-4 pl-12 space-y-4">
                    {item.versions.map((version) => (
                      <div
                        key={version.id}
                        className="p-4 rounded-lg bg-muted/50 relative group"
                      >
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleCopy(version.topic)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <h4 className="text-sm font-medium mb-2">
                          Version {version.id}
                        </h4>
                        <p className="text-sm text-muted-foreground pr-10">
                          {version.topic}
                        </p>
                      </div>
                    ))}
                  </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}