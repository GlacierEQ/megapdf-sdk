import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { RemoveResponse } from '../types/api-responses';
import { RemoveOptions } from '../types/options';
import { validateFileInput } from '../validation';

/**
 * Remove pages from a PDF
 * 
 * @param client MegaPDF client instance
 * @param options Remove options
 * @returns Remove response
 */
export async function removePages(
  client: MegaPdfClient,
  options: RemoveOptions
): Promise<RemoveResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    if (!options.pagesToRemove || !Array.isArray(options.pagesToRemove) || options.pagesToRemove.length === 0) {
      throw new FileOperationError('Page numbers to remove are required', 'removePages');
    }
    
    // Prepare form data
    const formData: Record<string, any> = {
      pagesToRemove: JSON.stringify(options.pagesToRemove),
    };
    
    // Upload file and request page removal
    const response = await client.uploadFile<RemoveResponse>(
      '/api/pdf/remove',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Page removal failed', 'removePages');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'removePages');
    } else {
      throw new FileOperationError('Unknown error occurred during page removal', 'removePages');
    }
  }
}