// 定义用户消息的文本内容部分
interface TextContentPart {
  type: 'text';
  text: string;
}

// 定义用户消息的图像内容部分
interface ImageContentPart {
  type: 'image_url';
  image_url: {
    url: string; // 图像的 URL 或 base64 编码的图像数据
    detail?: 'auto' | string; // 图像的细节级别，可选
  };
}

// 文本内容和图像内容的联合类型
export type ContentPart = TextContentPart | ImageContentPart;

// 用户消息可以是单个字符串或由不同内容部分组成的数组
type UserMessageContent = string | ContentPart[];

export interface UserMessage {
  role: 'user';
  content: UserMessageContent;
  name?: string; // 参与者的可选名称
}
