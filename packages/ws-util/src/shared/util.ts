import path from 'path';

export function getMongoDockerComposePath(): string {
  return path.join(__dirname, '../assets', 'docker-compose.mongo.yaml');
}

export function getPostgresDockerComposePath(): string {
  return path.join(__dirname, '../assets', 'docker-compose.postgres.yaml');
}
