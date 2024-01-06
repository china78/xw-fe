interface FunctionArguments {
  [key: string]: any; // 函数的参数可以是任何类型
}

interface ToolFunction {
  name: string; // 要调用的函数的名称
  arguments: FunctionArguments; // 要传递给函数的参数
}

export interface ToolCall {
  id: string; // 工具调用的 ID
  type: 'function'; // 工具的类型，目前只支持 'function'
  function: ToolFunction; // 调用的函数详情
}
