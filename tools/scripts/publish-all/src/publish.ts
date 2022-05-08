import {
  createFindByFileNameCommand,
  exec,
  findFilesResultToArray,
} from './util';
import * as fs from 'fs-extra';
import { ENCODING } from './constants';
import { ProjectConfiguration } from 'nx/src/config/workspace-json-project-json';
import {
  readNxJson,
  WorkspaceConfiguration,
} from 'nx/src/generators/utils/project-configuration';
import { getProjects, readWorkspaceConfiguration, Tree } from '@nrwl/devkit';
import { NxJsonConfiguration } from 'nx/src/config/nx-json';

export async function publishAllProjects(tree: Tree): Promise<void> {
  const projects = getProjects(tree);
  console.log(projects.keys());
  console.log();
  console.log();

  const ws: WorkspaceConfiguration = readWorkspaceConfiguration(tree);
  console.log(JSON.stringify(ws, null, 2));
  console.log();
  console.log();
  const nx: NxJsonConfiguration | null = readNxJson(tree);
  console.log(JSON.stringify(nx, null, 2));

  // const findProjectJsonResults = await exec(
  //   createFindByFileNameCommand('project.json')
  // );
  // const projectJsonFilePaths = findFilesResultToArray(findProjectJsonResults);
  //
  // console.log(JSON.stringify(projectJsonFilePaths));

  // const getAllProjectsCommand = 'nx print-affected --all --select=projects';
  // const getAllProjectsResult = await exec(getAllProjectsCommand);
  // console.log(getAllProjectsResult);
}

async function readProjectConfiguration(
  filePath: string
): Promise<ProjectConfiguration> {
  const content = await fs.readFile(filePath, ENCODING);
  return JSON.parse(content);
}
