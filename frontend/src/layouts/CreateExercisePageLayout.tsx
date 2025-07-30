import { ReactNode } from 'react'
import BaseLayout from './BaseLayout'

interface Props {
  children: ReactNode
}

export default function CreateExercisePageLayout({ children }: Props) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  )
}