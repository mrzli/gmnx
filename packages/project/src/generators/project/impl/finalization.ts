import { execCommand } from '@gmnx/internal-util';

export async function finalization(): Promise<void> {
  await execCommand('npm install -f');
}
