import SignIn from '@/routes/pages/SignIn'
import { create as createStore } from 'zustand'
import {
  combine
  // subscribeWithSelector,
  // persist,
  // devtools
} from 'zustand/middleware'

interface User {
  name: string
  age: number
}

export const useCreateStore = createStore(
  combine(
    {
      user: { name: '', age: -1 } satisfies User as User
    },
    (set, get) => {
      return {
        signin: function () {
          set(state => {
            return {
              user: {
                ...state.user,
                age: 12
              }
            }
          })
        }
      }
    }
  )
)
