import { ReactNode } from 'react'
import BaseLayout from './BaseLayout'

interface Props {
  children: ReactNode
}

export default function WorkoutPageLayout({ children }: Props) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  )
}