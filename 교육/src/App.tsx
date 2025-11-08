import { useOptimistic, useState, startTransition } from 'react'

export default function App() {
  // 원본 상태 정의
  const [count, setCount] = useState(0)
  // 낙관적 상태 정의
  const initialValue = count
  const updateFn = (_state: number, newCount: number) => newCount
  const [optimisticCount, addOptimisticCount] = useOptimistic(
    initialValue,
    updateFn
  )
  // 상태 업데이트 함수
  async function increase(isSuccess: boolean) {
    startTransition(async () => {
      const newCount = optimisticCount + 1
      addOptimisticCount(newCount) // 즉시 UI 업데이트
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (isSuccess) {
        setCount(newCount)
      } else {
        addOptimisticCount(count)
      }
    })
  }

  return (
    <>
      <h2>Optimistic Count: {optimisticCount}</h2>
      <button onClick={() => increase(true)}>+1 (성공)</button>
      <button onClick={() => increase(false)}>+1 (실패)</button>
    </>
  )
}
