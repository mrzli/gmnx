import path from 'path';

export function pathRelativeToFiles(
  ...pathSegments: readonly string[]
): string {
  return path.join(__dirname, '../../files', pathSegments);
}
