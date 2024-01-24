import fs from 'fs';
import path from 'path';
import { Buffer } from 'node:buffer';
import zlib from 'zlib';

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

  #metadataJson: string = '';

  #compressedBlocks: Buffer[] = [];

  #blockLength = 1024;

  get metadataList() {
    return this.#metadataList;
  }

  get metadataJson() {
    return this.#metadataJson;
  }

  get compressedBlocks() {
    return this.#compressedBlocks;
  }

  constructor(dirPath: string) {
    this.#rootDirPath = dirPath;
    this.#init();
  }

  #init() {
    this.#fileList = this.#traverseDirectory(this.#rootDirPath);
    this.#metadataList = this.#createMetaData(this.#fileList);
    this.#createMetaDataJson();
    this.#createCompressedBlocks();
    const originContent = this.#sourceProject();
    console.log('--------------- metadataList -------------: ', this.#metadataList);
    console.log('--------------- originContent -------------: ', originContent);
  }

  // 还原项目
  #sourceProject() {
    let offset = 0;
    const fileContents: string[] = [];
    this.#metadataList.forEach((metadata: MetaData) => {
      const { blocks } = metadata;
      const fileBuffer = [];

      for (let i = 0; i < blocks; i++) {
        const compressedChunk = this.#compressedBlocks[offset + i];
        const chunk = this.#decompressData(compressedChunk);
        fileBuffer.push(chunk);
      }

      const fileContent = Buffer.concat(fileBuffer);
      fileContents.push(fileContent.toString());
      offset += blocks;
    });
    return fileContents;
  }

  #traverseDirectory(dirPath: string) {
    const files = fs.readdirSync(dirPath);
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
        if (file === 'package-lock.json' || file === '.DS_Store') {
          return;
        }
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
    this.#metadataJson = JSON.stringify(this.#metadataList);
  }

  #createCompressedBlocks() {
    this.#fileList.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        const fileHeader = Buffer.from(`===${filePath}===\n`);
        const content: Buffer = fs.readFileSync(filePath);
        const fileContent = Buffer.concat([fileHeader, content]);
        const chunks = Math.ceil(fileContent.length / this.#blockLength);
        for (let i = 0; i < chunks; i++) {
          const start = i * this.#blockLength;
          const end = Math.min((i + 1) * this.#blockLength, fileContent.length);
          const chunk = fileContent.subarray(start, end);
          const compressedChunk = this.#compresseData(chunk);
          this.#compressedBlocks.push(compressedChunk);
        }
      }
    });
  }

  #compresseData(chunk: Buffer) {
    const compressedChunk = zlib.deflateSync(chunk);
    return compressedChunk;
  }

  #decompressData(chunk: Buffer) {
    const decompressedChunk = zlib.inflateSync(chunk);
    return decompressedChunk;
  }
}
export default PJParser;
