import child_process from 'child_process';
import path from 'path';
import { promisify } from 'util';

export function getMongoDockerComposePath(): string {
  return path.join(__dirname, '../assets', 'docker-compose.mongo.yaml');
}

export function getPostgresDockerComposePath(): string {
  return path.join(__dirname, '../assets', 'docker-compose.postgres.yaml');
}

export const exec = promisify(child_process.exec);
