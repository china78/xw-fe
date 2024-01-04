import React, { useEffect, useMemo, useState } from 'react';
import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { useDispatch, useSelector } from 'react-redux';
import { Directory } from '../../main/util';
import ResizableSider from '../components/ResizableSider';
import EditorMainContent from '../components/EditorMainContent';
import EditorTabs from '../components/EditorTabs';
import {
  addTab,
  selectTabs,
  setActiveKey,
  setFileName,
} from '../store/EditorTabs/EditorTabSlice';

interface Props {
  treeData: Directory[];
}

export default function Editor(props: Props) {
  const { treeData } = props;
  const [width, setWidth] = useState(200);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const dispatch = useDispatch();
  const { DirectoryTree } = Tree;
  const tabs = useSelector(selectTabs);

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

  // 每次点要去tabs[]检查是否已经有label(文件名)存在的文件了，有的话，不添加，把key设置为activeKey
  const triggerTab = (filePath: string, filename: string) => {
    const existFile = tabs.find((tab) => tab.label === filename);
    if (!existFile) {
      dispatch(addTab({ key: filePath, label: filename }));
    }
    dispatch(setFileName(filename));
    dispatch(setActiveKey(filePath));
  };

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    // console.log('Trigger Select', keys, info);
    const filePath = keys[0] as string;
    const { isLeaf, title: filename } = info.node as any; // 是文件才去要内容
    setSelectedFilePath(filePath);
    if (isLeaf && filePath) {
      // 创建新tab标签
      triggerTab(filePath, filename);
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

  const fileExtension = useMemo(() => {
    // 使用字符串方法获取文件扩展名
    const extension = selectedFilePath.substring(
      selectedFilePath.lastIndexOf('.'),
    );
    // 去掉文件扩展名前面的点 (.)
    return extension ?? '';
  }, [selectedFilePath]);

  return (
    <div style={layoutStyle}>
      <div style={siderStyle}>
        {treeData && (
          <DirectoryTree
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
          />
        )}
      </div>
      <div style={contentStyle}>
        <ResizableSider width={width} setWidth={setWidth}>
          <EditorTabs />
          {selectedFileContent && (
            <EditorMainContent
              fileContent={selectedFileContent}
              fileExtension={fileExtension}
            />
          )}
        </ResizableSider>
      </div>
    </div>
  );
}
