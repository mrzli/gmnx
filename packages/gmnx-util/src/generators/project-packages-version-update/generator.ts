import path from 'path';
import { logger, Tree } from '@nrwl/devkit';
import {
  execCommand,
  getProjectRoot,
  readText,
  writeText,
} from '@gmnx/internal-util';
import { ProjectPackagesVersionUpdateGeneratorSchema } from './schema';
import { createTsSourceFileAsync } from '@gmjs/data-manipulation';
import {
  PropertyAssignment,
  SourceFile,
  SyntaxKind,
  VariableDeclaration,
} from 'ts-morph';
import { textToJson } from '@gmjs/lib-util';
import { invariant, mapGetOrThrow, trim } from '@gmjs/util';

interface NormalizedSchema extends ProjectPackagesVersionUpdateGeneratorSchema {
  readonly projectRoot: string;
}

export async function generateProjectPackagesVersionUpdate(
  tree: Tree,
  options: ProjectPackagesVersionUpdateGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const packagesFilePath = path.join(
    normalizedOptions.projectRoot,
    normalizedOptions.projectPackagesFilePath
  );
  const packagesFile = readText(tree, packagesFilePath);
  const updatedPackagesFile = await createTsSourceFileAsync(
    updatePackages,
    packagesFile
  );
  writeText(tree, packagesFilePath, updatedPackagesFile);
}

function normalizeOptions(
  tree: Tree,
  options: ProjectPackagesVersionUpdateGeneratorSchema
): NormalizedSchema {
  return {
    ...options,
    projectRoot: getProjectRoot(tree, options, false),
  };
}

interface PackageVersionPair {
  readonly name: string;
  readonly version: string;
}

async function updatePackages(sf: SourceFile): Promise<void> {
  const projectPackagesVariableDeclaration =
    sf.getVariableDeclarationOrThrow('PROJECT_PACKAGES');
  const properties = projectPackagesVariableDeclaration
    .getInitializer()
    ?.asKind(SyntaxKind.AsExpression)
    ?.getExpression()
    ?.asKind(SyntaxKind.ObjectLiteralExpression)
    ?.getProperties()
    ?.map((p) => p.asKindOrThrow(SyntaxKind.PropertyAssignment));

  invariant(!!properties, 'Unable to find project packages in code.');

  const packages = getPackagesWithVersions(properties);
  const packagesWithLatestVersions = await getLatestVersions(packages);

  updatePackagesDeclaration(
    projectPackagesVariableDeclaration,
    packages,
    packagesWithLatestVersions
  );
}

function getPackagesWithVersions(
  properties: readonly PropertyAssignment[]
): readonly PackageVersionPair[] {
  return properties.map((p) => {
    const name = trim(p.getName(), "'");
    const version = p
      .getInitializer()
      ?.asKindOrThrow(SyntaxKind.StringLiteral)
      .getLiteralValue();

    invariant(
      !!version,
      `Unable to get current package version from source code for package '${name}'.`
    );

    return {
      name,
      version,
    };
  });
}

async function getLatestVersions(
  packages: readonly PackageVersionPair[]
): Promise<readonly PackageVersionPair[]> {
  return Promise.all(
    packages.map(async (p) => ({
      name: p.name,
      version: await getLatestVersion(p.name),
    }))
  );
}

async function getLatestVersion(packageName: string): Promise<string> {
  const { stdout } = await execCommand(`npm view ${packageName} --json`);
  return textToJson(stdout).version;
}

function updatePackagesDeclaration(
  packagesDeclaration: VariableDeclaration,
  currentPackages: readonly PackageVersionPair[],
  latestVersions: readonly PackageVersionPair[]
): void {
  const packagesWithLatestVersionMap: ReadonlyMap<string, string> = new Map(
    latestVersions.map((lv) => [lv.name, lv.version])
  );

  let hasUpdates = false;

  for (const { name, version } of currentPackages) {
    const latestVersion = mapGetOrThrow(packagesWithLatestVersionMap, name);
    if (version !== latestVersion) {
      hasUpdates = true;
      logger.info(
        `Package '${name}' updated from version '${version}' to version '${latestVersion}'.`
      );
    }
  }

  if (hasUpdates) {
    packagesDeclaration.setInitializer((writer) => {
      writer
        .inlineBlock(() => {
          for (const p of latestVersions) {
            writer.writeLine(`'${p.name}': '${p.version}',`);
          }
        })
        .write('as const');
    });
  }
}

export default generateProjectPackagesVersionUpdate;
