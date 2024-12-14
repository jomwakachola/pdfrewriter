// Constants
const WEBHOOK_URL = 'https://hook.eu2.make.com/7f3pd878bbdz3yargvn607auikg1krjt';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

import { RewriteResponse } from './types';

export async function callRewriteWebhook(file: File): Promise<RewriteResponse> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Validate file type
  if (!file.type.includes('pdf')) {
    throw new Error('Only PDF files are supported');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', file.name);
  formData.append('contentType', file.type);
  formData.append('timestamp', new Date().toISOString());

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to connect to the server');
    }

    try {
      const text = await response.text();
      // Handle empty response
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      const data: RewriteResponse = JSON.parse(text);
      
      // Validate response structure
      if (!Array.isArray(data?.twitter_content)) {
        throw new Error('Invalid response format');
      }
      
      return data;
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error('Invalid JSON response from server');
      }
      throw e;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process PDF';
    throw new Error(message);
  }
}