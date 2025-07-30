import { ReactNode } from 'react'
import BaseLayout from './BaseLayout'

interface Props {
  children: ReactNode
}

export default function AdminPageLayout({ children }: Props) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  )
}