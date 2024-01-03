import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { Directory } from '../../main/util';
import ResizableSider from '../components/ResizableSider';
import EditorMainCintent from '../components/EditorMainCintent';

interface Props {
  treeData: Directory[];
}

export default function Editor(props: Props) {
  const { treeData } = props;
  const [width, setWidth] = useState(200);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const { DirectoryTree } = Tree;

  // 预先注册点击事件，以备当文件被点击，显示对应的代码内容
  useEffect(() => {
    window.electron.ipcRenderer.on('file-content', (_event, args: any) => {
      const { err, content } = args;
      if (err) {
        console.error(err);
      } else {
        console.log(content);
        setSelectedFileContent(content);
      }
    });
  }, []);

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info);
    const filePath = keys[0] as string;
    setSelectedFilePath(filePath);
    const { isLeaf } = info.node; // 是文件才去要内容
    if (isLeaf && filePath) {
      // 向主进程请求文件内容
      window.electron.ipcRenderer.sendMessage('get-file-content', filePath);
    }
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
  };

  const siderStyle: React.CSSProperties = {
    width: `${width}px`,
    padding: 10,
  };

  const contentStyle: React.CSSProperties = {
    flex: '1',
    // padding: '16px',
  };

  return (
    <div style={layoutStyle}>
      <div style={siderStyle}>
        {treeData && (
          <DirectoryTree
            multiple
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
          />
        )}
      </div>
      <div style={contentStyle}>
        <ResizableSider width={width} setWidth={setWidth}>
          <div>tabs区域</div>
          <EditorMainCintent fileContent={selectedFileContent} />
        </ResizableSider>
      </div>
    </div>
  );
}
