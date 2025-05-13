import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { MergeResponse } from '../types/api-responses';
import { MergeOptions } from '../types/options';
import { validateMultipleFileInputs } from '../validation';

/**
 * Merge multiple PDF files into a single PDF
 * 
 * @param client MegaPDF client instance
 * @param options Merge options
 * @returns Merge response
 */
export async function merge(
  client: MegaPdfClient,
  options: MergeOptions
): Promise<MergeResponse> {
  try {
    // Validate inputs
    validateMultipleFileInputs(options.files);
    
    // Validate order array if provided
    if (options.order && Array.isArray(options.order)) {
      // Check that order array has the same length as files array
      if (options.order.length !== options.files.length) {
        throw new FileOperationError(
          'Order array must have the same length as files array',
          'merge'
        );
      }
      
      // Check that order array contains valid indices
      for (const index of options.order) {
        if (!Number.isInteger(index) || index < 0 || index >= options.files.length) {
          throw new FileOperationError(
            `Invalid order index: ${index}. Must be between 0 and ${options.files.length - 1}`,
            'merge'
          );
        }
      }
    }
    
    // Prepare form data
    const formData: Record<string, any> = {};
    
    if (options.order && Array.isArray(options.order)) {
      formData.order = JSON.stringify(options.order);
    }
    
    // Upload files and request merge
    const response = await client.uploadFiles<MergeResponse>(
      '/api/pdf/merge',
      options.files,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Merge failed', 'merge');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'merge');
    } else {
      throw new FileOperationError('Unknown error occurred during merge', 'merge');
    }
  }
}