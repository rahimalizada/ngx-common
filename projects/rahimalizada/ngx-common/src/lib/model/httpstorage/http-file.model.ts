export interface HttpFile {
  uri: string;
  storageId: string;
  storagePath: string;
  contentType: string;
  size: number;
  checksum: string;
  metadata: { [index: string]: string };
  timestamp: Date;
}
