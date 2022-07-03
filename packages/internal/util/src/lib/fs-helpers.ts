import { Tree } from '@nrwl/devkit';
import { AnyValue, invariant, isNotNullish } from '@gmjs/util';
import { jsonToPretty } from '@gmjs/lib-util';
import {
  createExtensionPredicate, ENCODING_UTF8, FileSelectionPredicate,
  PathContentPair,
} from '@gmjs/fs-util';
import * as path from 'path';

export function readText(tree: Tree, filePath: string): string {
  const content = tree.read(filePath, ENCODING_UTF8);
  invariant(isNotNullish(content), `File '${filePath}' does not exist.`);
  return content;
}

export function readTextsByExtension(
  tree: Tree,
  dirPath: string,
  extension: string
): readonly PathContentPair[] {
  return readTextsByPredicate(
    tree,
    dirPath,
    createExtensionPredicate(extension)
  );
}

export function readTextsByPredicate(
  tree: Tree,
  dirPath: string,
  predicate: FileSelectionPredicate
): readonly PathContentPair[] {
  const results: PathContentPair[] = [];

  const fsNames = tree.children(dirPath);
  for (const fsName of fsNames) {
    const filePath = path.join(dirPath, fsName);
    if (tree.isFile(filePath) && predicate(filePath)) {
      const content = readText(tree, filePath);
      results.push({ path: filePath, content });
    }
  }

  return results;
}

export function writeText(tree: Tree, filePath: string, content: string): void {
  tree.write(filePath, content);
}

export function writeTexts(
  tree: Tree,
  dirPath: string,
  files: readonly PathContentPair[]
): void {
  for (const file of files) {
    writeText(tree, path.join(dirPath, file.path), file.content);
  }
}

export function writeJson(tree: Tree, filePath: string, data: AnyValue): void {
  const content = jsonToPretty(data);
  tree.write(filePath, content);
}

export function deleteFilesByExtension(
  tree: Tree,
  dirPath: string,
  extension: string
): void {
  deleteFilesByPredicate(tree, dirPath, createExtensionPredicate(extension));
}

export function deleteFilesByPredicate(
  tree: Tree,
  dirPath: string,
  predicate: FileSelectionPredicate
): void {
  const fsNames = tree.children(dirPath);
  for (const fsName of fsNames) {
    const filePath = path.join(dirPath, fsName);
    if (tree.isFile(filePath) && predicate(filePath)) {
      tree.delete(filePath);
    }
  }
}
