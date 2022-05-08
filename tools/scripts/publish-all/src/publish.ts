import {
  createFindByFileNameCommand,
  exec,
  findFilesResultToArray,
} from './util';
import * as fs from 'fs-extra';
import { ENCODING } from './constants';
import { ProjectConfiguration } from 'nx/src/config/workspace-json-project-json';
import { FsTree } from 'nx/src/generators/tree';

export async function publishAllProjects(): Promise<void> {
  const tree = new FsTree('.', false);
  const ws = tree.read('./workspace.json', ENCODING);
  console.log(ws);

  const findProjectJsonResults = await exec(
    createFindByFileNameCommand('project.json')
  );
  const projectJsonFilePaths = findFilesResultToArray(findProjectJsonResults);

  console.log(JSON.stringify(projectJsonFilePaths));

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
