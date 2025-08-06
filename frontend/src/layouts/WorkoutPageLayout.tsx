import { ReactNode } from 'react'
import DefaultLayout from './devices/DefaultLayout'

interface Props {
  children: ReactNode
}

export default function WorkoutPageLayout({ children }: Props) {


  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  )
}