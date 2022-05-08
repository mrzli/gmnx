import { bumpProjectVersion } from './project-version';
import { publishAllProjects } from './publish';
import { createWorkspaceTree } from './util';

publishAll().finally();

async function publishAll(): Promise<void> {
  const tree = createWorkspaceTree();
  await bumpProjectVersion(tree);
  await publishAllProjects(tree);
}
