import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { CompressionResponse } from '../types/api-responses';
import { CompressOptions } from '../types/options';
import { CompressionQuality } from '../types';
import { validateFileInput } from '../validation';

/**
 * Compress a PDF file to reduce its size
 * 
 * @param client MegaPDF client instance
 * @param options Compression options
 * @returns Compression response
 */
export async function compress(
  client: MegaPdfClient,
  options: CompressOptions
): Promise<CompressionResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    // Prepare form data
    const formData: Record<string, any> = {};
    
    if (options.quality) {
      formData.quality = options.quality;
    }
    
    // Upload file and request compression
    const response = await client.uploadFile<CompressionResponse>(
      '/api/pdf/compress',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Compression failed', 'compress');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'compress');
    } else {
      throw new FileOperationError('Unknown error occurred during compression', 'compress');
    }
  }
}