import type { ReactNode, ButtonHTMLAttributes } from 'react'
import Loader from '@/components/Loader'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  children: ReactNode
}

export default function Button({
  color = 'secondary',
  loading,
  children,
  ...restProps
}: ButtonProps) {
  const colors = {
    primary: 'bg-blue-500 hover:bg-blue-400',
    secondary: 'bg-gray-400 hover:bg-gray-300',
    danger: 'bg-red-500 hover:bg-red-400'
  }
  return (
    <button
      className={`relative h-[30px] min-w-[50px] shrink-0 cursor-pointer rounded-md text-white duration-200 ${colors[color]}`}
      {...restProps}>
      {loading ? (
        <Loader
          color="#fff"
          size={16}
          weight={2}
        />
      ) : (
        children
      )}
    </button>
  )
}
