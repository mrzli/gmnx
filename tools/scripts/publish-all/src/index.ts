import { bumpProjectVersion } from './project-version';
import { publishAllProjects } from './publish';

publishAll().finally();

async function publishAll(): Promise<void> {
  // await bumpProjectVersion();
  await publishAllProjects();
}
