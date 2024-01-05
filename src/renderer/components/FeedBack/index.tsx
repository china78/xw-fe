import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Drawer, Button, Tooltip, Space } from 'antd';
import {
  VerticalAlignBottomOutlined,
  VerticalLeftOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import './style.css';

interface Props {
  title: string;
  openDraw: boolean;
  setOpenDraw: (o: boolean) => void;
}
export default function FeedBack(props: Props) {
  const { title = 'someTile', openDraw = false, setOpenDraw } = props;
  const [isRight, setIsRight] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(300);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(null);

  const onClose = () => {
    setOpenDraw(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeIcon = (
    <Button
      size="small"
      icon={<CloseOutlined />}
      onClick={() => setOpenDraw(false)}
    />
  );

  const renderTitle = useMemo(() => {
    return (
      <div className="titleBox">
        <div>{title}</div>
        <Space>
          <Tooltip title="关闭面板">{closeIcon}</Tooltip>
          <Tooltip title={isRight ? '底部展示' : '右侧展示'}>
            <Button
              size="small"
              icon={
                isRight ? (
                  <VerticalAlignBottomOutlined />
                ) : (
                  <VerticalLeftOutlined />
                )
              }
              onClick={() => setIsRight(!isRight)}
            />
          </Tooltip>
        </Space>
      </div>
    );
  }, [closeIcon, isRight, title]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging && startX.current !== null) {
        const deltaX = e.clientX - startX.current;
        setDrawerWidth((prevWidth) => Math.max(prevWidth - deltaX, 0));
        startX.current = e.clientX;
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      startX.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handleDragStart = (e: any) => {
    setDragging(true);
    startX.current = e.clientX;
  };

  return (
    <Drawer
      title={renderTitle}
      placement={isRight ? 'right' : 'bottom'}
      onClose={onClose}
      open={openDraw}
      closable={false}
      mask={false}
      width={drawerWidth}
    >
      <div className="ant-drawer-handle" onMouseDown={handleDragStart} />
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
}
