import { ReactNode } from 'react'
import BaseLayout from './BaseLayout'

interface Props {
  children: ReactNode
}

export default function TemplateWorkoutPageLayout({ children }: Props) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  )
}