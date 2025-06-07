import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
};

const  userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUsername(state, name){
            state.name = name.payload;

        },
        clearUsername(state){
            state.name = "";
        }
    }
})


export const {setUsername, clearUsername} = userSlice.actions;
export default userSlice.reducer;