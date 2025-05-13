import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError, PasswordError } from '../errors';
import { PasswordCheckResponse, UnlockResponse } from '../types/api-responses';
import { PasswordCheckOptions, UnlockOptions } from '../types/options';
import { validateFileInput, validatePassword } from '../validation';

/**
 * Check if a PDF file is password protected
 * 
 * @param client MegaPDF client instance
 * @param options Password check options
 * @returns Password check response
 */
export async function checkPassword(
  client: MegaPdfClient,
  options: PasswordCheckOptions
): Promise<PasswordCheckResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    // Upload file and check if password protected
    const response = await client.uploadFile<PasswordCheckResponse>(
      '/api/pdf/unlock/check',
      options.file,
      {},
      options.onProgress
    );
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'checkPassword');
    } else {
      throw new FileOperationError('Unknown error occurred during password check', 'checkPassword');
    }
  }
}

/**
 * Unlock a password-protected PDF file
 * 
 * @param client MegaPDF client instance
 * @param options Unlock options
 * @returns Unlock response
 */
export async function unlock(
  client: MegaPdfClient,
  options: UnlockOptions
): Promise<UnlockResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    validatePassword(options.password);
    
    // Prepare form data
    const formData: Record<string, any> = {
      password: options.password,
    };
    
    // Upload file and request unlock
    const response = await client.uploadFile<UnlockResponse>(
      '/api/pdf/unlock',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      if (response.error?.toLowerCase().includes('password')) {
        throw new PasswordError(response.error);
      } else {
        throw new FileOperationError(response.error || 'Unlock failed', 'unlock');
      }
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'unlock');
    } else {
      throw new FileOperationError('Unknown error occurred during unlock', 'unlock');
    }
  }
}