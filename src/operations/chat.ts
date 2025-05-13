import { MegaPdfClient } from '../client';
import { FileOperationError, MegaPdfError } from '../errors';
import { ChatMessageResponse, ChatResponse } from '../types/api-responses';
import { ChatMessageOptions, ChatOptions } from '../types/options';
import { validateFileInput } from '../validation';

/**
 * Initialize a chat session with a PDF
 * 
 * @param client MegaPDF client instance
 * @param options Chat options
 * @returns Chat response with session ID
 */
export async function chat(
  client: MegaPdfClient,
  options: ChatOptions
): Promise<ChatResponse> {
  try {
    // Validate inputs
    validateFileInput(options.file);
    
    // Upload file and initialize chat session
    const response = await client.uploadFile<ChatResponse>(
      '/api/pdf/chat',
      options.file,
      {},
      options.onProgress
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Chat initialization failed', 'chat');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'chat');
    } else {
      throw new FileOperationError('Unknown error occurred during chat initialization', 'chat');
    }
  }
}

/**
 * Send a message to an existing chat session
 * 
 * @param client MegaPDF client instance
 * @param options Chat message options
 * @returns Chat message response
 */
export async function sendChatMessage(
  client: MegaPdfClient,
  options: ChatMessageOptions
): Promise<ChatMessageResponse> {
  try {
    // Validate inputs
    if (!options.sessionId) {
      throw new FileOperationError('Session ID is required', 'sendChatMessage');
    }
    
    if (!options.message) {
      throw new FileOperationError('Message is required', 'sendChatMessage');
    }
    
    // Send message to chat session
    const response = await client.post<ChatMessageResponse>(
      '/api/pdf/chat',
      {
        sessionId: options.sessionId,
        message: options.message,
      }
    );
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Failed to send chat message', 'sendChatMessage');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'sendChatMessage');
    } else {
      throw new FileOperationError('Unknown error occurred while sending chat message', 'sendChatMessage');
    }
  }
}

/**
 * Get the chat history for a session
 * 
 * @param client MegaPDF client instance
 * @param sessionId Chat session ID
 * @returns Chat session history
 */
export async function getChatHistory(
  client: MegaPdfClient,
  sessionId: string
): Promise<any> {
  try {
    // Validate inputs
    if (!sessionId) {
      throw new FileOperationError('Session ID is required', 'getChatHistory');
    }
    
    // Get chat history
    const response = await client.get(`/api/pdf/chat?sessionId=${sessionId}`);
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Failed to get chat history', 'getChatHistory');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'getChatHistory');
    } else {
      throw new FileOperationError('Unknown error occurred while getting chat history', 'getChatHistory');
    }
  }
}

/**
 * Delete a chat session
 * 
 * @param client MegaPDF client instance
 * @param sessionId Chat session ID
 * @returns Success response
 */
export async function deleteChat(
  client: MegaPdfClient,
  sessionId: string
): Promise<any> {
  try {
    // Validate inputs
    if (!sessionId) {
      throw new FileOperationError('Session ID is required', 'deleteChat');
    }
    
    // Delete chat session
    const response = await client.get(`/api/pdf/chat?sessionId=${sessionId}`, {
      method: 'DELETE'
    });
    
    if (!response.success) {
      throw new FileOperationError(response.error || 'Failed to delete chat session', 'deleteChat');
    }
    
    return response;
  } catch (error) {
    if (error instanceof MegaPdfError) {
      throw error;
    } else if (error instanceof Error) {
      throw new FileOperationError(error.message, 'deleteChat');
    } else {
      throw new FileOperationError('Unknown error occurred while deleting chat session', 'deleteChat');
    }
  }
}