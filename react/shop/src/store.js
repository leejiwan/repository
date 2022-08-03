import { configureStore, createSlice } from "@reduxjs/toolkit";
/*
    component간의 state 공유
*/

let user = createSlice({
    name: "user",
    initialState: "kim",
});

export default configureStore({
    reducer: {
        user: user.reducer,
    },
});