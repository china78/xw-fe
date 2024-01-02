import React, { useState } from 'react';
import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { Directory } from '../../main/util';
import ResizableSider from '../components/ResizableSider';
import 'react-resizable/css/styles.css';

interface Props {
  treeData: Directory[];
}

export default function Editor(props: Props) {
  const { treeData } = props;
  const [width, setWidth] = useState(200);
  const { DirectoryTree } = Tree;

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info);
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
  };

  const contentStyle: React.CSSProperties = {
    flex: '1',
    padding: '16px',
  };

  return (
    <div style={layoutStyle}>
      <div style={siderStyle}>
        <ResizableSider
          width={width}
          setWidth={setWidth}
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
        >
          <DirectoryTree
            style={{ height: '100vh' }}
            multiple
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
          />
        </ResizableSider>
      </div>
      <div style={contentStyle}>
        <div>代码展示区域</div>
      </div>
    </div>
  );
}
