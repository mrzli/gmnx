import { Tree } from '@nrwl/devkit';
import { ENCODING_UTF8 } from './constants';
import { AnyValue, invariant, isNotNullish } from '@gmjs/util';
import { jsonToPretty } from '@gmjs/lib-util';
import { pathExtension } from '@gmjs/fs-util';
import * as path from 'path';

export function readText(tree: Tree, filePath: string): string {
  const content = tree.read(filePath, ENCODING_UTF8);
  invariant(isNotNullish(content), `File '${filePath}' does not exist.`);
  return content;
}

export interface PathContentPair {
  readonly path: string;
  readonly content: string;
}

export function writeText(tree: Tree, filePath: string, content: string): void {
  tree.write(filePath, content);
}

export function writeTexts(
  tree: Tree,
  pathsAndContents: readonly PathContentPair[]
): void {
  for (const pathAndContent of pathsAndContents) {
    writeText(tree, pathAndContent.path, pathAndContent.content);
  }
}

export function writeJson(tree: Tree, filePath: string, data: AnyValue): void {
  const content = jsonToPretty(data);
  tree.write(filePath, content);
}

export function deleteFilesWithExtension(
  tree: Tree,
  dirPath: string,
  extension: string
): void {
  const fsNames = tree.children(dirPath);
  for (const fsName of fsNames) {
    const filePath = path.join(dirPath, fsName);
    if (
      tree.isFile(filePath) &&
      pathExtension(filePath).toLowerCase() === extension.toLowerCase()
    ) {
      tree.delete(filePath);
    }
  }
}
