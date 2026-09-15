import type { ReactNode } from 'react'

type RichTextProps = {
  text: string
  className?: string
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+]\([^)]+\))/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))

    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else {
      const link = token.match(/^\[([^\]]+)]\(([^)]+)\)$/)
      if (link) {
        nodes.push(
          <a key={key++} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]}
          </a>,
        )
      }
    }

    last = match.index + token.length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function RichText({ text, className }: RichTextProps) {
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          {paragraph.split('\n').map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 ? <br /> : null}
              {renderInline(line)}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
