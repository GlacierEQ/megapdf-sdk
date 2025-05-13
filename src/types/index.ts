/**
 * Common types used throughout the MegaPDF SDK
 */

/**
 * Configuration options for the MegaPDF client
 */
export interface MegaPdfConfig {
    /**
     * API key for authentication
     */
    apiKey: string;
    
    /**
     * Base URL for API requests (defaults to https://api.mega-pdf.com)
     */
    baseUrl?: string;
    
    /**
     * Request timeout in milliseconds (defaults to 60000)
     */
    timeout?: number;
    
    /**
     * Whether to use HTTPS for requests (defaults to true)
     */
    https?: boolean;
    
    /**
     * Whether to retry failed requests (defaults to true)
     */
    retryOnFailure?: boolean;
    
    /**
     * Maximum number of retries for failed requests (defaults to 3)
     */
    maxRetries?: number;
  }
  
  /**
   * Common response format for all API operations
   */
  export interface ApiResponse<T = any> {
    /**
     * Whether the operation was successful
     */
    success: boolean;
    
    /**
     * Response message
     */
    message?: string;
    
    /**
     * Error message if operation failed
     */
    error?: string;
    
    /**
     * Operation-specific data
     */
    data?: T;
  }
  
  /**
   * File formats supported for conversion
   */
  export enum FileFormat {
    PDF = 'pdf',
    DOCX = 'docx',
    XLSX = 'xlsx',
    PPTX = 'pptx',
    JPG = 'jpg',
    JPEG = 'jpeg',
    PNG = 'png',
    TXT = 'txt',
    HTML = 'html',
    RTF = 'rtf'
  }
  
  /**
   * Compression quality levels
   */
  export enum CompressionQuality {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
  }
  
  /**
   * Subscription tiers
   */
  export enum SubscriptionTier {
    FREE = 'free',
    BASIC = 'basic',
    PRO = 'pro',
    ENTERPRISE = 'enterprise'
  }
  
  /**
   * Operation types supported by the API
   */
  export enum OperationType {
    CONVERT = 'convert',
    COMPRESS = 'compress',
    MERGE = 'merge',
    SPLIT = 'split',
    PROTECT = 'protect',
    UNLOCK = 'unlock',
    WATERMARK = 'watermark',
    OCR = 'ocr',
    SIGN = 'sign',
    ROTATE = 'rotate',
    PAGE_NUMBERS = 'pagenumber',
    REPAIR = 'repair',
    CHAT = 'chat',
    REMOVE = 'remove'
  }
  
  /**
   * File object that can be a Node.js Buffer, Browser File, or a URL string
   */
  export type FileInput = Buffer | Blob | File | string;
  
  /**
   * Page orientation options
   */
  export enum PageOrientation {
    PORTRAIT = 'portrait',
    LANDSCAPE = 'landscape'
  }
  
  /**
   * Watermark position options
   */
  export enum WatermarkPosition {
    TOP_LEFT = 'top-left',
    TOP_CENTER = 'top-center',
    TOP_RIGHT = 'top-right',
    CENTER = 'center',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_CENTER = 'bottom-center',
    BOTTOM_RIGHT = 'bottom-right',
    TILE = 'tile',
    CUSTOM = 'custom'
  }
  
  /**
   * OCR language options
   */
  export enum OcrLanguage {
    ENGLISH = 'eng',
    SPANISH = 'spa',
    FRENCH = 'fra',
    GERMAN = 'deu',
    ITALIAN = 'ita',
    PORTUGUESE = 'por',
    DUTCH = 'nld',
    CHINESE = 'chi_sim',
    JAPANESE = 'jpn',
    KOREAN = 'kor',
    ARABIC = 'ara',
    RUSSIAN = 'rus'
  }
  
  /**
   * Split method options
   */
  export enum SplitMethod {
    RANGE = 'range',
    EXTRACT = 'extract',
    EVERY = 'every'
  }
  
  /**
   * Page numbering position options
   */
  export enum PageNumberPosition {
    TOP_LEFT = 'top-left',
    TOP_CENTER = 'top-center',
    TOP_RIGHT = 'top-right',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_CENTER = 'bottom-center',
    BOTTOM_RIGHT = 'bottom-right'
  }