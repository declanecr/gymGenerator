import { ReactNode } from 'react'
import DesktopLayout from './DesktopLayout'

interface Props {
  children: ReactNode
}

export default function AdminPageLayout({ children }: Props) {
  return (
    <DesktopLayout>
      {children}
    </DesktopLayout>
  )
}