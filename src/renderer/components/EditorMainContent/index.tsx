import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';

loader.config({ monaco });

// 映射表，将文件扩展名映射到 Monaco Editor 支持的语言名称
const extensionToLanguageMap: Record<string, string> = {
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.ejs': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
};

interface Props {
  fileContent: string;
  fileExtension: string;
}
export default function EditorMainCintent(props: Props) {
  const { fileContent, fileExtension } = props;

  const mappedLanguage =
    extensionToLanguageMap[fileExtension] || fileExtension.substring(1);

  console.log('mappedLanguage: ', mappedLanguage);
  console.log('fileContent: ', fileContent);

  return (
    <Editor
      height="90vh"
      defaultLanguage={mappedLanguage}
      defaultValue={fileContent}
    />
  );
}
