import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';
import { DEFAULT_CONFIG, mergeConfig } from './config';
import { 
  AuthenticationError, 
  MegaPdfError,
  NetworkError, 
  RateLimitError, 
  ServerError, 
  TimeoutError,
  createErrorFromResponse
} from './errors';
import { ApiResponse, FileInput, MegaPdfConfig } from './types';

/**
 * Base client for interacting with the MegaPDF API
 */
export class MegaPdfClient {
  /**
   * Axios instance for making HTTP requests
   */
  private client: AxiosInstance;
  
  /**
   * Configuration options
   */
  private config: MegaPdfConfig;
  
  /**
   * Constructor for MegaPdfClient
   * 
   * @param config Configuration options
   */
  constructor(config: MegaPdfConfig) {
    this.config = mergeConfig(config);
    
    // Create Axios instance with base configuration
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'x-api-key': this.config.apiKey,
      },
    });
    
    // Add request interceptor for authentication
    this.client.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      config.headers['x-api-key'] = this.config.apiKey;
      return config;
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          // Handle server errors
          const status = error.response.status;
          
          if (status === 401) {
            throw new AuthenticationError(error.response.data?.error || 'API key is invalid or missing');
          } else if (status === 429) {
            throw new RateLimitError(
              error.response.data?.error || 'Rate limit exceeded',
              error.response.headers['x-ratelimit-reset'] ? new Date(error.response.headers['x-ratelimit-reset']) : undefined
            );
          } else if (status >= 500) {
            throw new ServerError(error.response.data?.error || 'Server error occurred', status);
          } else {
            throw createErrorFromResponse(error.response);
          }
        } else if (error.request) {
          // Handle network errors
          if (error.code === 'ECONNABORTED') {
            throw new TimeoutError('Request timed out');
          } else {
            throw new NetworkError('Network request failed');
          }
        } else {
          // Handle unknown errors
          throw new MegaPdfError(error.message || 'Unknown error occurred');
        }
      }
    );
  }
  
  /**
   * Make a GET request to the API
   * 
   * @param path API path
   * @param params Query parameters
   * @returns API response
   */
  async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.get<T>(path, { params });
      return response.data;
    } catch (error) {
      if (error instanceof MegaPdfError) {
        throw error;
      } else if (error instanceof Error) {
        throw new MegaPdfError(error.message);
      } else {
        throw new MegaPdfError('Unknown error occurred');
      }
    }
  }
  
  /**
   * Make a POST request to the API
   * 
   * @param path API path
   * @param data Request body
   * @param config Additional request configuration
   * @returns API response
   */
  async post<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(path, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof MegaPdfError) {
        throw error;
      } else if (error instanceof Error) {
        throw new MegaPdfError(error.message);
      } else {
        throw new MegaPdfError('Unknown error occurred');
      }
    }
  }
  
  /**
   * Make a multipart POST request to the API with file upload
   * 
   * @param path API path
   * @param file File to upload
   * @param additionalData Additional form data
   * @param onProgress Progress callback
   * @returns API response
   */
  async uploadFile<T = any>(
    path: string, 
    file: FileInput, 
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    
    // Add file to form data
    if (Buffer.isBuffer(file)) {
      // Node.js Buffer
      formData.append('file', file, {
        filename: 'file.pdf',
        contentType: 'application/pdf',
      });
    } else if (typeof file === 'string') {
      // URL string
      if (file.startsWith('http')) {
        // Fetch remote file
        const response = await axios.get(file, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        formData.append('file', buffer, {
          filename: file.split('/').pop() || 'file.pdf',
          contentType: response.headers['content-type'] || 'application/pdf',
        });
      } else {
        throw new MegaPdfError('Invalid file URL. Must start with http or https.');
      }
    } else if (file instanceof Blob || (typeof File !== 'undefined' && file instanceof File)) {
      // Browser File or Blob
      formData.append('file', file);
    } else {
      throw new MegaPdfError('Invalid file input');
    }
    
    // Add additional data to form data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        
        if (typeof value === 'object' && !(value instanceof Blob) && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
    }
    
    try {
      const response = await this.client.post<T>(path, formData, {
        headers: {
          ...formData.getHeaders?.() || {}, // Node.js only
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress
          ? (event) => {
              const progress = Math.round((event.loaded * 100) / (event.total || 100));
              onProgress(progress);
            }
          : undefined,
      });
      
      return response.data;
    } catch (error) {
      if (error instanceof MegaPdfError) {
        throw error;
      } else if (error instanceof Error) {
        throw new MegaPdfError(error.message);
      } else {
        throw new MegaPdfError('Unknown error occurred');
      }
    }
  }
  
  /**
   * Make a multipart POST request to the API with multiple file uploads
   * 
   * @param path API path
   * @param files Files to upload
   * @param additionalData Additional form data
   * @param onProgress Progress callback
   * @returns API response
   */
  async uploadFiles<T = any>(
    path: string, 
    files: FileInput[], 
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    
    // Add files to form data
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (Buffer.isBuffer(file)) {
        // Node.js Buffer
        formData.append('files', file, {
          filename: `file${i}.pdf`,
          contentType: 'application/pdf',
        });
      } else if (typeof file === 'string') {
        // URL string
        if (file.startsWith('http')) {
          // Fetch remote file
          const response = await axios.get(file, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data);
          formData.append('files', buffer, {
            filename: file.split('/').pop() || `file${i}.pdf`,
            contentType: response.headers['content-type'] || 'application/pdf',
          });
        } else {
          throw new MegaPdfError('Invalid file URL. Must start with http or https.');
        }
      } else if (file instanceof Blob || (typeof File !== 'undefined' && file instanceof File)) {
        // Browser File or Blob
        formData.append('files', file);
      } else {
        throw new MegaPdfError('Invalid file input');
      }
    }
    
    // Add additional data to form data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        
        if (typeof value === 'object' && !(value instanceof Blob) && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
    }
    
    try {
      const response = await this.client.post<T>(path, formData, {
        headers: {
          ...formData.getHeaders?.() || {}, // Node.js only
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress
          ? (event) => {
              const progress = Math.round((event.loaded * 100) / (event.total || 100));
              onProgress(progress);
            }
          : undefined,
      });
      
      return response.data;
    } catch (error) {
      if (error instanceof MegaPdfError) {
        throw error;
      } else if (error instanceof Error) {
        throw new MegaPdfError(error.message);
      } else {
        throw new MegaPdfError('Unknown error occurred');
      }
    }
  }
  
  /**
   * Download a file from a URL
   * 
   * @param url URL of the file to download
   * @returns File buffer
   */
  async downloadFile(url: string): Promise<Buffer> {
    try {
      const response = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
      });
      
      return Buffer.from(response.data);
    } catch (error) {
      if (error instanceof MegaPdfError) {
        throw error;
      } else if (error instanceof Error) {
        throw new MegaPdfError(error.message);
      } else {
        throw new MegaPdfError('Unknown error occurred');
      }
    }
  }
  
  /**
   * Get the full URL for a relative file URL
   * 
   * @param fileUrl Relative file URL
   * @returns Full URL
   */
  getFullUrl(fileUrl: string): string {
    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }
    
    const baseUrl = this.config.baseUrl?.replace(/\/+$/, '');
    const cleanFileUrl = fileUrl.replace(/^\/+/, '');
    
    return `${baseUrl}/${cleanFileUrl}`;
  }
}