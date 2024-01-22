import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { extensionToLanguageMap } from '../../config/fileMappings';

export type MouseType = {
  x: number;
  y: number;
};
interface Props {
  fileContent: string;
  fileExtension: string;
  handleChange: (text: string | undefined, position: MouseType) => void;
}

export default function EditorMainCintent(props: Props) {
  const { fileContent, fileExtension, handleChange } = props;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    // 根据文件扩展名获取对应的语言
    const mappedLanguage = extensionToLanguageMap[fileExtension] || 'plaintext';
    // 如果编辑器实例不存在，则创建
    if (!editorRef.current) {
      const editor = monaco.editor.create(document.getElementById('editor')!, {
        language: mappedLanguage,
        theme: 'vs-dark',
        automaticLayout: true,
      });
      editorRef.current = editor;
    }

    const handleSelectionChange = debounce((mp) => {
      const selection = editorRef.current?.getSelection();
      const stcd = editorRef.current?.getModel().getValueInRange(selection!);
      // console.log('坐标: ', mp);
      // console.log('内容: ', stcd);
      handleChange(stcd, mp);
    }, 300);

    // 有内容并且抬起的时候才显示
    editorRef.current.onMouseUp((event) => {
      const mousePst = {
        x: event.event.browserEvent.clientX + 10,
        y: event.event.browserEvent.clientY,
      };
      handleSelectionChange(mousePst);
    });

    // 更新编辑器的语言和内容
    if (editorRef.current) {
      editorRef.current.setModel(
        monaco.editor.createModel(fileContent, mappedLanguage),
      );
    }

    // 在组件卸载时销毁编辑器实例
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [fileContent, fileExtension]);

  return <div id="editor" style={{ height: '100vh' }} />;
}
