import 'react-resizable/css/styles.css';
import { ResizableBox } from 'react-resizable';
import './ResizableSider.css';

export default function ResizableSider(props: any) {
  const { width, children } = props;

  console.log('Before return:', width);

  return (
    <ResizableBox
      width={width}
      height={Infinity}
      draggableOpts={{ grid: [25, 25] }}
      minConstraints={[100, 100]}
      maxConstraints={[300, 300]}
    >
      <span>{children}</span>
    </ResizableBox>
  );
}
