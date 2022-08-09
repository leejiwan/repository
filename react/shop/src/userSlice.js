import { createSlice } from "@reduxjs/toolkit"; //redux 개선버전

let user = createSlice({
  name: "user",
  initialState: { name: "kim", age: 20 },

  /*
    Redux의 state 변경하는 법
    -state 수정해주는 함수 만들고
    -원할 때 그 함수 실행해달라고 store.js에 요청
  */
  reducers: {
    update(state) { //기존 state
      //state.name = 'jone arm';
      return { name: "jone kim", age: 20 }
    },
    update2(state) {
      return { name: "jone kim", age: (state.age + 1) }
    }
  }
});

export let { update, update2 } = user.actions; //오른쪽 자료를 변수로 뺴기 위한 문법
export default user;