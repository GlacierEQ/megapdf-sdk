import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { SignResponse } from '../types/api-responses';
import { SignOptions } from '../types/options';
import { validateFileInput } from '../validation';

/**
 * Sign a PDF with signatures, text, stamps, etc.
 * 
 * @param client MegaPDF client instance
 * @param options Sign options
 * @returns Sign response
 */
export async function sign(
  client: MegaPdfClient,
  options: SignOptions
): Promise<SignResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    if (!options.elements || !Array.isArray(options.elements) || options.elements.length === 0) {
      throw new FileOperationError('At least one signature element is required', 'sign');
    }
    
    if (!options.pages || !Array.isArray(options.pages) || options.pages.length === 0) {
      throw new FileOperationError('Page data is required', 'sign');
    }
    
    // Prepare form data
    const formData: Record<string, any> = {
      elements: JSON.stringify(options.elements),
      pages: JSON.stringify(options.pages),
    };
    
    if (options.performOcr !== undefined) {
      formData.performOcr = options.performOcr.toString();
    }
    
    if (options.ocrLanguage) {
      formData.ocrLanguage = options.ocrLanguage;
    }
    
    // Upload file and request signing
    const response = await client.uploadFile<SignResponse>(
      '/api/pdf/sign',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Signing failed', 'sign');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'sign');
    } else {
      throw new FileOperationError('Unknown error occurred during signing', 'sign');
    }
  }
}