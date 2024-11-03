import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Plugin } from 'unified'

interface OutputDisplayProps {
  output: string
  targetRef: React.RefObject<HTMLDivElement>
}

export default function OutputDisplay({ output, targetRef }: OutputDisplayProps) {
  const rehypePlugins = React.useMemo(() => [rehypeRaw as unknown as Plugin], [])

  return (
    <div ref={targetRef} className="p-4 bg-white rounded-lg prose prose-sm max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={{
          h1: (props) => <h1 className="text-2xl font-bold mb-4 text-black" {...props} />,
          h2: (props) => <h2 className="text-xl font-bold mb-3 text-black" {...props} />,
          h3: (props) => <h3 className="text-lg font-bold mb-2 text-black" {...props} />,
          p: (props) => <p className="mb-4 text-black" {...props} />,
          ul: (props) => <ul className="list-disc pl-5 mb-4 text-black" {...props} />,
          ol: (props) => <ol className="list-decimal pl-5 mb-4 text-black" {...props} />,
          li: (props) => <li className="mb-1 text-black" {...props} />,
        }}
      >
        {output}
      </ReactMarkdown>
    </div>
  )
}