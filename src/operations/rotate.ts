import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { RotateResponse } from '../types/api-responses';
import { RotateOptions } from '../types/options';
import { validateFileInput } from '../validation';

/**
 * Rotate pages in a PDF
 * 
 * @param client MegaPDF client instance
 * @param options Rotate options
 * @returns Rotate response
 */
export async function rotate(
  client: MegaPdfClient,
  options: RotateOptions
): Promise<RotateResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    if (!options.rotations || !Array.isArray(options.rotations) || options.rotations.length === 0) {
      throw new FileOperationError('Page rotation specifications are required', 'rotate');
    }
    
    // Validate each rotation specification
    for (const rotation of options.rotations) {
      if (!rotation.pageNumber || rotation.pageNumber < 1) {
        throw new FileOperationError(`Invalid page number: ${rotation.pageNumber}`, 'rotate');
      }
      
      if (rotation.angle % 90 !== 0) {
        throw new FileOperationError(`Rotation angle must be a multiple of 90 degrees: ${rotation.angle}`, 'rotate');
      }
    }
    
    // Prepare form data
    const formData: Record<string, any> = {
      rotations: JSON.stringify(options.rotations),
    };
    
    // Upload file and request rotation
    const response = await client.uploadFile<RotateResponse>(
      '/api/pdf/rotate',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Rotation failed', 'rotate');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'rotate');
    } else {
      throw new FileOperationError('Unknown error occurred during rotation', 'rotate');
    }
  }
}