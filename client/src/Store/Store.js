import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthSlice.js"
import ProductReducer from "./ProductSlice";

const Store = configureStore({
    reducer: {
        auth: AuthReducer, 
        product:ProductReducer
    },
});

export default Store;
