import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { SplitResponse, SplitStatusResponse } from '../types/api-responses';
import { SplitOptions } from '../types/options';
import { validateFileInput, validatePageRange, validateRange } from '../validation';
import { SplitMethod } from '../types';

/**
 * Split a PDF file into multiple PDF files
 * 
 * @param client MegaPDF client instance
 * @param options Split options
 * @returns Split response
 */
export async function split(
  client: MegaPdfClient,
  options: SplitOptions
): Promise<SplitResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    // Prepare form data
    const formData: Record<string, any> = {};
    
    if (options.splitMethod) {
      formData.splitMethod = options.splitMethod;
    }
    
    if (options.pageRanges) {
      validatePageRange(options.pageRanges);
      formData.pageRanges = options.pageRanges;
    }
    
    if (options.everyNPages) {
      validateRange(options.everyNPages, 1, 1000, 'everyNPages');
      formData.everyNPages = options.everyNPages.toString();
    }
    
    // Upload file and request split
    const response = await client.uploadFile<SplitResponse>(
      '/api/pdf/split',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Split failed', 'split');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'split');
    } else {
      throw new FileOperationError('Unknown error occurred during split', 'split');
    }
  }
}

/**
 * Get the status of a split job
 * 
 * @param client MegaPDF client instance
 * @param jobId Split job ID
 * @returns Split status response
 */
export async function getSplitStatus(
  client: MegaPdfClient,
  jobId: string
): Promise<SplitStatusResponse> {
  try {
    if (!jobId) {
      throw new FileOperationError('Job ID is required', 'split');
    }
    
    const response = await client.get<SplitStatusResponse>(`/api/pdf/split/status?id=${jobId}`);
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'split');
    } else {
      throw new FileOperationError('Unknown error occurred while checking split status', 'split');
    }
  }
}