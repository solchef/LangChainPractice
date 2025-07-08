declare module 'pdf-parse' {
  interface PDFMetadata {
    fileName?: string;
    info: Record<string, any>;
    metadata: any;
    version: string;
  }

  interface PDFResult {
    numpages: number;
    numrender: number;
    info: Record<string, any>;
    metadata: any;
    text: string;
    version: string;
  }

  function pdf(buffer: Buffer | Uint8Array): Promise<PDFResult>;

  export = pdf;
}
