export type WorkspaceProjectGeneratorDbType = 'mongo' | 'postgres';

export interface WorkspaceProjectGeneratorSchema {
  readonly name: string;
  readonly directory?: string;
  readonly dbName: string;
  readonly dbType: WorkspaceProjectGeneratorDbType;
}
