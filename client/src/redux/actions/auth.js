import {
    GET_USER_LOADING,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    
    GET_USERS_LOADING,
    GET_USERS_SUCCESS,
    GET_USERS_FAILURE,

    GET_USERS_LOAD_MORE_LOADING,
    GET_USERS_LOAD_MORE_SUCCESS,
    GET_USERS_LOAD_MORE_FAILURE,

    LOGIN_LOADING,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_LOADING, 
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    EDIT_USER_LOADING,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAILURE,
    CHANGE_PASSWORD_LOADING,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,

    REQUEST_FORGOT_PASSWORD_LOADING,
    REQUEST_FORGOT_PASSWORD_SUCCESS,
    REQUEST_FORGOT_PASSWORD_FAILURE,

    RESET_PASSWORD,
    RESET_PASSWORD_LOADING,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,

    LOGOUT
} from '../auth/types';
import { getError, getMessage } from './messages';
import {  setLoader } from '../loader/utils'
import { api } from "../../api";

export const logout = () => dispatch =>
  api.post('/auth/logout').then(() => dispatch({ type: LOGOUT }));

// Get user
export const getUser = () => dispatch => {
  dispatch(setLoader(GET_USER_LOADING));
  api.get('/auth/user')
    .then(res => dispatch({ type: GET_USER_SUCCESS, payload: res.data }))
    .catch(() => dispatch({ type: GET_USER_FAILURE }));
};



// Get users
export const getUsers = filters => dispatch => {
  dispatch(setLoader(GET_USERS_LOADING));

  api.post('/auth/users', filters)
    .then(res => dispatch({ type: GET_USERS_SUCCESS, payload: res.data }))
    .catch(() => dispatch({ type: GET_USERS_FAILURE }));
};

// Load more users
export const getMoreUsers = filters => dispatch => {
  dispatch(setLoader(GET_USERS_LOAD_MORE_LOADING));

  api.post('/auth/users', filters)
    .then(res => dispatch({ type: GET_USERS_LOAD_MORE_SUCCESS, payload: res.data }))
    .catch(() => dispatch({ type: GET_USERS_LOAD_MORE_FAILURE }));
};


// Login
export const login = data => dispatch => {
  dispatch(setLoader(LOGIN_LOADING));
  api.post('/auth/login', data)
    .then(res => dispatch({ type: LOGIN_SUCCESS, payload: res.data }))
    .catch(err => {
      dispatch({ type: LOGIN_FAILURE });
      dispatch(getError(err));
    });
};


// Register
export const register = data => dispatch => {
  dispatch(setLoader(REGISTER_LOADING));

  api.post('/auth/register', data)
    .then(res => dispatch({ type: REGISTER_SUCCESS, payload: res.data }))
    .catch(err => {
      dispatch({ type: REGISTER_FAILURE });
      dispatch(getError(err));
    });
};

export const editUser = data => dispatch => {
  dispatch(setLoader(EDIT_USER_LOADING));

  api.put('/auth/user', data)
    .then(res => {
      dispatch({ type: EDIT_USER_SUCCESS, payload: res.data.user });
      dispatch(getMessage(res.data.msg));
    })
    .catch(err => {
      dispatch({ type: EDIT_USER_FAILURE });
      dispatch(getError(err));
    });
};

export const changePassword = data => async dispatch => {
  dispatch({ type: CHANGE_PASSWORD_LOADING });

  try {
    const res = await api.put('/auth/changePassword', data);
    dispatch({ type: CHANGE_PASSWORD_SUCCESS });
    dispatch(getMessage(res.data));
  } catch (err) {
    dispatch({ type: CHANGE_PASSWORD_FAILURE });
    dispatch(getError(err));
  }
};

export const requestForgotPasswordEmail = email => async dispatch => {
  dispatch({ type: REQUEST_FORGOT_PASSWORD_LOADING });

  try {
    const res = await api.post('/auth/forgotPassword', email);
    dispatch({ type: REQUEST_FORGOT_PASSWORD_SUCCESS });
    dispatch(getMessage(res.data));
  } catch (err) {
    dispatch({ type: REQUEST_FORGOT_PASSWORD_FAILURE });
    dispatch(getError(err));
  }
};

export const resetPassword = (token, data) => async dispatch => {
  dispatch({ type: RESET_PASSWORD_LOADING });

  try {
    const res = await api.post(`/auth/resetPassword/${token}`, { password: data.newPassword });
    dispatch({ type: RESET_PASSWORD_SUCCESS });
    dispatch(getMessage(res.data));
  } catch (err) {
    dispatch({ type: RESET_PASSWORD_FAILURE });
    dispatch(getError(err));
  }
};