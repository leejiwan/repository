export default function TextField({
  label,
  ...restProps
}: {
  ref?: React.RefObject<HTMLInputElement | null>
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <label className="flex flex-col gap-1">
        {label && <span className="text-xs text-gray-500">{label}</span>}
        <input
          {...restProps}
          className="h-[32px] rounded-md border-1 border-gray-500 px-2"
        />
      </label>
    </>
  )
}
