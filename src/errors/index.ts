/**
 * Base error class for MegaPDF SDK
 */
export class MegaPdfError extends Error {
    /**
     * HTTP status code of the error (if applicable)
     */
    statusCode?: number;
    
    /**
     * Constructor for MegaPdfError
     * 
     * @param message Error message
     * @param statusCode HTTP status code (if applicable)
     */
    constructor(message: string, statusCode?: number) {
      super(message);
      this.name = 'MegaPdfError';
      this.statusCode = statusCode;
      
      // This is necessary for proper instance checking with TypeScript
      Object.setPrototypeOf(this, MegaPdfError.prototype);
    }
  }
  
  /**
   * Error thrown when authentication fails
   */
  export class AuthenticationError extends MegaPdfError {
    constructor(message: string = 'API key is invalid or missing') {
      super(message, 401);
      this.name = 'AuthenticationError';
      
      Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
  }
  
  /**
   * Error thrown when rate limits are exceeded
   */
  export class RateLimitError extends MegaPdfError {
    /**
     * Time when rate limit resets
     */
    resetTime?: Date;
    
    /**
     * Constructor for RateLimitError
     * 
     * @param message Error message
     * @param resetTime Time when rate limit resets
     */
    constructor(message: string = 'Rate limit exceeded', resetTime?: Date) {
      super(message, 429);
      this.name = 'RateLimitError';
      this.resetTime = resetTime;
      
      Object.setPrototypeOf(this, RateLimitError.prototype);
    }
  }
  
  /**
   * Error thrown when provided input is invalid
   */
  export class ValidationError extends MegaPdfError {
    /**
     * Field that failed validation
     */
    field?: string;
    
    /**
     * Constructor for ValidationError
     * 
     * @param message Error message
     * @param field Field that failed validation
     */
    constructor(message: string, field?: string) {
      super(message, 400);
      this.name = 'ValidationError';
      this.field = field;
      
      Object.setPrototypeOf(this, ValidationError.prototype);
    }
  }
  
  /**
   * Error thrown when file conversion fails
   */
  export class ConversionError extends MegaPdfError {
    constructor(message: string = 'File conversion failed') {
      super(message, 500);
      this.name = 'ConversionError';
      
      Object.setPrototypeOf(this, ConversionError.prototype);
    }
  }
  
  /**
   * Error thrown when file operation fails
   */
  export class FileOperationError extends MegaPdfError {
    /**
     * Name of the operation that failed
     */
    operation?: string;
    
    /**
     * Constructor for FileOperationError
     * 
     * @param message Error message
     * @param operation Name of the operation that failed
     */
    constructor(message: string, operation?: string) {
      super(message, 500);
      this.name = 'FileOperationError';
      this.operation = operation;
      
      Object.setPrototypeOf(this, FileOperationError.prototype);
    }
  }
  
  /**
   * Error thrown when network request fails
   */
  export class NetworkError extends MegaPdfError {
    constructor(message: string = 'Network request failed') {
      super(message, 0);
      this.name = 'NetworkError';
      
      Object.setPrototypeOf(this, NetworkError.prototype);
    }
  }
  
  /**
   * Error thrown when server returns an error
   */
  export class ServerError extends MegaPdfError {
    constructor(message: string = 'Server error occurred', statusCode: number = 500) {
      super(message, statusCode);
      this.name = 'ServerError';
      
      Object.setPrototypeOf(this, ServerError.prototype);
    }
  }
  
  /**
   * Error thrown when operation times out
   */
  export class TimeoutError extends MegaPdfError {
    constructor(message: string = 'Operation timed out') {
      super(message, 0);
      this.name = 'TimeoutError';
      
      Object.setPrototypeOf(this, TimeoutError.prototype);
    }
  }
  
  /**
   * Error thrown when password is incorrect
   */
  export class PasswordError extends MegaPdfError {
    constructor(message: string = 'Incorrect password provided') {
      super(message, 400);
      this.name = 'PasswordError';
      
      Object.setPrototypeOf(this, PasswordError.prototype);
    }
  }
  
  /**
   * Factory function to create appropriate error instance based on API response
   * 
   * @param response API error response
   * @returns Appropriate error instance
   */
  export function createErrorFromResponse(response: any): MegaPdfError {
    const statusCode = response?.status || 500;
    const message = response?.data?.error || 'Unknown error occurred';
    
    switch (statusCode) {
      case 401:
        return new AuthenticationError(message);
      case 429:
        return new RateLimitError(message);
      case 400:
        return new ValidationError(message);
      case 500:
        return new ServerError(message, statusCode);
      default:
        return new MegaPdfError(message, statusCode);
    }
  }