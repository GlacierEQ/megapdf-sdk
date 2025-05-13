# MegaPDF SDK

Official Node.js and browser SDK for the MegaPDF API, providing easy access to PDF manipulation operations.

## Installation

```bash
npm install megapdf-sdk
# or
yarn add megapdf-sdk
```

## Usage

```typescript
import MegaPDF from "megapdf-sdk";

// Initialize the SDK with your API key
const megapdf = new MegaPDF({
  apiKey: "your-api-key",
});

// Example: Convert a PDF to DOCX
const convertPdfToDocx = async () => {
  try {
    const response = await megapdf.convert({
      file: "./document.pdf", // Can be a file path (Node.js), File object (browser), Buffer, or URL
      outputFormat: "docx",
    });

    console.log(`File converted successfully: ${response.fileUrl}`);

    // Download the converted file
    const fileBuffer = await megapdf.downloadFile(response.fileUrl);

    // In Node.js, you can save the file to disk
    // In browsers, you can create a download link
  } catch (error) {
    console.error("Conversion failed:", error);
  }
};

convertPdfToDocx();
```

## Features

The MegaPDF SDK provides the following PDF operations:

- **Convert**: Convert PDFs to/from various formats including DOCX, XLSX, PPTX, images, and more
- **Compress**: Reduce PDF file sizes while maintaining quality
- **Merge**: Combine multiple PDFs into a single document
- **Split**: Divide PDFs into separate documents by page ranges
- **Protect**: Add password protection to PDF files
- **Unlock**: Remove password protection from PDF files
- **Watermark**: Add text or image watermarks to PDF files
- **OCR**: Perform optical character recognition to make PDFs searchable
- **Sign**: Add signatures, stamps, and other elements to PDFs
- **Rotate**: Rotate pages in PDF documents
- **Page Numbers**: Add customizable page numbers to PDF documents
- **Repair**: Fix corrupted or damaged PDF files
- **Chat**: Interact with a PDF using natural language
- **Remove Pages**: Delete specific pages from a PDF

## Documentation

### Initialization

```typescript
import MegaPDF from "megapdf-sdk";

const megapdf = new MegaPDF({
  apiKey: "your-api-key",
  // Optional configuration
  baseUrl: "https://api.mega-pdf.com",
  timeout: 60000, // 60 seconds
  retryOnFailure: true,
  maxRetries: 3,
});
```

### Convert PDF to Other Formats

```typescript
// Convert PDF to DOCX
const response = await megapdf.convert({
  file: "./document.pdf",
  outputFormat: "docx",
  // Optional parameters
  ocr: true, // Perform OCR for better text extraction
  quality: 90, // For image output formats (1-100)
  password: "password", // For protected PDFs
  onProgress: (progress) => console.log(`Progress: ${progress}%`),
});

// Convert DOCX to PDF
const response = await megapdf.convert({
  file: "./document.docx",
  outputFormat: "pdf",
});
```

### Compress PDF

```typescript
const response = await megapdf.compress({
  file: "./large-document.pdf",
  quality: "medium", // 'low', 'medium', or 'high'
  onProgress: (progress) => console.log(`Progress: ${progress}%`),
});

console.log(`Original size: ${response.originalSize} bytes`);
console.log(`Compressed size: ${response.compressedSize} bytes`);
console.log(`Compression ratio: ${response.compressionRatio}`);
```

### Merge PDFs

```typescript
const response = await megapdf.merge({
  files: ["./document1.pdf", "./document2.pdf", "./document3.pdf"],
  // Optional: specify the order of files
  order: [2, 0, 1], // Will merge document3, document1, document2
  onProgress: (progress) => console.log(`Progress: ${progress}%`),
});
```

### Split PDF

```typescript
// Split by page ranges
const response = await megapdf.split({
  file: "./document.pdf",
  splitMethod: "range",
  pageRanges: "1-3,5,7-9",
  onProgress: (progress) => console.log(`Progress: ${progress}%`),
});

// Split by extracting each page
const response = await megapdf.split({
  file: "./document.pdf",
  splitMethod: "extract",
});

// Split every N pages
const response = await megapdf.split({
  file: "./document.pdf",
  splitMethod: "every",
  everyNPages: 2,
});

// For large PDFs, check job status
if (response.isLargeJob && response.jobId) {
  // Poll for status
  const status = await megapdf.getSplitStatus(response.jobId);
  console.log(`Split status: ${status.status}, Progress: ${status.progress}%`);
}
```

### Protect PDF

```typescript
const response = await megapdf.protect({
  file: "./document.pdf",
  password: "your-password",
  // Optional parameters
  permission: "restricted", // 'all' or 'restricted'
  protectionLevel: "256", // '128' or '256'
  allowPrinting: true,
  allowCopying: false,
  allowEditing: false,
});
```

### Unlock PDF

```typescript
// First, check if the PDF is password protected
const checkResponse = await megapdf.checkPassword({
  file: "./protected-document.pdf",
});

if (checkResponse.isPasswordProtected) {
  const response = await megapdf.unlock({
    file: "./protected-document.pdf",
    password: "your-password",
  });
}
```

### Watermark PDF

```typescript
// Add a text watermark
const response = await megapdf.watermark({
  file: "./document.pdf",
  watermarkType: "text",
  text: "CONFIDENTIAL",
  textColor: "#FF0000",
  fontSize: 48,
  fontFamily: "Arial",
  position: "center",
  opacity: 30,
  rotation: 45,
  pages: "all", // 'all', 'even', 'odd', or 'custom'
});

// Add an image watermark
const response = await megapdf.watermark({
  file: "./document.pdf",
  watermarkType: "image",
  watermarkImage: "./logo.png",
  position: "bottom-right",
  scale: 50,
  opacity: 50,
});
```

### OCR PDF

```typescript
// Make a PDF searchable with OCR
const response = await megapdf.ocr({
  file: "./scanned-document.pdf",
  language: "eng", // Language code
  enhanceScanned: true,
  preserveLayout: true,
});

// Extract text from a PDF using OCR
const response = await megapdf.extractText({
  file: "./scanned-document.pdf",
  language: "eng",
  pageRange: "all", // 'all' or 'specific'
  pages: "1-3,5,7", // When pageRange is 'specific'
});

console.log("Extracted text:", response.text);
```

### Sign PDF

```typescript
const response = await megapdf.sign({
  file: "./document.pdf",
  elements: [
    {
      id: "1",
      type: "signature",
      position: { x: 100, y: 200 },
      size: { width: 200, height: 50 },
      data: "data:image/png;base64,...", // Signature image as data URL
      rotation: 0,
      scale: 1,
      page: 0, // First page
    },
    {
      id: "2",
      type: "text",
      position: { x: 100, y: 300 },
      size: { width: 200, height: 30 },
      data: "John Doe",
      fontFamily: "Arial",
      fontSize: 12,
      color: "#000000",
      rotation: 0,
      scale: 1,
      page: 0,
    },
    {
      id: "3",
      type: "date",
      position: { x: 100, y: 350 },
      size: { width: 200, height: 30 },
      data: "", // Will be replaced with current date
      fontFamily: "Arial",
      fontSize: 12,
      color: "#000000",
      rotation: 0,
      scale: 1,
      page: 0,
    },
  ],
  pages: [
    {
      width: 612,
      height: 792,
      originalWidth: 612,
      originalHeight: 792,
    },
  ],
  performOcr: true, // Make the signed PDF searchable
});
```

### Rotate PDF Pages

```typescript
const response = await megapdf.rotate({
  file: "./document.pdf",
  rotations: [
    {
      pageNumber: 1,
      angle: 90, // 90, 180, 270, or -90
      original: 0,
    },
    {
      pageNumber: 2,
      angle: 180,
      original: 0,
    },
  ],
});
```

### Add Page Numbers

```typescript
const response = await megapdf.addPageNumbers({
  file: "./document.pdf",
  format: "numeric", // 'numeric', 'roman', or 'alphabetic'
  position: "bottom-center", // Position on the page
  fontFamily: "Helvetica",
  fontSize: 12,
  color: "#000000",
  startNumber: 1,
  prefix: "Page ",
  suffix: " of 10",
  marginX: 40,
  marginY: 30,
  selectedPages: "1-5,7,9", // Pages to add numbers to
  skipFirstPage: true, // Skip the first page
});
```

### Repair PDF

```typescript
const response = await megapdf.repair({
  file: "./corrupted-document.pdf",
  repairMode: "standard", // 'standard', 'advanced', or 'optimization'
  password: "your-password", // If the PDF is encrypted
  preserveFormFields: true,
  preserveAnnotations: true,
  preserveBookmarks: true,
  optimizeImages: true,
});
```

### Chat with PDF

```typescript
// Initialize a chat session with a PDF
const chatResponse = await megapdf.chat({
  file: "./document.pdf",
});

// Get the session ID from the response
const sessionId = chatResponse.sessionId;

// Send a message to the chat
const messageResponse = await megapdf.sendChatMessage({
  sessionId,
  message: "What is this document about?",
});

console.log("AI response:", messageResponse.message);

// Get chat history
const historyResponse = await megapdf.getChatHistory(sessionId);

// Delete chat session when done
await megapdf.deleteChat(sessionId);
```

### Remove Pages

```typescript
const response = await megapdf.removePages({
  file: "./document.pdf",
  pagesToRemove: [1, 3, 5], // Page numbers to remove (1-based)
});
```

### Downloading Files

After performing operations, you can download the processed files:

```typescript
// Download the file
const fileBuffer = await megapdf.downloadFile(response.fileUrl);

// In Node.js, save to disk
const fs = require("fs");
fs.writeFileSync("output.pdf", fileBuffer);

// In browsers, create a download link
const blob = new Blob([fileBuffer], { type: "application/pdf" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "output.pdf";
a.click();
```

## Error Handling

The SDK throws specific error types for different failure scenarios:

```typescript
import MegaPDF, { errors } from "megapdf-sdk";

try {
  const response = await megapdf.convert({
    file: "./document.pdf",
    outputFormat: "docx",
  });
} catch (error) {
  if (error instanceof errors.AuthenticationError) {
    console.error("Invalid API key:", error.message);
  } else if (error instanceof errors.RateLimitError) {
    console.error("Rate limit exceeded:", error.message);
    console.log("Retry after:", error.resetTime);
  } else if (error instanceof errors.ValidationError) {
    console.error("Invalid input:", error.message);
    if (error.field) {
      console.error("Field:", error.field);
    }
  } else if (error instanceof errors.ConversionError) {
    console.error("Conversion failed:", error.message);
  } else if (error instanceof errors.FileOperationError) {
    console.error(`${error.operation} operation failed:`, error.message);
  } else if (error instanceof errors.NetworkError) {
    console.error("Network error:", error.message);
  } else if (error instanceof errors.ServerError) {
    console.error(
      "Server error:",
      error.message,
      "Status code:",
      error.statusCode
    );
  } else if (error instanceof errors.TimeoutError) {
    console.error("Operation timed out:", error.message);
  } else if (error instanceof errors.PasswordError) {
    console.error("Password error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## License

This SDK is released under the MIT License.
