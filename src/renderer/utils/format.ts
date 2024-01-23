// eslint-disable-next-line import/prefer-default-export
export function prettyObject(msg: any) {
  const obj = msg;
  if (typeof msg !== 'string') {
    msg = JSON.stringify(msg, null, '  ');
  }
  if (msg === '{}') {
    return obj.toString();
  }
  if (msg.startsWith('```json')) {
    return msg;
  }
  return ['```json', msg, '```'].join('\n');
}

export function getExtension(filePath: string) {
  const extension = filePath.substring(filePath.lastIndexOf('.'));
  return extension ?? '';
}
