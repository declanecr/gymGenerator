import { ReactNode } from 'react'
import DesktopLayout from './DesktopLayout'

interface Props {
  children: ReactNode
}

export default function WorkoutPageLayout({ children }: Props) {
  return (
    <DesktopLayout>
      {children}
    </DesktopLayout>
  )
}