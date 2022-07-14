import { exec } from 'child_process';

export interface ExecResult {
  readonly stdout: string;
  readonly stderr: string;
}

export function execCommand(command: string): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}
