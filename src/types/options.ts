import {
    CompressionQuality,
    FileFormat,
    FileInput,
    OcrLanguage,
    PageNumberPosition,
    PageOrientation,
    SplitMethod,
    WatermarkPosition
  } from './index';
  
  /**
   * Base options interface for all operations
   */
  export interface BaseOptions {
    /**
     * Optional callback for progress updates
     */
    onProgress?: (progress: number) => void;
  }
  
  /**
   * Options for conversion operations
   */
  export interface ConvertOptions extends BaseOptions {
    /**
     * File to convert
     */
    file: FileInput;
    
    /**
     * Input format (auto-detected if not provided)
     */
    inputFormat?: FileFormat;
    
    /**
     * Output format to convert to
     */
    outputFormat: FileFormat;
    
    /**
     * Whether to perform OCR on the document (for PDF to text/document conversions)
     */
    ocr?: boolean;
    
    /**
     * Quality setting for image conversions (1-100)
     */
    quality?: number;
    
    /**
     * Password for protected PDF files
     */
    password?: string;
  }
  
  /**
   * Options for compression operations
   */
  export interface CompressOptions extends BaseOptions {
    /**
     * File to compress
     */
    file: FileInput;
    
    /**
     * Compression quality level
     */
    quality?: CompressionQuality;
  }
  
  /**
   * Options for merge operations
   */
  export interface MergeOptions extends BaseOptions {
    /**
     * Files to merge
     */
    files: FileInput[];
    
    /**
     * Order of files in the merged document (array of indices)
     */
    order?: number[];
  }
  
  /**
   * Options for split operations
   */
  export interface SplitOptions extends BaseOptions {
    /**
     * File to split
     */
    file: FileInput;
    
    /**
     * Split method
     */
    splitMethod?: SplitMethod;
    
    /**
     * Specific page ranges to extract (e.g., "1,3,5-7")
     */
    pageRanges?: string;
    
    /**
     * Number of pages per split document when using EVERY method
     */
    everyNPages?: number;
  }
  
  /**
   * Options for protect operations
   */
  export interface ProtectOptions extends BaseOptions {
    /**
     * File to protect
     */
    file: FileInput;
    
    /**
     * Password to set
     */
    password: string;
    
    /**
     * Permission level ('all' or 'restricted')
     */
    permission?: 'all' | 'restricted';
    
    /**
     * AES encryption key length (128 or 256)
     */
    protectionLevel?: '128' | '256';
    
    /**
     * Whether to allow printing
     */
    allowPrinting?: boolean;
    
    /**
     * Whether to allow copying
     */
    allowCopying?: boolean;
    
    /**
     * Whether to allow editing
     */
    allowEditing?: boolean;
  }
  
  /**
   * Options for unlock operations
   */
  export interface UnlockOptions extends BaseOptions {
    /**
     * File to unlock
     */
    file: FileInput;
    
    /**
     * Password to use for unlocking
     */
    password: string;
  }
  
  /**
   * Options for watermark operations
   */
  export interface WatermarkOptions extends BaseOptions {
    /**
     * File to watermark
     */
    file: FileInput;
    
    /**
     * Watermark type ('text' or 'image')
     */
    watermarkType: 'text' | 'image';
    
    /**
     * Text content for text watermarks
     */
    text?: string;
    
    /**
     * Text color for text watermarks (hex format)
     */
    textColor?: string;
    
    /**
     * Font size for text watermarks
     */
    fontSize?: number;
    
    /**
     * Font family for text watermarks
     */
    fontFamily?: string;
    
    /**
     * Image file for image watermarks
     */
    watermarkImage?: FileInput;
    
    /**
     * Scale percentage for image watermarks (1-100)
     */
    scale?: number;
    
    /**
     * Opacity percentage (1-100)
     */
    opacity?: number;
    
    /**
     * Rotation angle in degrees
     */
    rotation?: number;
    
    /**
     * Watermark position
     */
    position?: WatermarkPosition;
    
    /**
     * Custom X coordinate (when position is CUSTOM)
     */
    customX?: number;
    
    /**
     * Custom Y coordinate (when position is CUSTOM)
     */
    customY?: number;
    
    /**
     * Pages to apply watermark to ('all', 'even', 'odd', or 'custom')
     */
    pages?: 'all' | 'even' | 'odd' | 'custom';
    
    /**
     * Custom pages specification (when pages is 'custom')
     */
    customPages?: string;
  }
  
  /**
   * Options for OCR operations
   */
  export interface OcrOptions extends BaseOptions {
    /**
     * File to OCR
     */
    file: FileInput;
    
    /**
     * OCR language
     */
    language?: OcrLanguage;
    
    /**
     * Whether to enhance scanned images
     */
    enhanceScanned?: boolean;
    
    /**
     * Whether to preserve layout
     */
    preserveLayout?: boolean;
  }
  
  /**
   * Options for OCR text extraction
   */
  export interface OcrExtractOptions extends BaseOptions {
    /**
     * File to extract text from
     */
    file: FileInput;
    
    /**
     * OCR language
     */
    language?: OcrLanguage;
    
    /**
     * Page range to extract ('all' or 'specific')
     */
    pageRange?: 'all' | 'specific';
    
    /**
     * Specific pages to extract (when pageRange is 'specific')
     */
    pages?: string;
    
    /**
     * Whether to preserve layout
     */
    preserveLayout?: boolean;
  }
  
  /**
   * Element type for PDF signing
   */
  export interface SignatureElement {
    id: string;
    type: 'signature' | 'text' | 'stamp' | 'initials' | 'name' | 'date' | 'drawing' | 'image';
    position: { x: number; y: number };
    size: { width: number; height: number };
    data: string;
    rotation: number;
    scale: number;
    page: number;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  }
  
  /**
   * Page data for PDF signing
   */
  export interface PageData {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  }
  
  /**
   * Options for sign operations
   */
  export interface SignOptions extends BaseOptions {
    /**
     * File to sign
     */
    file: FileInput;
    
    /**
     * Signature elements to add
     */
    elements: SignatureElement[];
    
    /**
     * Page data
     */
    pages: PageData[];
    
    /**
     * Whether to perform OCR after signing
     */
    performOcr?: boolean;
    
    /**
     * OCR language when performOcr is true
     */
    ocrLanguage?: OcrLanguage;
  }
  
  /**
   * Page rotation specification
   */
  export interface PageRotation {
    pageNumber: number;
    angle: number;
    original: number;
  }
  
  /**
   * Options for rotate operations
   */
  export interface RotateOptions extends BaseOptions {
    /**
     * File to rotate
     */
    file: FileInput;
    
    /**
     * Rotation specifications
     */
    rotations: PageRotation[];
  }
  
  /**
   * Options for page numbering operations
   */
  export interface PageNumberOptions extends BaseOptions {
    /**
     * File to add page numbers to
     */
    file: FileInput;
    
    /**
     * Number format ('numeric', 'roman', or 'alphabetic')
     */
    format?: 'numeric' | 'roman' | 'alphabetic';
    
    /**
     * Position of page numbers
     */
    position?: PageNumberPosition;
    
    /**
     * Font family
     */
    fontFamily?: string;
    
    /**
     * Font size
     */
    fontSize?: number;
    
    /**
     * Text color (hex format)
     */
    color?: string;
    
    /**
     * Starting page number
     */
    startNumber?: number;
    
    /**
     * Text to display before the page number
     */
    prefix?: string;
    
    /**
     * Text to display after the page number
     */
    suffix?: string;
    
    /**
     * Horizontal margin in points
     */
    marginX?: number;
    
    /**
     * Vertical margin in points
     */
    marginY?: number;
    
    /**
     * Pages to add numbers to (comma-separated list or ranges)
     */
    selectedPages?: string;
    
    /**
     * Whether to skip the first page
     */
    skipFirstPage?: boolean;
  }
  
  /**
   * Options for repair operations
   */
  export interface RepairOptions extends BaseOptions {
    /**
     * File to repair
     */
    file: FileInput;
    
    /**
     * Repair mode ('standard', 'advanced', or 'optimization')
     */
    repairMode?: 'standard' | 'advanced' | 'optimization';
    
    /**
     * Password for encrypted PDFs
     */
    password?: string;
    
    /**
     * Whether to preserve form fields
     */
    preserveFormFields?: boolean;
    
    /**
     * Whether to preserve annotations
     */
    preserveAnnotations?: boolean;
    
    /**
     * Whether to preserve bookmarks
     */
    preserveBookmarks?: boolean;
    
    /**
     * Whether to optimize images
     */
    optimizeImages?: boolean;
  }
  
  /**
   * Options for PDF chat operations
   */
  export interface ChatOptions extends BaseOptions {
    /**
     * PDF file to chat about
     */
    file: FileInput;
  }
  
  /**
   * Options for sending chat messages
   */
  export interface ChatMessageOptions extends BaseOptions {
    /**
     * Session ID from previous chat initialization
     */
    sessionId: string;
    
    /**
     * Message to send
     */
    message: string;
  }
  
  /**
   * Options for removing pages
   */
  export interface RemoveOptions extends BaseOptions {
    /**
     * File to remove pages from
     */
    file: FileInput;
    
    /**
     * Page numbers to remove
     */
    pagesToRemove: number[];
  }
  
  /**
   * Options for checking if a PDF is password protected
   */
  export interface PasswordCheckOptions extends BaseOptions {
    /**
     * File to check
     */
    file: FileInput;
  }