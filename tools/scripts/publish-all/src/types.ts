import { PackageJson } from 'nx/src/utils/package-json';

export interface PathPackageJsonPair {
  readonly path: string;
  readonly data: PackageJson;
}

export interface ProjectVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}
