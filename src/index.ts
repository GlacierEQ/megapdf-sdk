import { MegaPdfClient } from './client';
import { MegaPdfConfig } from './types';
import * as operations from './operations';
import * as errors from './errors';

/**
 * Main MegaPDF SDK class
 */
export class MegaPDF {
  /**
   * API client instance
   */
  private client: MegaPdfClient;
  
  /**
   * Constructor for MegaPDF SDK
   * 
   * @param config Configuration options
   */
  constructor(config: MegaPdfConfig) {
    this.client = new MegaPdfClient(config);
  }
  
  /**
   * Convert a file from one format to another
   * 
   * @param options Conversion options
   * @returns Conversion response
   */
  async convert(options: Parameters<typeof operations.convert>[1]) {
    return operations.convert(this.client, options);
  }
  
  /**
   * Compress a PDF file to reduce its size
   * 
   * @param options Compression options
   * @returns Compression response
   */
  async compress(options: Parameters<typeof operations.compress>[1]) {
    return operations.compress(this.client, options);
  }
  
  /**
   * Merge multiple PDF files into a single PDF
   * 
   * @param options Merge options
   * @returns Merge response
   */
  async merge(options: Parameters<typeof operations.merge>[1]) {
    return operations.merge(this.client, options);
  }
  
  /**
   * Split a PDF file into multiple PDF files
   * 
   * @param options Split options
   * @returns Split response
   */
  async split(options: Parameters<typeof operations.split>[1]) {
    return operations.split(this.client, options);
  }
  
  /**
   * Get the status of a split job
   * 
   * @param jobId Split job ID
   * @returns Split status response
   */
  async getSplitStatus(jobId: string) {
    return operations.getSplitStatus(this.client, jobId);
  }
  
  /**
   * Protect a PDF file with a password
   * 
   * @param options Protect options
   * @returns Protect response
   */
  async protect(options: Parameters<typeof operations.protect>[1]) {
    return operations.protect(this.client, options);
  }
  
  /**
   * Check if a PDF file is password protected
   * 
   * @param options Password check options
   * @returns Password check response
   */
  async checkPassword(options: Parameters<typeof operations.checkPassword>[1]) {
    return operations.checkPassword(this.client, options);
  }
  
  /**
   * Unlock a password-protected PDF file
   * 
   * @param options Unlock options
   * @returns Unlock response
   */
  async unlock(options: Parameters<typeof operations.unlock>[1]) {
    return operations.unlock(this.client, options);
  }
  
  /**
   * Add a watermark to a PDF file
   * 
   * @param options Watermark options
   * @returns Watermark response
   */
  async watermark(options: Parameters<typeof operations.watermark>[1]) {
    return operations.watermark(this.client, options);
  }
  
  /**
   * Convert a PDF to a searchable PDF using OCR
   * 
   * @param options OCR options
   * @returns OCR response
   */
  async ocr(options: Parameters<typeof operations.ocr>[1]) {
    return operations.ocr(this.client, options);
  }
  
  /**
   * Extract text from a PDF using OCR
   * 
   * @param options OCR extract options
   * @returns OCR extract response
   */
  async extractText(options: Parameters<typeof operations.extractText>[1]) {
    return operations.extractText(this.client, options);
  }
  
  /**
   * Sign a PDF with signatures, text, stamps, etc.
   * 
   * @param options Sign options
   * @returns Sign response
   */
  async sign(options: Parameters<typeof operations.sign>[1]) {
    return operations.sign(this.client, options);
  }
  
  /**
   * Rotate pages in a PDF
   * 
   * @param options Rotate options
   * @returns Rotate response
   */
  async rotate(options: Parameters<typeof operations.rotate>[1]) {
    return operations.rotate(this.client, options);
  }
  
  /**
   * Add page numbers to a PDF
   * 
   * @param options Page number options
   * @returns Page number response
   */
  async addPageNumbers(options: Parameters<typeof operations.addPageNumbers>[1]) {
    return operations.addPageNumbers(this.client, options);
  }
  
  /**
   * Repair a damaged or corrupted PDF
   * 
   * @param options Repair options
   * @returns Repair response
   */
  async repair(options: Parameters<typeof operations.repair>[1]) {
    return operations.repair(this.client, options);
  }
  
  /**
   * Initialize a chat session with a PDF
   * 
   * @param options Chat options
   * @returns Chat response with session ID
   */
  async chat(options: Parameters<typeof operations.chat>[1]) {
    return operations.chat(this.client, options);
  }
  
  /**
   * Send a message to an existing chat session
   * 
   * @param options Chat message options
   * @returns Chat message response
   */
  async sendChatMessage(options: Parameters<typeof operations.sendChatMessage>[1]) {
    return operations.sendChatMessage(this.client, options);
  }
  
  /**
   * Get the chat history for a session
   * 
   * @param sessionId Chat session ID
   * @returns Chat session history
   */
  async getChatHistory(sessionId: string) {
    return operations.getChatHistory(this.client, sessionId);
  }
  
  /**
   * Delete a chat session
   * 
   * @param sessionId Chat session ID
   * @returns Success response
   */
  async deleteChat(sessionId: string) {
    return operations.deleteChat(this.client, sessionId);
  }
  
  /**
   * Remove pages from a PDF
   * 
   * @param options Remove options
   * @returns Remove response
   */
  async removePages(options: Parameters<typeof operations.removePages>[1]) {
    return operations.removePages(this.client, options);
  }
  
  /**
   * Download a file from a URL
   * 
   * @param url URL to download from
   * @returns File buffer
   */
  async downloadFile(url: string) {
    return this.client.downloadFile(url);
  }
  
  /**
   * Get the full URL for a relative file URL
   * 
   * @param fileUrl Relative file URL
   * @returns Full URL
   */
  getFullUrl(fileUrl: string) {
    return this.client.getFullUrl(fileUrl);
  }
}

// Re-export types and errors
export * from './types';
export * from './types/api-responses';
export * from './types/options';
export { errors };

// Default export
export default MegaPDF;