import { getWorkspaceLayout, names, readJson, Tree } from '@nrwl/devkit';
import { AnyValue } from '@gmjs/util';

export interface NameDirectoryGeneratorSchema {
  readonly name: string;
  readonly directory?: string;
}

export interface ProjectValues {
  readonly directory: string;
  readonly name: string;
  readonly root: string;
}

export function getProjectValues(
  tree: Tree,
  options: NameDirectoryGeneratorSchema,
  isApp: boolean,
  projectSuffix?: string
): ProjectValues {
  const packagesDir = getPackagesDir(tree, isApp);
  const projectDirectory = getProjectDirectory(options, projectSuffix);

  return {
    directory: projectDirectory,
    name: projectDirectoryToProjectName(projectDirectory),
    root: packagesDirAndProjectDirectoryToProjectRoot(
      packagesDir,
      projectDirectory
    ),
  };
}

export function getProjectRoot(
  tree: Tree,
  options: NameDirectoryGeneratorSchema,
  isApp: boolean,
  projectSuffix?: string
): string {
  const packagesDir = getPackagesDir(tree, isApp);
  const projectDirectory = getProjectDirectory(options, projectSuffix);
  return packagesDirAndProjectDirectoryToProjectRoot(
    packagesDir,
    projectDirectory
  );
}

export function getProjectName(
  tree: Tree,
  options: NameDirectoryGeneratorSchema,
  projectSuffix?: string
): string {
  const projectDirectory = getProjectDirectory(options, projectSuffix);
  return projectDirectoryToProjectName(projectDirectory);
}

export function getProjectDirectory(
  options: NameDirectoryGeneratorSchema,
  projectSuffix?: string
): string {
  projectSuffix ??= '';
  const nameWithoutDir = getProjectNameWithoutDir(options.name + projectSuffix);
  return options.directory
    ? `${names(options.directory).fileName}/${nameWithoutDir}`
    : nameWithoutDir;
}

export function getProjectNameWithoutDir(inputName: string): string {
  return names(inputName).fileName;
}

function getPackagesDir(tree: Tree, isApp: boolean): string {
  const workspaceLayout = getWorkspaceLayout(tree);
  return isApp ? workspaceLayout.appsDir : workspaceLayout.libsDir;
}

function projectDirectoryToProjectName(projectDirectory: string): string {
  return projectDirectory.replace(new RegExp('/', 'g'), '-');
}

function packagesDirAndProjectDirectoryToProjectRoot(
  packagesDir: string,
  projectDirectory: string
): string {
  return `${packagesDir}/${projectDirectory}`;
}

export function tagsToParsedTags(tags: string | undefined): string[] {
  return tags ? tags.split(',').map((s) => s.trim()) : [];
}

export function getNpmScope(tree: Tree): string {
  return getWorkspaceLayout(tree).npmScope;
}

export function getJsonIfExists<T extends object = AnyValue>(
  tree: Tree,
  filePath: string
): T | undefined {
  if (!tree.exists(filePath)) {
    return undefined;
  }
  return readJson<T>(tree, filePath);
}
