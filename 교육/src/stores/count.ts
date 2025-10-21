import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export const useCountStore = create(
  combine(
    {
      count: 0 //상태
    },
    function (set, get) {
      //액션
      return {
        increse: function () {
          const { count } = get()
          set({
            count: count + 1
          })
        }
      }
    }
  )
)
