import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import './style.css';
import { useTreeStore } from '../../store/tree';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function EditorTabs() {
  const treeStore = useTreeStore.getState();
  const [tabs, activeKey] = useTreeStore((state) => [
    state.tabs,
    state.activeKey,
  ]);

  const onChange = (key: string) => {
    treeStore.setActiveKey(key);

    // 向主进程请求文件内容
    window.electron.ipcRenderer.sendMessage('get-file-content', key);
  };

  const remove = (targetKey: TargetKey) => {
    treeStore.removeTab(targetKey.toString());
    const haveTab = tabs.length > 1;
    const newActiveKey = haveTab ? tabs[tabs.length - 2].key : '';
    treeStore.setActiveKey(newActiveKey);
    if (!haveTab) {
      treeStore.setFileContent('');
    }
  };

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'remove') {
      remove(targetKey);
    }
  };

  useEffect(() => {
    // 在这里可以处理点击 tab 时的逻辑，例如请求文件内容
    if (activeKey) {
      // 在这里发起请求获取文件内容
      console.log(`Request content for tab with key: ${activeKey}`);
    }
  }, [activeKey]);

  return (
    <Tabs
      hideAdd
      size="small"
      onChange={onChange}
      activeKey={activeKey}
      type="editable-card"
      onEdit={onEdit}
      items={tabs}
    />
  );
}
