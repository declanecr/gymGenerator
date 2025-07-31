import { ReactNode } from 'react'
import DesktopLayout from './DesktopLayout'

interface Props {
  children: ReactNode
}

export default function CreateExercisePageLayout({ children }: Props) {
  return (
    <DesktopLayout>
      {children}
    </DesktopLayout>
  )
}