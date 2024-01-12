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
import { Directory } from '../../main/util';
import EditorMainContent from '../components/EditorMainContent';
import EditorTabs from '../components/EditorTabs';
import FeedBack from '../components/FeedBack';
import './style.css';
import { useTreeStore } from '../store/tree';
import { useChatStore } from '../store/chat';

interface Props {
  treeData: Directory[];
}
interface FloatButtonInfo {
  tooltip: string | null;
  icon: any;
  description?: string;
  type?: string;
}

export default function Editor(props: Props) {
  const { treeData } = props;
  const [pannelOpen, setPannelOpen] = useState(true);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [eventTitle, setEventTitle] = useState('');
  const [openDraw, setOpenDraw] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const { DirectoryTree } = Tree;
  const treeStore = useTreeStore.getState();
  const chatStore = useChatStore.getState();
  const [chatHistory] = useChatStore((state) => [state.chatHistory]);
  const [tabs, fileContent] = useTreeStore((state) => [
    state.tabs,
    state.fileContent,
  ]);

  const floatButtonInfo: FloatButtonInfo[] = [
    {
      tooltip: '解释当前代码',
      icon: <RobotOutlined />,
      description: '请解释当前代码的内容',
    },
    {
      tooltip: '评估代码质量',
      icon: <PlayCircleOutlined />,
      type: 'primary',
      description: '请评估当前代码的质量，是否有不合规或者耗性能，及冗余的写法',
    },
    {
      tooltip: '优化当前代码',
      icon: <SmileOutlined />,
      description:
        '针对当前代码的不足之处，给出优化方案，本着高效、优雅、不冗余、可读性等',
    },
    {
      tooltip: null,
      icon: <DoubleLeftOutlined />,
      // type: 'primary',
    },
  ];

  // 预先注册点击事件，以备当文件被点击，显示对应的代码内容
  useEffect(() => {
    window.electron.ipcRenderer.on('file-content', (_event, args: any) => {
      const { err, content } = args;
      if (err) {
        console.error(err);
      } else {
        console.log(content);
        treeStore.setFileContent(content);
      }
    });
  }, [treeStore]);

  // 每次点要去tabs[]检查是否已经有label(文件名)存在的文件了，有的话，不添加，把key设置为activeKey
  const triggerTab = (filePath: string, filename: string) => {
    const existFile = tabs.find((tab) => tab.label === filename);
    if (!existFile) {
      treeStore.addTab({ key: filePath, label: filename });
    }
    treeStore.setFileName(filename);
    treeStore.setActiveKey(filePath);
  };

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
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

  const contentStyle: React.CSSProperties = {
    flex: '1',
    overflowY: 'auto',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    // borderRight: '2px solid #191919',
    // padding: '10px',
  };

  const fileExtension = useMemo(() => {
    // 使用字符串方法获取文件扩展名
    const extension = selectedFilePath.substring(
      selectedFilePath.lastIndexOf('.'),
    );
    const filename = selectedFilePath.substring(
      selectedFilePath.lastIndexOf('/'),
    );
    setSelectedFileName(filename.slice(1));
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

  const handleFloatBtn = (btn: FloatButtonInfo) => {
    const { tooltip, description } = btn;
    // 如果是非展开事件
    if (tooltip) {
      chatStore.resetMessages();
      setEventTitle(tooltip);
      // 触发主进程 以文件内容为参数，请求 gpt接口，渲染反馈到 drawer 面板
      // 文件内容 - selectedFileContent 当前描述 - description
      // const requestParams = {
      //   model: chatHistory.model,
      //   messages: [
      //     {
      //       role: 'user',
      //       content: `${selectedFileName}\n${fileContent}\n${description}`,
      //     },
      //   ],
      // };
      // window.electron.ipcRenderer.sendMessage(
      //   'get-gpt-response',
      //   requestParams,
      // );
      // 走仓库
      const evtDes = `${selectedFileName}\n${fileContent}\n${description}`;
      chatStore.onUserInput(evtDes);
    }
    setOpenDraw(true);
  };

  return (
    <div style={layoutStyle}>
      <div
        style={{
          minWidth: 200,
          maxWidth: 300,
          display: pannelOpen ? 'block' : 'none',
          width: 'auto',
          maxHeight: '100vh',
          overflow: 'scroll',
          whiteSpace: 'nowrap',
          backgroundColor: '#343541',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
        }}
      >
        {treeData && (
          <DirectoryTree
            rootStyle={{
              paddingRight: 10,
              paddingLeft: 10,
              backgroundColor: 'transparent',
              paddingTop: 10,
              color: '#d1d5db',
            }}
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
            defaultExpandedKeys={[treeData[0].key]}
          />
        )}
      </div>
      {doorHandle}
      <div style={contentStyle}>
        {tabs.length > 0 && (
          <div className="headerBox">
            <EditorTabs />
            <FloatButton.Group shape="square" style={{ right: 40, top: 90 }}>
              {floatButtonInfo.map((button) => (
                <FloatButton
                  key={button.tooltip}
                  tooltip={button.tooltip ?? '展开面板'}
                  icon={button.icon}
                  type={button.type}
                  onClick={() => handleFloatBtn(button)}
                />
              ))}
            </FloatButton.Group>
          </div>
        )}
        {fileContent && (
          <div className="monaco-container">
            <EditorMainContent
              fileContent={fileContent}
              fileExtension={fileExtension}
            />
          </div>
        )}
      </div>
      <FeedBack
        title={`${selectedFileName} - ${eventTitle}`}
        openDraw={openDraw}
        setOpenDraw={setOpenDraw}
      />
    </div>
  );
}
