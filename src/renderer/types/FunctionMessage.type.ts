export interface FunctionMessage {
  role: 'function';
  content: string;
  name: string;
}
