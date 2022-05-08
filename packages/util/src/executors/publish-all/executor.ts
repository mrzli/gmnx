import { PublishAllExecutorSchema } from './schema';
import { ExecutorReturnValue } from '@gmnx/internal-util';
import { createWorkspaceTree } from './src/util';
import { bumpProjectVersion } from './src/project-version';
import { publishAllProjects } from './src/publish';

export default async function runExecutor(
  _options: PublishAllExecutorSchema
): Promise<ExecutorReturnValue> {
  const tree = createWorkspaceTree();
  await bumpProjectVersion(tree);
  publishAllProjects(tree);

  return {
    success: true,
  };
}
