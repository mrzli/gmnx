import {
  getProjects,
  logger,
  readCachedProjectGraph,
  Tree,
} from '@nrwl/devkit';
import { exec, invariant } from './util';
import { ProjectGraph } from 'nx/src/config/project-graph';

export function publishAllProjects(tree: Tree): void {
  const projects = getLibraryProjects(tree);
  buildProjects(projects);
  publishProjects(projects);
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

function buildProjects(projectNames: readonly string[]): void {
  for (const name of projectNames) {
    exec(`nx run ${name}:build`);
  }
}

function publishProjects(projectNames: readonly string[]): void {
  const graph: ProjectGraph = readCachedProjectGraph();

  for (const name of projectNames) {
    publishProject(graph, name);
  }
}

function publishProject(graph: ProjectGraph, name: string): void {
  const project = graph.nodes[name];
  invariant(!!project, `Could not find project "${name}" in the workspace.`);

  const outputPath = project.data?.targets?.build?.options?.outputPath;
  invariant(
    outputPath,
    `Could not find "build.options.outputPath" of project "${name}".`
  );

  logger.log();
  logger.log(`Publishing folder: '${outputPath}'`);
  logger.log();
  exec(`npm publish --access public ${outputPath}`);
  logger.log();
}
