// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Router from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient1 = new QueryClient()
const queryClient2 = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient1}>
    <Router />
  </QueryClientProvider>
)
