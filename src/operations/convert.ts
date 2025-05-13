import { MegaPdfClient } from '../client';
import { ConversionError, MegaPdfError } from '../errors';
import { ConversionResponse } from '../types/api-responses';
import { ConvertOptions } from '../types/options';
import { validateFileFormat, validateFileInput, validateRange } from '../validation';

/**
 * Convert files from one format to another
 * 
 * @param client MegaPDF client instance
 * @param options Conversion options
 * @returns Conversion response
 */
export async function convert(
  client: MegaPdfClient,
  options: ConvertOptions
): Promise<ConversionResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    const supportedInputFormats = [
      'pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'jpeg', 'png', 'txt', 'html', 'rtf'
    ];
    
    const supportedOutputFormats = [
      'pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'jpeg', 'png', 'txt', 'html'
    ];
    
    if (options.inputFormat) {
      validateFileFormat(options.inputFormat, supportedInputFormats, 'inputFormat');
    }
    
    validateFileFormat(options.outputFormat, supportedOutputFormats, 'outputFormat');
    
    if (options.quality) {
      validateRange(options.quality, 1, 100, 'quality');
    }
    
    // Prepare form data
    const formData: Record<string, any> = {
      outputFormat: options.outputFormat,
    };
    
    if (options.inputFormat) {
      formData.inputFormat = options.inputFormat;
    }
    
    if (options.ocr !== undefined) {
      formData.ocr = options.ocr.toString();
    }
    
    if (options.quality) {
      formData.quality = options.quality.toString();
    }
    
    if (options.password) {
      formData.password = options.password;
    }
    
    // Upload file and request conversion
    const response = await client.uploadFile<ConversionResponse>(
      '/api/pdf/convert',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new ConversionError(response.error || 'Conversion failed');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new ConversionError(error.message);
    } else {
      throw new ConversionError('Unknown error occurred during conversion');
    }
  }
}