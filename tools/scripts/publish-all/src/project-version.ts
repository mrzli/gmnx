import {
  createFindByFileNameCommand,
  exec,
  findFilesResultToArray,
} from './util';
import { PathPackageJsonPair, ProjectVersion } from './types';
import { PackageJson } from 'nx/src/utils/package-json';
import * as fs from 'fs-extra';
import { ENCODING, MINIMUM_VERSION, PROJECT_VERSION_REGEX } from './constants';

export async function bumpProjectVersion(): Promise<void> {
  const findPackageJsonResults = await exec(
    createFindByFileNameCommand('package.json')
  );
  const packageJsonFilePaths = findFilesResultToArray(findPackageJsonResults);

  const projectPackageJsons = await Promise.all(
    packageJsonFilePaths.map((filePath) => readPackageJson(filePath))
  );

  const maxCurrentVersion = getMaxVersion(projectPackageJsons);
  const nextVersion: ProjectVersion = {
    ...maxCurrentVersion,
    patch: maxCurrentVersion.patch + 1,
  };

  const updatedProjectPackageJsons = projectPackageJsons.map((packageJson) => {
    const updateData: PackageJson = { ...packageJson.data };
    updateData.version = projectVersionToString(nextVersion);
    return {
      ...packageJson,
      data: updateData,
    };
  });

  await Promise.all(updatedProjectPackageJsons.map(writePackageJson));

  const prettifyPackageJsonsCommand = [
    'prettier',
    '--write',
    packageJsonFilePaths.map((p) => `"${p}"`).join(' '),
  ].join(' ');
  await exec(prettifyPackageJsonsCommand);
}

async function readPackageJson(filePath: string): Promise<PathPackageJsonPair> {
  const content = await fs.readFile(filePath, ENCODING);

  return {
    path: filePath,
    data: JSON.parse(content),
  };
}

async function writePackageJson(
  packageJson: PathPackageJsonPair
): Promise<void> {
  const content = JSON.stringify(packageJson.data);
  await fs.writeFile(packageJson.path, content, ENCODING);
}

function getMaxVersion(
  packageJsons: readonly PathPackageJsonPair[]
): ProjectVersion {
  const projectVersions = packageJsons.map(getPackageJsonVersion);
  return projectVersions.reduce(
    (max, curr) => (isVersionGreater(curr, max) ? curr : max),
    MINIMUM_VERSION
  );
}

function getPackageJsonVersion(
  packageJson: PathPackageJsonPair
): ProjectVersion {
  const versionString = packageJson.data.version;
  const versionMatch = versionString.match(PROJECT_VERSION_REGEX);
  if (!versionMatch) {
    throw new Error(
      `Invalid version in file '${packageJson.path}': '${versionString}'`
    );
  }

  return {
    major: Number.parseInt(versionMatch[1]),
    minor: Number.parseInt(versionMatch[2]),
    patch: Number.parseInt(versionMatch[3]),
  };
}

function isVersionGreater(
  version: ProjectVersion,
  compareAgainst: ProjectVersion
): boolean {
  return compareProjectVersions(version, compareAgainst) > 0;
}

function compareProjectVersions(
  v1: ProjectVersion,
  v2: ProjectVersion
): number {
  const compareMajor = compareNumbers(v1.major, v2.major);
  if (compareMajor !== 0) {
    return compareMajor;
  }
  const compareMinor = compareNumbers(v1.minor, v2.minor);
  if (compareMinor !== 0) {
    return compareMinor;
  }
  return compareNumbers(v1.patch, v2.patch);
}

function compareNumbers(n1: number, n2: number): number {
  return Math.sign(n1 - n2);
}

function projectVersionToString(version: ProjectVersion): string {
  return `${version.major}.${version.minor}.${version.patch}`;
}
