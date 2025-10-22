import { create } from 'zustand'
import { combine, persist, devtools } from 'zustand/middleware'
import axios from 'axios'

export interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export const useMovieStore = create(
  devtools(
    persist(
      combine(
        {
          searchText: '',
          loading: false,
          movies: [] as Movie[]
        },
        function (set, get) {
          //액션
          return {
            setSearchText(searchText: string) {
              set({
                searchText
              })
            },
            async fetchMovies() {
              set({
                loading: true
              })
              const { searchText } = get()
              const { data } = await axios.get(
                `https://omdbapi.com?apikey=7035c60c&s=${searchText}`
              )
              const movies = data.Search
              set({
                movies,
                loading: true
              })
            }
          }
        }
      ),
      { name: 'movie store' }
    )
  )

  /*
 
    */
)
