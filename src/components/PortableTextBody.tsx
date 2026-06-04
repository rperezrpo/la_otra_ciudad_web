import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'

interface Props {
  value: PortableTextBlock[]
}

export default function PortableTextBody({ value }: Props) {
  return (
    <div className="prose">
      <PortableText value={value} />
    </div>
  )
}
