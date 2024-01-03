import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';

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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    // 根据文件扩展名获取对应的语言
    const mappedLanguage =
      extensionToLanguageMap[fileExtension] || fileExtension.substring(1);

    // 如果编辑器实例不存在，则创建
    if (!editorRef.current) {
      const editor = monaco.editor.create(document.getElementById('editor'), {
        language: mappedLanguage,
        theme: 'vs-dark',
        automaticLayout: true,
      });

      // 将编辑器实例保存到 ref 中
      editorRef.current = editor;
    }

    // 更新编辑器的语言和内容
    if (editorRef.current) {
      editorRef.current.setModel(monaco.editor.createModel(fileContent, mappedLanguage));
    }

    // 在组件卸载时销毁编辑器实例
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [fileContent, fileExtension]);

  return <div id="editor" style={{ height: '90vh' }} />;
}
