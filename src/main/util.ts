/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { readdir } from 'fs/promises';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export type Directory = {
  key: string;
  title: string;
  type: string;
  children?: Directory[];
};

export async function readDirectoryAsync(
  dirPath: string,
): Promise<Directory[]> {
  try {
    const items = await readdir(dirPath, { withFileTypes: true });

    const results: Directory[] = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(dirPath, item.name);
        const isDirectory = item.isDirectory();

        return isDirectory
          ? {
              key: itemPath,
              title: item.name,
              children: await readDirectoryAsync(itemPath),
            }
          : { key: itemPath, title: item.name, isLeaf: true };
      }),
    );

    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
}
