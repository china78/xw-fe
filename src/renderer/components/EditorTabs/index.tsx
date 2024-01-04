import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeTab,
  setActiveKey,
  selectTabs,
  selectActiveKey,
} from '../../store/EditorTabs/EditorTabSlice';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function EditorTabs() {
  const dispatch = useDispatch();
  const tabs = useSelector(selectTabs);
  const activeKey = useSelector(selectActiveKey);

  const onChange = (key: string) => {
    dispatch(setActiveKey(key));
    // 向主进程请求文件内容
    window.electron.ipcRenderer.sendMessage('get-file-content', key);
  };

  const remove = (targetKey: TargetKey) => {
    dispatch(removeTab({ key: targetKey.toString() }));
    const newActiveKey = tabs.length > 1 ? tabs[tabs.length - 2].key : '';
    dispatch(setActiveKey(newActiveKey));
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
      onChange={onChange}
      activeKey={activeKey}
      type="editable-card"
      onEdit={onEdit}
      items={tabs}
    />
  );
}