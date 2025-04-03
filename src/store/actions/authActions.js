import axiosInstance from "@/instance/axiosInstance";
import {
  registerSuccess,
  loginSuccess,
  logoutSuccess,
} from "@/store/reducer/authReducer";

export const registerUser = (userData) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/register", userData);
      if (response.data.errors) {
        return { errors: response.data.errors };
      } else {
        const { user } = response.data;
        dispatch(registerSuccess());
        return { user };

        // dispatch({
        //   type: "REGISTER_SUCCESS",
        //   payload: user,
        // });
      }
    } catch (error) {}
  };
};

export const loginUser = (userData) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/login", userData);
      if (response.data.errors) {
        return { errors: response.data.errors };
      } else {
        const { token, user } = response.data;
        dispatch(loginSuccess(user, token));
        return { user };
        // const { token, user } = response.data;
        // dispatch({
        //   type: "LOGIN_SUCCESS",
        //   payload: user,
        //   token: token,
        // });
      }
    } catch (error) {}
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(logoutSuccess());
  };
};
