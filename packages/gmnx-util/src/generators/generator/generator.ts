import {
  formatFiles,
  GeneratorsJson,
  joinPathFragments,
  Tree,
  writeJson,
} from '@nrwl/devkit';
import {
  generateFiles,
  getWorkspaceLayout,
  names,
  readJson,
  readProjectConfiguration,
  updateJson,
} from '@nrwl/devkit';
import { PackageJson } from 'nx/src/utils/package-json';
import path from 'path';
import { GeneratorSchema } from './schema';

interface NormalizedSchema extends GeneratorSchema {
  readonly fileName: string;
  readonly className: string;
  readonly projectRoot: string;
  readonly projectSourceRoot: string;
  readonly npmScope: string;
  readonly npmPackageName: string;
}

export async function generatorGenerator(
  tree: Tree,
  options: GeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updateGeneratorJson(tree, normalizedOptions);
  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: GeneratorSchema
): NormalizedSchema {
  const { npmScope } = getWorkspaceLayout(tree);
  const { fileName, className } = names(options.name);

  const { root: projectRoot, sourceRoot: projectSourceRoot } =
    readProjectConfiguration(tree, options.project);

  const projectPackageJson = readJson<PackageJson>(
    tree,
    path.join(projectRoot, 'package.json')
  );

  const description = options.description ?? `${options.name} generator`;

  return {
    ...options,
    fileName,
    className,
    description,
    projectRoot,
    projectSourceRoot: projectSourceRoot ?? '',
    npmScope,
    npmPackageName: projectPackageJson.name,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema): void {
  const indexPath = `${options.projectSourceRoot}/generators/${options.fileName}/files/src/index.ts__template__`;

  if (!tree.exists(indexPath)) {
    tree.write(indexPath, 'const variable = "<%= projectName %>";');
  }

  generateFiles(
    tree,
    path.join(__dirname, './files/generator'),
    `${options.projectSourceRoot}/generators`,
    {
      ...options,
      template: '',
    }
  );

  if (options.unitTestRunner === 'none') {
    tree.delete(
      path.join(
        options.projectSourceRoot,
        'generators',
        options.fileName,
        `generator.spec.ts`
      )
    );
  }
}

function createGeneratorsJson(tree: Tree, options: NormalizedSchema): void {
  updateJson<PackageJson>(
    tree,
    joinPathFragments(options.projectRoot, 'package.json'),
    (json) => {
      json.generators ??= 'generators.json';
      return json;
    }
  );
  writeJson<GeneratorsJson>(
    tree,
    joinPathFragments(options.projectRoot, 'generators.json'),
    {
      generators: {},
    }
  );
}

function updateGeneratorJson(tree: Tree, options: NormalizedSchema): void {
  const packageJson = readJson<PackageJson>(
    tree,
    joinPathFragments(options.projectRoot, 'package.json')
  );
  const packageJsonGenerators =
    packageJson.generators ?? packageJson.schematics;
  let generatorsPath = packageJsonGenerators
    ? joinPathFragments(options.projectRoot, packageJsonGenerators)
    : null;

  if (!generatorsPath) {
    generatorsPath = joinPathFragments(options.projectRoot, 'generators.json');
  }
  if (!tree.exists(generatorsPath)) {
    createGeneratorsJson(tree, options);
  }

  updateJson(tree, generatorsPath, (json) => {
    const generators = json.generators ?? json.schematics ?? {};
    generators[options.name] = {
      factory: `./src/generators/${options.name}/generator`,
      schema: `./src/generators/${options.name}/schema.json`,
      description: options.description,
    };
    json.generators = generators;

    return json;
  });
}

export default generatorGenerator;
