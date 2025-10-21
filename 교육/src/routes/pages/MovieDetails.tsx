import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'
import Modal from '@/components/Modal'

interface MovieDetails {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: {
    Source: string
    Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

export default function MovieDetails() {
  const { movieId } = useParams()
  const [loading, setLoading] = useState(false)
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const naviage = useNavigate()

  useEffect(() => {
    fetchMovieDetails()
  }, [])

  async function fetchMovieDetails() {
    setLoading(true)
    const { data: movie } = await axios.get(
      `https://omdbapi.com?apikey=7035c60c&i=${movieId}`
    )
    setMovie(movie)
    setLoading(false)
  }

  function onCloseModal() {
    naviage('/movies')
  }

  return (
    <Modal onClose={onCloseModal}>
      <div className="mx-auto flex max-w-[1400px] gap-[30px]">
        {loading
          ? '로딩 중...'
          : movie && (
              <>
                <div>
                  <img
                    src={movie.Poster.replace('SX300', 'SX1000')}
                    alt={movie.Title}
                    className="max-w-[700px]"
                  />
                </div>
                <div>
                  <h1 className="text-[70px] font-bold">{movie.Title}</h1>
                  <p>{movie.Plot}</p>
                </div>
              </>
            )}
      </div>
    </Modal>
  )
}
