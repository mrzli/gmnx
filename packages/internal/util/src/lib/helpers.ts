import { logger } from '@nrwl/devkit';
import { ConsoleOutputs } from './types';

export function processExecutorConsoleOutputs(outputs: ConsoleOutputs): void {
  const { stdout, stderr } = outputs;

  logger.log(stdout);
  if (stderr.length > 0) {
    logger.error(stderr);
  }
}
