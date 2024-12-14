import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface UseAuthFormProps<T> {
  form: UseFormReturn<T>;
  onSubmitAction: (data: T) => Promise<void>;
  successMessage: {
    title: string;
    description: string;
  };
  redirectTo?: string;
}

export function useAuthForm<T>({
  form,
  onSubmitAction,
  successMessage,
  redirectTo,
}: UseAuthFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: T) => {
    try {
      setIsLoading(true);
      await onSubmitAction(data);
      toast({
        title: successMessage.title,
        description: successMessage.description,
      });
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}