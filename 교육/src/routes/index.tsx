import { createBrowserRouter, RouterProvider } from 'react-router' //히스토리 기반으로 페이지 이동
//import Home from './pages/Home'
//import About from './pages/About'
import Default from './layouts/Default'
//import Movies from './pages/Movies'
//import MovieDetails from './pages/MovieDetails'
import { requiresAuth } from './loaders/requiresAuth'
import { guestOnly } from './loaders/guestOnly'
//import SignIn from './pages/Signin'
import { dynamic } from './dynamic'

/*
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Movies = lazy(() => import('./pages/Movies'))
const MovieDetails = lazy(() => import('./pages/MovieDetails'))
const SignIn = lazy(() => import('./pages/SignIn'))
*/
const router = createBrowserRouter([
  {
    element: <Default></Default>,
    children: [
      {
        path: '/', //http://localhost:5173/
        //element: <Home />
        Component: dynamic(() => import('./pages/Home'))
      },
      {
        path: '/about',
        Component: dynamic(() => import('./pages/About'))
      },
      {
        path: '/movies',
        Component: dynamic(() => import('./pages/Movies')),
        loader: requiresAuth,
        children: [
          {
            path: '/movies/:movieId',
            Component: dynamic(() => import('./pages/MovieDetails'))
          }
        ]
      },
      {
        path: 'signIn',
        loader: guestOnly,
        Component: dynamic(() => import('./pages/SignIn'))
      },
      {
        path: '*',
        element: <h1>Not Found</h1>
      }
    ]
  }
]) //관리할 페이지들을 처리

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>
}
