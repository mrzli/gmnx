export interface MongoStartExecutorSchema {
  readonly containerName: string;
  readonly mongoVersion: string;
  readonly port: number;
  readonly dataDir: string;
}
