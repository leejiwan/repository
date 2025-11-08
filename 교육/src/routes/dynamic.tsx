import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface DynamicOptions {
  error?: ({ error }: { error: Error }) => React.ReactNode
  loading?: React.ReactNode
}

export function dynamic(
  importFn: () => Promise<{ default: React.ComponentType }>,
  options: DynamicOptions = {}
) {
  const Component = lazy(() => importFn())

  return function DynamicComponent() {
    return (
      <ErrorBoundary
        fallbackRender={
          options.error || (({ error }) => <div>Error: {error.message}</div>)
        }>
        <Suspense fallback={options.loading || <div>Loading...</div>}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    )
  }
}
