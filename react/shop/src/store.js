import { configureStore, createSlice } from "@reduxjs/toolkit";
//import { user } from "./userSlice.js"

/*
    component간의 state 공유
*/

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


let prod = createSlice({
  name: "prod",
  initialState: [
    { id: 0, name: "nike", count: 2 },
    { id: 1, name: "adidas", count: 1 },
  ],

  reducers: {
    updateProd(state, param) {
      state[param.payload].count++;

    },
    addProd(state) {
      let obj = {};
      obj.id = 3;
      obj.name = 'adidas';
      obj.count = 1;
      state.push(obj)
    }
  }
});

export default configureStore({
  reducer: {
    user: user.reducer,
    prod: prod.reducer,
  },
});

export let { update, update2 } = user.actions; //오른쪽 자료를 변수로 뺴기 위한 문법
export let { updateProd, addProd } = prod.actions;