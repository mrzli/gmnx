import { ConsoleOutputs, ExecutorReturnValue } from './types';

export function processExecutorConsoleOutputs(
  outputs: ConsoleOutputs
): ExecutorReturnValue {
  const { stdout, stderr } = outputs;

  console.log(stdout);
  if (stderr.length > 0) {
    console.error(stderr);
  }

  const success = !stderr;
  return { success };
}
