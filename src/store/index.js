import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./reducer/counterReducer";
import darklightReducer from "./reducer/darklightReducer";
import authReducer from "./reducer/authReducer";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    darklight: darklightReducer,
    auth: authReducer,
  },
  middleware: [thunk],
});

export default store;
