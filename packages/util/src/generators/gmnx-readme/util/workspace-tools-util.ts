import {
  ExecutorsJson,
  GeneratorsJson,
  getProjects,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import {
  NameToolSchemaPair,
  ProjectData,
  ProjectExecutors,
  ProjectGenerators,
  WorkspaceTools,
} from './workspace-tools';
import { getJsonIfExists } from '@gmnx/internal-util';
import {
  asChainable,
  compareFnStringAsc,
  invariant,
  sortArray,
  transformIfExists,
} from '@gmjs/util';
import { PackageJson } from 'nx/src/utils/package-json';
import path from 'path';
import {
  ExecutorsJsonEntry,
  GeneratorsJsonEntry,
} from 'nx/src/config/misc-interfaces';
import { pathDir } from '@gmjs/fs-util';
import { ToolSchema } from './tool-schema';

export function getWorkspaceTools(tree: Tree): WorkspaceTools {
  const projectMap: Map<string, ProjectConfiguration> = getProjects(tree);
  const projects: readonly ProjectData[] = asChainable(
    Array.from(projectMap.entries())
  )
    .filter((p) => p[1].projectType !== 'application')
    .apply((items) =>
      sortArray(items, (item1, item2) => compareFnStringAsc(item1[0], item2[0]))
    )
    .map((p) => toProjectData(tree, p[0], p[1]))
    .filter((p) => p.generators !== undefined || p.executors !== undefined)
    .getValue();

  return { projects };
}

function toProjectData(
  tree: Tree,
  name: string,
  config: ProjectConfiguration
): ProjectData {
  const tools = getTools(tree, config.root);

  return {
    name,
    configuration: config,
    ...tools,
  };
}

function getTools(
  tree: Tree,
  projectRoot: string
): Pick<ProjectData, 'generators' | 'executors'> {
  const packageJson = getJsonIfExists<PackageJson>(
    tree,
    path.join(projectRoot, 'package.json')
  );

  if (!packageJson) {
    return {
      generators: undefined,
      executors: undefined,
    };
  }

  const generators = getProjectGenerators(
    tree,
    projectRoot,
    packageJson.generators
  );
  const executors = getProjectExecutors(
    tree,
    projectRoot,
    packageJson.executors
  );

  return {
    generators,
    executors,
  };
}

function getProjectGenerators(
  tree: Tree,
  projectRoot: string,
  configRelativePath: string | undefined
): ProjectGenerators | undefined {
  const configPath = getPathIfProvided(projectRoot, configRelativePath);
  if (!configPath) {
    return undefined;
  }

  const config = getJsonIfExists<GeneratorsJson>(tree, configPath);
  if (!config) {
    return undefined;
  }

  const generators: Record<string, GeneratorsJsonEntry> | undefined =
    config?.generators;
  if (!generators) {
    return undefined;
  }

  const configDir = pathDir(configPath);

  const schemas: readonly NameToolSchemaPair[] = Object.entries(generators).map(
    ([name, entry]) => {
      const schemaPath = path.join(configDir, entry.schema);
      const schema = getJsonIfExists<ToolSchema>(tree, schemaPath);
      invariant(
        !!schema,
        `Schema for generator '${name}' does not exist at path '${schemaPath}'.`
      );
      return { name, schema };
    }
  );

  return {
    generatorsJson: config,
    schemas,
  };
}

function getProjectExecutors(
  tree: Tree,
  projectRoot: string,
  configRelativePath: string | undefined
): ProjectExecutors | undefined {
  const configPath = getPathIfProvided(projectRoot, configRelativePath);
  if (!configPath) {
    return undefined;
  }

  const config = getJsonIfExists<ExecutorsJson>(tree, configPath);
  if (!config) {
    return undefined;
  }

  const executors: Record<string, ExecutorsJsonEntry> | undefined =
    config?.executors;
  if (!executors) {
    return undefined;
  }

  const configDir = pathDir(configPath);

  const schemas: readonly NameToolSchemaPair[] = Object.entries(executors).map(
    ([name, entry]) => {
      const schemaPath = path.join(configDir, entry.schema);
      const schema = getJsonIfExists<ToolSchema>(tree, schemaPath);
      invariant(
        !!schema,
        `Schema for executor '${name}' does not exist at path '${schemaPath}'.`
      );
      return { name, schema };
    }
  );

  return {
    executorsJson: config,
    schemas,
  };
}

function getPathIfProvided(
  projectRoot: string,
  relativePath: string | undefined
): string | undefined {
  return transformIfExists(
    relativePath,
    (rp) => path.join(projectRoot, rp),
    undefined
  );
}
