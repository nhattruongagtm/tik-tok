import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
    name: 'session',
    initialState : {user: null},
    reducers: {
        getUser: (state,action) =>{
            state.user = action.payload;
        },
        updateUser: (state,action)=>{
            // console.log(action);
        }
    }
})

const {reducer,actions} = sessionSlice;
export const {getUser,updateUser} = actions;
export default reducer;
