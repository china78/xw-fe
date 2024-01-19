import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { extensionToLanguageMap } from '../../config/fileMappings';

interface Props {
  fileContent: string;
  fileExtension: string;
  handleChange: (text: string | undefined, position: monaco.Position) => void;
}

export default function EditorMainCintent(props: Props) {
  const { fileContent, fileExtension, handleChange } = props;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [keyup, setKeyup] = useState(false);

  useEffect(() => {
    // 根据文件扩展名获取对应的语言
    const mappedLanguage = extensionToLanguageMap[fileExtension] || 'plaintext';
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

    editorRef.current.onMouseUp((e) => {
      setKeyup(true);
    });

    const handleSelectionChange = debounce((pt) => {
      // 每次抬起都检查一下
      if (keyup) {
        const selection = editorRef.current?.getSelection();
        const selectedCode = editorRef.current?.getModel().getValueInRange(selection!) as string | undefined;
        // 在这里对选中的代码内容进行处理
        handleChange(selectedCode, pt);
      }
    }, 300);

    // 有内容并且抬起的时候才显示
    editorRef.current.onDidChangeCursorPosition((event) => {
      handleSelectionChange(event?.position);
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
  }, [fileContent, fileExtension, keyup]);

  return <div id="editor" style={{ height: '100vh' }} />;
}
