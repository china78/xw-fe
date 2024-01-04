import { Drawer, Button, Tooltip, Space } from 'antd';
import './style.css';
import { useMemo, useState } from 'react';
import {
  VerticalAlignBottomOutlined,
  VerticalLeftOutlined,
  CloseOutlined
} from '@ant-design/icons';

interface Props {
  title: string;
  openDraw: boolean;
  setOpenDraw: (o: boolean) => void;
}
export default function FeedBack(props: Props) {
  const { title = 'someTile', openDraw = false, setOpenDraw } = props;

  const [isRight, setIsRight] = useState(true);

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

  return (
    <Drawer
      size="large"
      title={renderTitle}
      placement={isRight ? 'right' : 'bottom'}
      onClose={onClose}
      open={openDraw}
      closable={false}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
}
