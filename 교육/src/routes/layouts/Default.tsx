import { NavLink, Outlet, ScrollRestoration } from 'react-router'

export default function Default() {
  return (
    <>
      <header>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/signin">Sign In</NavLink>
      </header>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
