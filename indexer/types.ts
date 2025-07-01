// Data source types and interfaces for RAG indexing

export type SourceType = 'file' | 'url';

export interface IndexableDocument {
  /** Unique identifier for the document (file path, URL, etc.) */
  sourceUri: string;
  /** Type of source this document comes from */
  sourceType: SourceType;
  /** Raw content of the document */
  content: string;
  /** SHA256 hash of the content for change detection */
  contentHash: string;
  /** Optional section name from parsed llms.txt file */
  sectionName?: string;
  /** Optional metadata about the document */
  metadata?: {
    title?: string;
    lastModified?: Date;
    fileSize?: number;
    [key: string]: any;
  };
}

export interface DocumentChunk {
  /** The text content of this chunk */
  content: string;
  /** Start position in the original document */
  startIndex: number;
  /** End position in the original document */
  endIndex: number;
}

export type Embedding = number[];

export interface DataSourceOptions {
  /** Additional configuration specific to each data source */
  [key: string]: any;
}

export abstract class DataSource {
  protected sourceType: SourceType;

  constructor(sourceType: SourceType) {
    this.sourceType = sourceType;
  }

  /**
   * Discover indexable documents from this data source using a generator
   * @param options Configuration options for discovery
   * @returns AsyncGenerator that yields indexable documents one by one
   */
  abstract discoverDocuments(options: DataSourceOptions): AsyncGenerator<IndexableDocument, void, unknown>;

  /**
   * Get the source type for this data source
   */
  getSourceType(): SourceType {
    return this.sourceType;
  }

  /**
   * Validate that the data source is accessible and properly configured
   */
  abstract validate(): Promise<boolean>;
}

export interface IndexerConfig {
  /** Chunk size for text splitting */
  chunkSize: number;
  /** Overlap between chunks */
  chunkOverlap: number;
  /** Supported file extensions */
  supportedExtensions: string[];
} 