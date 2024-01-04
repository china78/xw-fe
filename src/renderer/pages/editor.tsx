import React, { useEffect, useMemo, useState } from 'react';
import {
  PlayCircleOutlined,
  RobotOutlined,
  SmileOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import { Tree, FloatButton } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { useDispatch, useSelector } from 'react-redux';
import { Directory } from '../../main/util';
// import ResizableSider from '../components/ResizableSider';
import EditorMainContent from '../components/EditorMainContent';
import EditorTabs from '../components/EditorTabs';
import {
  addTab,
  selectFileContent,
  selectTabs,
  setActiveKey,
  setFileContent,
  setFileName,
} from '../store/EditorTabs/EditorTabSlice';

interface Props {
  treeData: Directory[];
}

export default function Editor(props: Props) {
  const { treeData } = props;
  // const [width, setWidth] = useState(200);
  const [pannelOpen, setPannelOpen] = useState(true);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const dispatch = useDispatch();
  const { DirectoryTree } = Tree;
  const tabs = useSelector(selectTabs);
  const selectedFileContent = useSelector(selectFileContent);

  // 预先注册点击事件，以备当文件被点击，显示对应的代码内容
  useEffect(() => {
    window.electron.ipcRenderer.on('file-content', (_event, args: any) => {
      const { err, content } = args;
      if (err) {
        console.error(err);
      } else {
        console.log(content);
        // setSelectedFileContent(content);
        dispatch(setFileContent(content));
      }
    });
  }, [dispatch]);

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

  // const siderStyle: React.CSSProperties = {
  //   width: `${width}px`,
  //   padding: 10,
  //   // flex: '0 0 auto',
  // };

  const contentStyle: React.CSSProperties = {
    flex: '1',
    overflowY: 'auto',
    // padding: '10px',
  };

  const fileExtension = useMemo(() => {
    // 使用字符串方法获取文件扩展名
    const extension = selectedFilePath.substring(
      selectedFilePath.lastIndexOf('.'),
    );
    // 去掉文件扩展名前面的点 (.)
    return extension ?? '';
  }, [selectedFilePath]);

  const doorHandle = useMemo(() => {
    return (
      <FloatButton
        icon={pannelOpen ? <DoubleLeftOutlined /> : <DoubleRightOutlined />}
        style={{ width: 30, height: 30, left: pannelOpen ? 210 : 20, top: 310 }}
        onClick={() => setPannelOpen(!pannelOpen)}
      />
    );
  }, [pannelOpen]);

  return (
    <div style={layoutStyle}>
      <div
        style={{
          // width: `${width}px`,
          padding: 10,
          display: pannelOpen ? 'block' : 'none',
        }}
      >
        {treeData && (
          <DirectoryTree
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
          />
        )}
      </div>
      {doorHandle}
      <div style={contentStyle}>
        {/* <ResizableSider width={width} setWidth={setWidth}> */}
        {tabs.length > 0 && (
          <div className="headerBox">
            <EditorTabs />
            <FloatButton.Group shape="square" style={{ right: 40, top: 90 }}>
              <FloatButton tooltip="解释当前代码" icon={<RobotOutlined />} />
              <FloatButton
                icon={<PlayCircleOutlined />}
                type="primary"
                tooltip="评估代码质量"
              />
              <FloatButton icon={<SmileOutlined />} tooltip="优化当前代码" />
            </FloatButton.Group>
          </div>
        )}
        {selectedFileContent && (
          <div className="monaco-container">
            <EditorMainContent
              fileContent={selectedFileContent}
              fileExtension={fileExtension}
            />
          </div>
        )}
        {/* </ResizableSider> */}
      </div>
    </div>
  );
}
