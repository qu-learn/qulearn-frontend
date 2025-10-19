import React from "react"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkMath from "remark-math"
import rehypeMathjax from "rehype-mathjax"
import rehypeRaw from "rehype-raw"

export function hasJavaScriptCode(content: string): boolean {
  const jsCodeBlockRegex = /```(javascript|js)\s/i
  return jsCodeBlockRegex.test(content)
}

export function LessonContent({ content }: { content: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeMathjax, rehypeRaw]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          const inline = 'inline' in props && props.inline
          return !inline && match ? (
            <SyntaxHighlighter
              style={vs as any}
              language={match[1]}
              PreTag="div"
              {...props as any}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
      }}
    >
      {content}
    </Markdown>
  )
}
