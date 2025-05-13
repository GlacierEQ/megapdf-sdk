import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { WatermarkResponse } from '../types/api-responses';
import { WatermarkOptions } from '../types/options';
import { validateFileInput, validateRange } from '../validation';

/**
 * Add a watermark to a PDF file
 * 
 * @param client MegaPDF client instance
 * @param options Watermark options
 * @returns Watermark response
 */
export async function watermark(
  client: MegaPdfClient,
  options: WatermarkOptions
): Promise<WatermarkResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    if (options.watermarkType !== 'text' && options.watermarkType !== 'image') {
      throw new FileOperationError('Watermark type must be "text" or "image"', 'watermark');
    }
    
    if (options.watermarkType === 'text' && !options.text) {
      throw new FileOperationError('Text content is required for text watermarks', 'watermark');
    }
    
    if (options.watermarkType === 'image' && !options.watermarkImage) {
      throw new FileOperationError('Image file is required for image watermarks', 'watermark');
    }
    
    if (options.opacity !== undefined) {
      validateRange(options.opacity, 1, 100, 'opacity');
    }
    
    if (options.rotation !== undefined) {
      validateRange(options.rotation, 0, 360, 'rotation');
    }
    
    if (options.scale !== undefined) {
      validateRange(options.scale, 1, 100, 'scale');
    }
    
    // Prepare form data
    const formData: Record<string, any> = {
      watermarkType: options.watermarkType,
    };
    
    // Text watermark options
    if (options.watermarkType === 'text') {
      formData.text = options.text;
      
      if (options.textColor) {
        formData.textColor = options.textColor;
      }
      
      if (options.fontSize) {
        formData.fontSize = options.fontSize.toString();
      }
      
      if (options.fontFamily) {
        formData.fontFamily = options.fontFamily;
      }
    }
    
    // Position and other common options
    if (options.position) {
      formData.position = options.position;
    }
    
    if (options.customX !== undefined && options.position === 'custom') {
      formData.customX = options.customX.toString();
    }
    
    if (options.customY !== undefined && options.position === 'custom') {
      formData.customY = options.customY.toString();
    }
    
    if (options.opacity !== undefined) {
      formData.opacity = options.opacity.toString();
    }
    
    if (options.rotation !== undefined) {
      formData.rotation = options.rotation.toString();
    }
    
    if (options.scale !== undefined) {
      formData.scale = options.scale.toString();
    }
    
    if (options.pages) {
      formData.pages = options.pages;
    }
    
    if (options.customPages) {
      formData.customPages = options.customPages;
    }
    
    // Process the request differently based on watermark type
    if (options.watermarkType === 'text') {
      // For text watermarks, we can upload the file directly
      const response = await client.uploadFile<WatermarkResponse>(
        '/api/pdf/watermark',
        options.file,
        formData,
        options.onProgress
      );
      
      if (!response.success) {
        throw new FileOperationError(response.error || 'Watermarking failed', 'watermark');
      }
      
      return response;
    } else {
      // For image watermarks, we need to handle multiple files
      // Ensure watermarkImage is available
      if (!options.watermarkImage) {
        throw new FileOperationError('Watermark image is required', 'watermark');
      }
      
      // Create multipart form data manually
      const formDataWithFiles = new FormData();
      
      // Main PDF file
      if (typeof options.file === 'string') {
        if (options.file.startsWith('http')) {
          // Fetch the remote file first
          const fileData = await client.downloadFile(options.file);
          formDataWithFiles.append('file', new Blob([fileData], {type: 'application/pdf'}), 'document.pdf');
        } else {
          throw new FileOperationError('Invalid file URL', 'watermark');
        }
      } else if (Buffer.isBuffer(options.file)) {
        formDataWithFiles.append('file', new Blob([options.file], {type: 'application/pdf'}), 'document.pdf');
      } else {
        formDataWithFiles.append('file', options.file);
      }
      
      // Watermark image
      if (typeof options.watermarkImage === 'string') {
        if (options.watermarkImage.startsWith('http')) {
          // Fetch the remote file first
          const imageData = await client.downloadFile(options.watermarkImage);
          formDataWithFiles.append('watermarkImage', new Blob([imageData]), 'watermark.png');
        } else {
          throw new FileOperationError('Invalid watermark image URL', 'watermark');
        }
      } else if (Buffer.isBuffer(options.watermarkImage)) {
        formDataWithFiles.append('watermarkImage', new Blob([options.watermarkImage]), 'watermark.png');
      } else {
        formDataWithFiles.append('watermarkImage', options.watermarkImage);
      }
      
      // Add other params
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithFiles.append(key, value);
      });
      
      // Make the request with modified form data structure
      const response = await client.post<WatermarkResponse>(
        '/api/pdf/watermark',
        formDataWithFiles,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: options.onProgress 
            ? (event) => {
                const progress = Math.round((event.loaded * 100) / (event.total || 100));
                options.onProgress!(progress);
              }
            : undefined,
        }
      );
      
      if (!response.success) {
        throw new FileOperationError(response.error || 'Watermarking failed', 'watermark');
      }
      
      return response;
    }
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'watermark');
    } else {
      throw new FileOperationError('Unknown error occurred during watermarking', 'watermark');
    }
  }
}