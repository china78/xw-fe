import React, { useState } from 'react';
import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { Directory } from '../../main/util';
import ResizableSider from '../components/ResizableSider';

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
    padding: 10,
  };

  const contentStyle: React.CSSProperties = {
    flex: '1',
    // padding: '16px',
  };

  return (
    <div style={layoutStyle}>
      <div style={siderStyle}>
        <DirectoryTree
          multiple
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
        />
      </div>
      <div style={contentStyle}>
        <ResizableSider width={width} setWidth={setWidth}>
          <div>代码展示区域</div>
        </ResizableSider>
      </div>
    </div>
  );
}
