import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { ProtectResponse } from '../types/api-responses';
import { ProtectOptions } from '../types/options';
import { validateFileInput, validatePassword } from '../validation';

/**
 * Protect a PDF file with a password
 * 
 * @param client MegaPDF client instance
 * @param options Protect options
 * @returns Protect response
 */
export async function protect(
  client: MegaPdfClient,
  options: ProtectOptions
): Promise<ProtectResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    validatePassword(options.password);
    
    // Prepare form data
    const formData: Record<string, any> = {
      password: options.password,
    };
    
    if (options.permission) {
      formData.permission = options.permission;
    }
    
    if (options.protectionLevel) {
      formData.protectionLevel = options.protectionLevel;
    }
    
    if (options.allowPrinting !== undefined) {
      formData.allowPrinting = options.allowPrinting.toString();
    }
    
    if (options.allowCopying !== undefined) {
      formData.allowCopying = options.allowCopying.toString();
    }
    
    if (options.allowEditing !== undefined) {
      formData.allowEditing = options.allowEditing.toString();
    }
    
    // Upload file and request protection
    const response = await client.uploadFile<ProtectResponse>(
      '/api/pdf/protect',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Protection failed', 'protect');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'protect');
    } else {
      throw new FileOperationError('Unknown error occurred during protection', 'protect');
    }
  }
}