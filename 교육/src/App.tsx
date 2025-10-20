import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export default function App() {
  const [count, setCount] = useState(0)
  const [movies, setMovie] = useState<Movie[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    //비동기 함수X async X
    fetchMovies()
    inputRef.current?.focus() //null이나 undefiend면 다음 체인으로 넘어가지 않는다
  }, [])

  async function fetchMovies() {
    const { data } = await axios.get(
      'https://omdbapi.com?apikey=7035c60c&s=frozen'
    )
    const movies = data.Search
    console.log(movies)
    setMovie(movies)
    setCount(movies.length)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
      />
      <h1 className="text-4xl font-bold">App.tsx</h1>
      <h2>{count}</h2>
      {movies.map(movie => (
        <div key={movie.imdbID}>
          <div>{movie.Title}</div>
          <img src={movie.Poster}></img>
        </div>
      ))}
    </>
  )
}
