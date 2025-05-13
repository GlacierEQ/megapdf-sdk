import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { OcrExtractResponse, OcrResponse } from '../types/api-responses';
import { OcrExtractOptions, OcrOptions } from '../types/options';
import { validateFileInput } from '../validation';

/**
 * Convert a PDF to a searchable PDF using OCR
 * 
 * @param client MegaPDF client instance
 * @param options OCR options
 * @returns OCR response
 */
export async function ocr(
  client: MegaPdfClient,
  options: OcrOptions
): Promise<OcrResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    // Prepare form data
    const formData: Record<string, any> = {};
    
    if (options.language) {
      formData.language = options.language;
    }
    
    if (options.enhanceScanned !== undefined) {
      formData.enhanceScanned = options.enhanceScanned.toString();
    }
    
    if (options.preserveLayout !== undefined) {
      formData.preserveLayout = options.preserveLayout.toString();
    }
    
    // Upload file and request OCR
    const response = await client.uploadFile<OcrResponse>(
      '/api/ocr',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'OCR failed', 'ocr');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'ocr');
    } else {
      throw new FileOperationError('Unknown error occurred during OCR', 'ocr');
    }
  }
}

/**
 * Extract text from a PDF using OCR
 * 
 * @param client MegaPDF client instance
 * @param options OCR extract options
 * @returns OCR extract response
 */
export async function extractText(
  client: MegaPdfClient,
  options: OcrExtractOptions
): Promise<OcrExtractResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    // Prepare form data
    const formData: Record<string, any> = {};
    
    if (options.language) {
      formData.language = options.language;
    }
    
    if (options.pageRange) {
      formData.pageRange = options.pageRange;
    }
    
    if (options.pages) {
      formData.pages = options.pages;
    }
    
    if (options.preserveLayout !== undefined) {
      formData.preserveLayout = options.preserveLayout.toString();
    }
    
    // Upload file and request OCR text extraction
    const response = await client.uploadFile<OcrExtractResponse>(
      '/api/ocr/extract',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'OCR text extraction failed', 'extractText');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'extractText');
    } else {
      throw new FileOperationError('Unknown error occurred during OCR text extraction', 'extractText');
    }
  }
}