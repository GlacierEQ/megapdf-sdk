import { FileFormat, FileInput, OperationType } from './types';
import { ValidationError } from './errors';

/**
 * Check if a value is defined (not null or undefined)
 * 
 * @param value Value to check
 * @returns Whether the value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Validate that a required parameter is provided
 * 
 * @param value Parameter value
 * @param name Parameter name
 * @throws ValidationError if the parameter is not provided
 */
export function validateRequired<T>(value: T | null | undefined, name: string): void {
  if (!isDefined(value)) {
    throw new ValidationError(`${name} is required`, name);
  }
}

/**
 * Validate that a file input is provided
 * 
 * @param file File input
 * @param fieldName Field name
 * @throws ValidationError if the file is not provided
 */
export function validateFileInput(file: FileInput | null | undefined, fieldName: string = 'file'): void {
  validateRequired(file, fieldName);
  
  if (typeof file === 'string' && !file.startsWith('http')) {
    throw new ValidationError(`${fieldName} URL must start with http or https`, fieldName);
  }
}

/**
 * Validate that multiple file inputs are provided
 * 
 * @param files Array of file inputs
 * @param fieldName Field name
 * @throws ValidationError if no files are provided
 */
export function validateMultipleFileInputs(files: FileInput[] | null | undefined, fieldName: string = 'files'): void {
  validateRequired(files, fieldName);
  
  if (files && (!Array.isArray(files) || files.length === 0)) {
    throw new ValidationError(`${fieldName} must be a non-empty array`, fieldName);
  }
  
  if (files) {
    files.forEach((file, index) => {
      validateFileInput(file, `${fieldName}[${index}]`);
    });
  }
}

/**
 * Validate that a file format is supported
 * 
 * @param format File format
 * @param supportedFormats Array of supported formats
 * @param fieldName Field name
 * @throws ValidationError if the format is not supported
 */
export function validateFileFormat(format: string, supportedFormats: string[], fieldName: string = 'format'): void {
  validateRequired(format, fieldName);
  
  if (!supportedFormats.includes(format)) {
    throw new ValidationError(
      `${fieldName} '${format}' is not supported. Supported formats: ${supportedFormats.join(', ')}`,
      fieldName
    );
  }
}

/**
 * Validate that an operation type is supported
 * 
 * @param operation Operation type
 * @param fieldName Field name
 * @throws ValidationError if the operation is not supported
 */
export function validateOperation(operation: string, fieldName: string = 'operation'): void {
  validateRequired(operation, fieldName);
  
  const operations = Object.values(OperationType);
  if (!operations.includes(operation as OperationType)) {
    throw new ValidationError(
      `${fieldName} '${operation}' is not supported. Supported operations: ${operations.join(', ')}`,
      fieldName
    );
  }
}

/**
 * Validate that a number is within a given range
 * 
 * @param value Number value
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @param fieldName Field name
 * @throws ValidationError if the number is not within the range
 */
export function validateRange(value: number, min: number, max: number, fieldName: string): void {
  validateRequired(value, fieldName);
  
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      fieldName
    );
  }
}

/**
 * Validate that a page range string is correctly formatted
 * 
 * @param pageRange Page range string (e.g., "1,3,5-7")
 * @param fieldName Field name
 * @throws ValidationError if the page range is not correctly formatted
 */
export function validatePageRange(pageRange: string, fieldName: string = 'pageRange'): void {
  validateRequired(pageRange, fieldName);
  
  const regex = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;
  if (!regex.test(pageRange)) {
    throw new ValidationError(
      `${fieldName} must be a comma-separated list of page numbers or ranges (e.g., "1,3,5-7")`,
      fieldName
    );
  }
}

/**
 * Validate that an array of page numbers is valid
 * 
 * @param pages Array of page numbers
 * @param totalPages Total number of pages
 * @param fieldName Field name
 * @throws ValidationError if any page number is invalid
 */
export function validatePageNumbers(pages: number[], totalPages: number, fieldName: string = 'pages'): void {
  validateRequired(pages, fieldName);
  
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new ValidationError(`${fieldName} must be a non-empty array`, fieldName);
  }
  
  for (const page of pages) {
    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
      throw new ValidationError(
        `${fieldName} contains invalid page number: ${page}. Must be between 1 and ${totalPages}`,
        fieldName
      );
    }
  }
}

/**
 * Validate that a password is provided and meets minimum requirements
 * 
 * @param password Password string
 * @param fieldName Field name
 * @throws ValidationError if the password is not valid
 */
export function validatePassword(password: string, fieldName: string = 'password'): void {
  validateRequired(password, fieldName);
  
  if (password.length < 1) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }
}

/**
 * Validate that a hex color string is correctly formatted
 * 
 * @param color Hex color string (e.g., "#FF0000")
 * @param fieldName Field name
 * @throws ValidationError if the color is not correctly formatted
 */
export function validateHexColor(color: string, fieldName: string = 'color'): void {
  validateRequired(color, fieldName);
  
  const regex = /^#[0-9A-Fa-f]{6}$/;
  if (!regex.test(color)) {
    throw new ValidationError(
      `${fieldName} must be a valid hex color (e.g., "#FF0000")`,
      fieldName
    );
  }
}