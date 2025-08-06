import { ReactNode } from 'react'
import DefaultLayout from './devices/DefaultLayout'

interface Props {
  children: ReactNode
}

export default function CreateExercisePageLayout({ children }: Props) {


  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  )
}