import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { RepairResponse } from '../types/api-responses';
import { RepairOptions } from '../types/options';
import { validateFileInput } from '../validation';

/**
 * Repair a damaged or corrupted PDF
 * 
 * @param client MegaPDF client instance
 * @param options Repair options
 * @returns Repair response
 */
export async function repair(
  client: MegaPdfClient,
  options: RepairOptions
): Promise<RepairResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    // Prepare form data
    const formData: Record<string, any> = {};
    
    if (options.repairMode) {
      formData.repairMode = options.repairMode;
    }
    
    if (options.password) {
      formData.password = options.password;
    }
    
    if (options.preserveFormFields !== undefined) {
      formData.preserveFormFields = options.preserveFormFields.toString();
    }
    
    if (options.preserveAnnotations !== undefined) {
      formData.preserveAnnotations = options.preserveAnnotations.toString();
    }
    
    if (options.preserveBookmarks !== undefined) {
      formData.preserveBookmarks = options.preserveBookmarks.toString();
    }
    
    if (options.optimizeImages !== undefined) {
      formData.optimizeImages = options.optimizeImages.toString();
    }
    
    // Upload file and request repair
    const response = await client.uploadFile<RepairResponse>(
      '/api/pdf/repair',
      options.file,
      formData,
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Repair failed', 'repair');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'repair');
    } else {
      throw new FileOperationError('Unknown error occurred during repair', 'repair');
    }
  }
}