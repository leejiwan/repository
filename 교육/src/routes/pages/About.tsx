import { useCountStore } from '@/stores/count'

export default function About() {
  const count = useCountStore(state => state.count)
  const increse = useCountStore(state => state.increse)
  return (
    <>
      <h1>About Page!!</h1>
      <h2 onClick={increse}>{count}</h2>
    </>
  )
}
