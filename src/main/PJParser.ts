import fs from 'fs';
import path from 'path';
import { Buffer } from 'node:buffer';

type MetaData = {
  filePath: string;
  fileName: string;
  fileType: string;
  blocks: number;
};

class PJParser {
  #rootDirPath: string = '';

  #fileList: string[] = [];

  #metadataList: MetaData[] = [];

  #compressedBlocks: Buffer[] = [];

  #blockLength = 1024;

  get metadataList() {
    return this.#metadataList;
  }

  get compressedBlocks() {
    return this.#compressedBlocks;
  }

  constructor(dirPath: string) {
    this.#rootDirPath = dirPath;
  }

  init() {
    this.#fileList = this.#traverseDirectory(this.#rootDirPath);
    this.#metadataList = this.#createMetaData(this.#fileList);
  }

  #traverseDirectory(dirPath: string) {
    const files = fs.readFileSync(dirPath);
    const fileList: string[] = [];

    files.forEach((file: string) => {
      const filePath: string = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        if (file === 'node_modules') {
          return;
        }
        fileList.push(...this.#traverseDirectory(filePath));
      } else {
        fileList.push(filePath);
      }
    });
    return fileList;
  }

  #createMetaData(fileList: string[]) {
    return fileList.map((filePath: string) => {
      const fileName = path.basename(filePath);
      const fileType = path.extname(filePath);
      const fileContent = fs.readFileSync(filePath);
      const blocks = Math.ceil(fileContent.length / this.#blockLength);
      return {
        filePath,
        fileName,
        fileType,
        blocks,
      };
    });
  }

  #createMetaDataJson() {
    const metadataFilePath = `${this.#rootDirPath}/metadata.json`;
    const metadataJson = JSON.stringify(this.#metadataList);
    fs.writeFileSync(metadataFilePath, metadataJson);
  }

  #createCompressedBlocks() {
    this.#fileList.forEach((filePath) => {
      const fileContent: Buffer = fs.readFileSync(filePath);
      const chunks = Math.ceil(fileContent.length / this.#blockLength);
      for (let i = 0; i < chunks; i++) {
        const start = i * this.#blockLength;
        const end = Math.min((i + 1) * this.#blockLength, fileContent.length);
        const chunk = fileContent.subarray(start, end);
        const compressedChunk = this.#compresseData(chunk);
        this.#compressedBlocks.push(compressedChunk);
      }
    });
  }

  #compresseData(chunk: Buffer) {
    return chunk;
  }
}
export default PJParser;
