import { supabase } from '../supabase';
import type { RewriteHistory, TwitterContent } from './types';

export class RewriteService {
  static async saveRewrite(
    fileName: string,
    fileSize: number,
    versions: TwitterContent[]
  ): Promise<string> {
    const { data: rewrite, error: rewriteError } = await supabase
      .from('rewrites')
      .insert({
        file_name: fileName,
        file_size: fileSize,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (rewriteError) throw rewriteError;

    const versionsToInsert = versions.map((version, index) => ({
      rewrite_id: rewrite.id,
      version_number: index + 1,
      content: version.topic,
    }));

    const { error: versionsError } = await supabase
      .from('rewrite_versions')
      .insert(versionsToInsert);

    if (versionsError) throw versionsError;

    return rewrite.id;
  }

  static async getRewriteHistory(): Promise<RewriteHistory[]> {
    const { data: rewrites, error: rewritesError } = await supabase
      .from('rewrites')
      .select(`
        id,
        file_name,
        file_size,
        status,
        created_at,
        rewrite_versions (
          id,
          version_number,
          content
        )
      `)
      .order('created_at', { ascending: false });

    if (rewritesError) throw rewritesError;

    return rewrites.map(rewrite => ({
      id: rewrite.id,
      fileName: rewrite.file_name,
      fileSize: rewrite.file_size,
      timestamp: rewrite.created_at,
      status: rewrite.status as 'completed' | 'failed',
      versions: rewrite.rewrite_versions.map(version => ({
        id: version.version_number,
        topic: version.content,
      })),
    }));
  }

  static async deleteRewrite(id: string): Promise<void> {
    const { error } = await supabase
      .from('rewrites')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}