export interface PostgresStopExecutorSchema {
  readonly containerName: string;
  readonly postgresVersion: string;
  readonly port: number;
  readonly dataDir: string;
  readonly dbName: string;
  readonly username: string;
  readonly password: string;
}
