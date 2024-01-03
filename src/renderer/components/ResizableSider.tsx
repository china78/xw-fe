import Draggable from 'react-draggable';
import './ResizableSider.css';

export default function ResizableSider(props: any) {
  const { width, children, setWidth } = props;

  const handleDrag = (e: any, ui: { deltaX: any }) => {
    setWidth(width + ui.deltaX);
  };

  return (
    <Draggable
      axis="x"
      handle=".handle"
      defaultPosition={{ x: 0, y: 0 }}
      grid={[1, 1]}
      scale={1.5}
      onDrag={handleDrag}
    >
      <div className="handlebox">
        <div className="handle" />
        <div className="content">{children}</div>
      </div>
    </Draggable>
  );
}
