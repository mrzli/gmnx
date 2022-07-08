import { execCommand } from '@gmnx/internal-util';

export async function finalization(dryRun: boolean): Promise<void> {
  if (!dryRun) {
    await execCommand('npm install -f');
  }
}
