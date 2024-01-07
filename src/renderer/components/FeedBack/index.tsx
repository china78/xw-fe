import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Drawer, Button, Tooltip, Space } from 'antd';
import {
  VerticalAlignBottomOutlined,
  VerticalLeftOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import './style.css';
import ChatRoom from '../ChatRoom';

interface Props {
  title: string;
  openDraw: boolean;
  setOpenDraw: (o: boolean) => void;
}
function FeedBack(props: Props) {
  const { title = 'someTile', openDraw = false, setOpenDraw } = props;
  const [isRight, setIsRight] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(500);
  const [drawerHeight, setDrawerHeight] = useState<string | number>('100vh');
  const [dragging, setDragging] = useState(false);
  const startXY = useRef(null);

  useEffect(() => {
    if (!isRight) {
      setDrawerHeight(387);
    }
  }, [isRight]);
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

  const handleMouseMove = useCallback(
    (e: any) => {
      if (dragging && startXY.current !== null) {
        if (isRight) {
          const deltaX = e.clientX - startXY.current;
          setDrawerWidth((prevWidth) => Math.max(prevWidth - deltaX, 0));
          startXY.current = e.clientX;
        } else {
          const deltaY = e.clientY - startXY.current;
          setDrawerHeight((prevHeight: number | any) => {
            const newHeight = Math.max(prevHeight - deltaY, 0);
            return newHeight;
          });
          startXY.current = e.clientY;
        }
      }
    },
    [dragging, isRight],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    startXY.current = null;
  }, []);

  useEffect(() => {
    const container = document;

    const handleMouseMoveDebounced = (e: any) => {
      requestAnimationFrame(() => handleMouseMove(e));
    };

    container.addEventListener('mousemove', handleMouseMoveDebounced);
    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousemove', handleMouseMoveDebounced);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDragStart = (e: any) => {
    setDragging(true);
    if (isRight) {
      startXY.current = e.clientX;
    } else {
      startXY.current = e.clientY;
    }
  };

  const doorHandle = useMemo(() => {
    if (isRight) {
      return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className="ant-drawer-handle-right"
          onMouseDown={handleDragStart}
        />
      );
    }
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className="ant-drawer-handle-top"
        onMouseDown={handleDragStart}
        style={{
          top: 0,
          height: '8px',
          width: '100%',
        }}
      />
    );
  }, [handleDragStart, isRight]);

  return (
    <Drawer
      title={renderTitle}
      placement={isRight ? 'right' : 'bottom'}
      onClose={onClose}
      open={openDraw}
      closable={false}
      mask={false}
      width={drawerWidth}
      height={drawerHeight}
    >
      {doorHandle}
      <ChatRoom />
    </Drawer>
  );
}

export default React.memo(FeedBack);
