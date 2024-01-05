import Draggable from 'react-draggable';
import './style.css';

export default function ResizableSider(props: any) {
  const { width, children, setWidth, openDraw } = props;

  const handleDrag = (e: any, ui: { deltaX: any }) => {
    setWidth(width - ui.deltaX);
  };

  return (
    <Draggable
      axis="x"
      handle=".handle"
      defaultPosition={{ x: 0, y: 0 }}
      grid={[1, 1]}
      scale={1}
      onDrag={handleDrag}
    >
      <div className="handlebox">
        <div className="handle" />
        <div className="content" style={{ width: openDraw ? width : 0 }}>
          {children}
        </div>
      </div>
    </Draggable>
  );
}
