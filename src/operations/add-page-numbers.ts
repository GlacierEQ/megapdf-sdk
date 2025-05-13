import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { PageNumberResponse } from '../types/api-responses';
import { PageNumberOptions } from '../types/options';
import { validateFileInput, validateRange } from '../validation';

/**
 * Add page numbers to a PDF
 * 
 * @param client MegaPDF client instance
 * @param options Page number options
 * @returns Page number response
 */
export async function addPageNumbers(
  client: MegaPdfClient,
  options: PageNumberOptions
): Promise<PageNumberResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    // Validate number ranges if provided
    if (options.fontSize !== undefined) {
      validateRange(options.fontSize, 6, 72, 'fontSize');
    }
    
    if (options.startNumber !== undefined) {
      validateRange(options.startNumber, 1, 10000, 'startNumber');
    }
    
    if (options.marginX !== undefined) {
      validateRange(options.marginX, 0, 1000, 'marginX');
    }
    
    if (options.marginY !== undefined) {
      validateRange(options.marginY, 0, 1000, 'marginY');
    }
    
    // Prepare form data
    const formData: Record<string, any> = {};
    
    if (options.format) {
      formData.format = options.format;
    }
    
    if (options.position) {
      formData.position = options.position;
    }
    
    if (options.fontFamily) {
      formData.fontFamily = options.fontFamily;
    }
    
    if (options.fontSize !== undefined) {
      formData.fontSize = options.fontSize.toString();
    }
    
    if (options.color) {
      formData.color = options.color;
    }
    
    if (options.startNumber !== undefined) {
      formData.startNumber = options.startNumber.toString();
    }
    
    if (options.prefix) {
      formData.prefix = options.prefix;
    }
    
    if (options.suffix) {
      formData.suffix = options.suffix;
    }
    
    if (options.marginX !== undefined) {
      formData.marginX = options.marginX.toString();
    }
    
    if (options.marginY !== undefined) {
      formData.marginY = options.marginY.toString();
    }
    
    if (options.selectedPages) {
      formData.selectedPages = options.selectedPages;
    }
    
    if (options.skipFirstPage !== undefined) {
      formData.skipFirstPage = options.skipFirstPage.toString();
    }
    
    // Upload file and request page numbering
    const response = await client.uploadFile<PageNumberResponse>(
      '/api/pdf/pagenumber',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Page numbering failed', 'addPageNumbers');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'addPageNumbers');
    } else {
      throw new FileOperationError('Unknown error occurred during page numbering', 'addPageNumbers');
    }
  }
}