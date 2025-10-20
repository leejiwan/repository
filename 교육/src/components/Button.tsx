import { ReactNode, ButtonHTMLAttributes } from 'react'
import Loader from '@/components/Loader'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean //옵셔널 속성
  children: ReactNode
}

export default function Button({
  loading,
  children,
  ...restProps
}: ButtonProps) {
  return <button {...restProps}>{loading ? <Loader /> : children}</button>
}
