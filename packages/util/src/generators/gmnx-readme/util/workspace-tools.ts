import {
  ExecutorsJson,
  GeneratorsJson,
  ProjectConfiguration,
} from '@nrwl/devkit';
import { ToolSchema } from './tool-schema';

export interface WorkspaceTools {
  readonly projects: readonly ProjectData[];
}

export interface ProjectData {
  readonly name: string;
  readonly configuration: ProjectConfiguration;
  readonly generators: ProjectGenerators | undefined;
  readonly executors: ProjectExecutors | undefined;
}

export interface ProjectGenerators {
  readonly generatorsJson: GeneratorsJson;
  readonly schemas: readonly NameToolSchemaPair[];
}

export interface ProjectExecutors {
  readonly executorsJson: ExecutorsJson;
  readonly schemas: readonly NameToolSchemaPair[];
}

export interface NameToolSchemaPair {
  readonly name: string;
  readonly schema: ToolSchema;
}
