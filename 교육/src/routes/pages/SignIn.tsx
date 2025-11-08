import { useState } from 'react'
import api, { ACCESS_TOKEN_NAME } from '@/lib/api'
import { useNavigate } from 'react-router'
import TextField from '@/components/TextField'
import Button from '@/components/Button'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    console.log(email, password)
    const {
      data: { token }
    } = await api.post('/auth/signin', {
      email,
      password
    })
    localStorage.setItem(ACCESS_TOKEN_NAME, token)
    // window.location.href = '/'
    navigate('/')
    setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2초 후 로딩 해제
  }

  return (
    <form
      className="flex max-w-[400px] flex-col gap-2"
      onSubmit={handleSubmit}>
      <TextField
        type="email"
        name="email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={event => setEmail(event.target.value)}
      />
      <TextField
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <Button
        type="submit"
        disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}
