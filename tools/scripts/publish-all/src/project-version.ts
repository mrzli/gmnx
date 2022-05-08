import {
  createFindByFileNameCommand,
  exec,
  findFilesResultToArray,
} from './util';
import { ProjectVersion } from './types';
import {
  formatFiles,
  getWorkspaceLayout,
  readJson,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { PackageJson } from 'nx/src/utils/package-json';
import { getMaxProjectVersion, projectVersionToString } from './version-utils';

export async function bumpProjectVersion(tree: Tree): Promise<void> {
  const packageJsonPaths = await getPackageJsonPaths(tree);
  const nextVersion = getNextVersion(tree, packageJsonPaths);

  packageJsonPaths.forEach((p) => {
    updateJson(tree, p, createPackageJsonVersionUpdater(nextVersion));
  });

  await formatFiles(tree);
}

async function getPackageJsonPaths(tree: Tree): Promise<readonly string[]> {
  const { libsDir } = getWorkspaceLayout(tree);

  const findPackageJsonResults = await exec(
    createFindByFileNameCommand(libsDir, 'package.json')
  );

  return findFilesResultToArray(findPackageJsonResults);
}

function getNextVersion(
  tree: Tree,
  packageJsonPaths: readonly string[]
): ProjectVersion {
  const projectPackageJsons: readonly PackageJson[] = packageJsonPaths.map(
    (filePath) => readJson(tree, filePath)
  );

  const maxCurrentVersion = getMaxProjectVersion(projectPackageJsons);
  return {
    ...maxCurrentVersion,
    patch: maxCurrentVersion.patch + 1,
  };
}

function createPackageJsonVersionUpdater(
  newVersion: ProjectVersion
): (value: PackageJson) => PackageJson {
  return (data: PackageJson): PackageJson => {
    const updatedData: PackageJson = { ...data };
    updatedData.version = projectVersionToString(newVersion);
    console.log(JSON.stringify(data));
    console.log(JSON.stringify(updatedData));
    return updatedData;
  };
}
