import { ReactNode } from 'react'
import DesktopLayout from './DesktopLayout'

interface Props {
  children: ReactNode
}

export default function TemplateWorkoutPageLayout({ children }: Props) {
  return (
    <DesktopLayout>
      {children}
    </DesktopLayout>
  )
}