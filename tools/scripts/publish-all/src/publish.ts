import { getProjects, readCachedProjectGraph, Tree } from '@nrwl/devkit';
import { exec, invariant } from './util';
import { ProjectGraph } from 'nx/src/config/project-graph';

export async function publishAllProjects(tree: Tree): Promise<void> {
  const projects = getLibraryProjects(tree);
  await buildProjects(projects);
  await publishProjects(projects);
}

function getLibraryProjects(tree: Tree): readonly string[] {
  const projects = getProjects(tree);
  const projectNames: readonly string[] = Array.from(projects.keys());
  return projectNames.filter(
    (name) => getMapValue(projects, name).projectType === 'library'
  );
}

function getMapValue<K, V>(map: Map<K, V>, key: K): V {
  invariant(map.has(key), `Missing key in map: '${key}'`);
  return map.get(key)!;
}

async function buildProjects(projectNames: readonly string[]): Promise<void> {
  for (const name of projectNames) {
    await exec(`nx run ${name}:build`);
  }
}

async function publishProjects(projectNames: readonly string[]): Promise<void> {
  const graph: ProjectGraph = readCachedProjectGraph();

  for (const name of projectNames) {
    await publishProject(graph, name);
  }
}

async function publishProject(
  graph: ProjectGraph,
  name: string
): Promise<void> {
  const project = graph.nodes[name];
  invariant(!!project, `Could not find project "${name}" in the workspace.`);

  const outputPath = project.data?.targets?.build?.options?.outputPath;
  invariant(
    outputPath,
    `Could not find "build.options.outputPath" of project "${name}".`
  );
  console.log(outputPath);
  await exec(`npm publish --access public ${outputPath}`);
}
