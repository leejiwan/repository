import { configureStore, createSlice } from '@reduxjs/toolkit'

/*
1. createSlice( ) 상단에서 import 해온 다음에 

{ name : 'state이름', initialState : 'state값' } 이거 넣으면 state 하나 생성가능합니다. 

(createSlice( ) 는 useState( ) 와 용도가 비슷하다고 보면 됩니다)

 

2. state 등록은 configureStore( ) 안에 하면 됩니다.

{ 작명 : createSlice만든거.reducer } 이러면 등록 끝입니다. 

여기 등록한 state는 모든 컴포넌트가 자유롭게 사용가능합니다. 


*/
let footerData = createSlice({
    name: 'footerData',
    initialState: 'Data provided by Marvel. © 2022 MARVEL',
    reducers: {
        changeText(state, action) {
            return action.payload
        }
    }
})

export default configureStore({
    reducer: {
        footerData: footerData.reducer
    }
})

export let { changeText } = footerData.actions 