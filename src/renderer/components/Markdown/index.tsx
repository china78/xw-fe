import React, { useMemo, useRef, useState, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import RemarkMath from 'remark-math';
import RemarkBreaks from 'remark-breaks';
import RehypeKatex from 'rehype-katex';
import RemarkGfm from 'remark-gfm';
import RehypeHighlight from 'rehype-highlight';
import mermaid from 'mermaid';

function escapeDollarNumber(text: string) {
  let escapedText = '';

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i];
    const nextChar = text[i + 1] || ' ';

    if (char === '$' && nextChar >= '0' && nextChar <= '9') {
      char = '\\$';
    }

    escapedText += char;
  }

  return escapedText;
}

interface MermaidProps {
  code: string;
}

export function Mermaid(props: MermaidProps) {
  const { code } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error('[Mermaid] ', e.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (hasError) {
    return null;
  }

  return (
    <div
      className="no-dark mermaid"
      style={{
        cursor: 'pointer',
        overflow: 'auto',
      }}
      ref={ref}
    >
      {code}
    </div>
  );
}

interface _MarkDownContentProps {
  content: string;
}
// eslint-disable-next-line no-underscore-dangle
function _MarkDownContent(props: _MarkDownContentProps) {
  const { content } = props;
  const escapedContent = useMemo(() => escapeDollarNumber(content), [content]);

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

interface MarkdownProps {
  content: string;
  // eslint-disable-next-line react/require-default-props
  loading?: boolean;
}
export function Markdown(props: MarkdownProps) {
  const { loading, content } = props;
  return (
    <div className="markdown-body" dir="auto">
      {loading ? <LoadingOutlined /> : <MarkdownContent content={content} />}
    </div>
  );
}
