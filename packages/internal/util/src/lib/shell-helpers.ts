import child_process from 'child_process';
import { promisify } from 'util';

export const execCommand = promisify(child_process.exec);
