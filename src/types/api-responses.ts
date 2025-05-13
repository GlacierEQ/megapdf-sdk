import { ApiResponse } from './index';

/**
 * Response for conversion operations
 */
export interface ConversionResponse extends ApiResponse {
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  inputFormat?: string;
  outputFormat?: string;
}

/**
 * Response for compression operations
 */
export interface CompressionResponse extends ApiResponse {
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: string;
}

/**
 * Response for merge operations
 */
export interface MergeResponse extends ApiResponse {
  fileUrl?: string;
  filename?: string;
  mergedSize?: number;
  totalInputSize?: number;
  fileCount?: number;
}

/**
 * Response for split operations
 */
export interface SplitResponse extends ApiResponse {
  jobId?: string;
  statusUrl?: string;
  originalName?: string;
  totalPages?: number;
  estimatedSplits?: number;
  isLargeJob?: boolean;
  splitParts?: Array<{
    fileUrl: string;
    filename: string;
    pages: number[];
    pageCount: number;
  }>;
}

/**
 * Response for protection operations
 */
export interface ProtectResponse extends ApiResponse {
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  methodUsed?: string;
}

/**
 * Response for unlock operations
 */
export interface UnlockResponse extends ApiResponse {
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  methodUsed?: string;
}

/**
 * Response for watermark operations
 */
export interface WatermarkResponse extends ApiResponse {
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  pagesWatermarked?: number;
}

/**
 * Response for OCR operations
 */
export interface OcrResponse extends ApiResponse {
  fileUrl?: string;
  searchablePdfUrl?: string;
  processedFile?: string;
  language?: string;
  text?: string;
  wordCount?: number;
  useSystemTesseract?: boolean;
}

/**
 * Response for extract OCR text operations
 */
export interface OcrExtractResponse extends ApiResponse {
  text?: string;
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  pagesProcessed?: number;
  totalPages?: number;
  wordCount?: number;
}

/**
 * Response for sign operations
 */
export interface SignResponse extends ApiResponse {
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  ocrComplete?: boolean;
  searchablePdfUrl?: string;
  searchablePdfFilename?: string;
  ocrText?: string;
  ocrTextUrl?: string;
}

/**
 * Response for rotate operations
 */
export interface RotateResponse extends ApiResponse {
  fileUrl?: string;
  fileName?: string;
  originalName?: string;
  pagesRotated?: number;
}

/**
 * Response for page numbering operations
 */
export interface PageNumberResponse extends ApiResponse {
  fileUrl?: string;
  fileName?: string;
  originalName?: string;
  totalPages?: number;
  numberedPages?: number;
}

/**
 * Response for repair operations
 */
export interface RepairResponse extends ApiResponse {
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  details?: {
    originalSize?: number;
    newSize?: number;
    fixed?: string[];
    warnings?: string[];
  };
}

/**
 * Response for PDF chat operations
 */
export interface ChatResponse extends ApiResponse {
  message?: string;
  sessionId?: string;
  originalName?: string;
}

/**
 * Response for chat message operations
 */
export interface ChatMessageResponse extends ApiResponse {
  message?: string;
}

/**
 * Response for remove pages operations
 */
export interface RemoveResponse extends ApiResponse {
  fileUrl?: string;
  fileName?: string;
  originalName?: string;
  pagesRemoved?: number;
  remainingPages?: number;
}

/**
 * Response for password check operations
 */
export interface PasswordCheckResponse extends ApiResponse {
  isPasswordProtected: boolean;
}

/**
 * Response for split job status operations
 */
export interface SplitStatusResponse extends ApiResponse {
  id?: string;
  status?: 'processing' | 'completed' | 'error';
  progress?: number;
  total?: number;
  completed?: number;
  results?: Array<{
    fileUrl: string;
    filename: string;
    pages: number[];
    pageCount: number;
  }>;
}