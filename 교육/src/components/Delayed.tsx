import { useQuery } from '@tanstack/react-query'

export default function DelayedData() {
  const { data, isStale } = useQuery({
    queryKey: ['delay'],
    queryFn: async () =>
      (await fetch('https://api.heropy.dev/v0/delay?t=1000')).json(),
    staleTime: 1000 * 10 // 10초 후 상함. 즉, 10초 동안 신선함.
  })
  return (
    <>
      <div>데이터가 {isStale ? '상했어요..' : '신선해요!'}</div>
      <div>{JSON.stringify(data)}</div>
    </>
  )
}
