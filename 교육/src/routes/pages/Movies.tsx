import { Fragment, useState } from 'react'
import { Link, Outlet } from 'react-router'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
//import { useMovieStore } from '@/stores/movie'
//import { useQuery } from '@tanstack/react-query'
//import axios from 'axios'
import type { Movie } from '@/stores/movie'
import { useMovieStore, useInfiniteMovies } from '@/hooks/movies'

export default function Movies() {
  const [inputText, setInputText] = useState('')
  //const searchText = useMovieStore(s => s.searchText)
  const setSearchText = useMovieStore(s => s.setSearchText)
  //const fetchMovies = useMovieStore(s => s.fetchMovies)
  //const loading = useMovieStore(s => s.loading)
  //const movies = useMovieStore(s => s.movies)

  const { data: movies = [], isFetching: loading } = useInfiniteMovies()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSearchText(inputText)
  }
  return (
    <>
      {/* <Button onClick={() => refetch()}>다시 ㅅ가져오기</Button>*/}
      <form onSubmit={handleSubmit}>
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <Button type="submit">검색</Button>
      </form>
      {loading ? <Loader /> : null}
      <ul>
        {data?.pages.map((page, index) => {
          ;<Fragment key={index}>
            {page.Seacrh.map(movie => (
              <li key={movie.imdbID}>
                <Link to={`/movies/${movie.imdbID}`}>{movie.Title}</Link>
              </li>
            ))}
          </Fragment>
        })}
      </ul>
      <button onClick={() => {}}>더보기</button>
      <Outlet></Outlet>
    </>
  )
}
