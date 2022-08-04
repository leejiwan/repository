import { configureStore, createSlice } from "@reduxjs/toolkit";
/*
    component간의 state 공유
*/

let user = createSlice({
  name: "user",
  initialState: "kim",
});
let prod = createSlice({
  name: "prod",
  initialState: [
    { id: 0, name: "nike", count: 2 },
    { id: 1, name: "adidas", count: 1 },
  ],
});

export default configureStore({
  reducer: {
    user: user.reducer,
    prod: prod.reducer,
  },
});
