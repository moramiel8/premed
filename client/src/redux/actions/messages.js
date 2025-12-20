import {
  INIT_MESSAGE,
  GET_MESSAGE,
  GET_ERROR
} from './types';

export const initMessage = () => ({
  type: INIT_MESSAGE
});

export const setErrorMessage = (msg, status = 400) => (dispatch) => {
  dispatch({
    type: GET_ERROR,
    payload: { msg, status }
  });

  setTimeout(() => dispatch(initMessage()), 7000);
};

export const getMessage = (msgObj) => (dispatch) => {
  if (msgObj?.he) {
    dispatch({
      type: GET_MESSAGE,
      payload: { msg: msgObj.he }
    });

    setTimeout(() => dispatch(initMessage()), 7000);
  } else {
    dispatch(initMessage());
  }
};

export const getError = (error) => (dispatch) => {
  if (error?.response) {
    dispatch({
      type: GET_ERROR,
      payload: {
        msg:
          error.response.data?.he ||
          error.response.data?.msg ||
          "התרחשה תקלה לא צפויה. ניתן לרענן את הדף או לנסות מאוחר יותר.",
        status: error.response.status
      }
    });
  } else {
    dispatch({
      type: GET_ERROR,
      payload: {
        msg: "נראה שמשהו השתבש. לא הצלחנו להשלים את הפעולה.",
        status: 500
      }
    });
  }

  setTimeout(() => dispatch(initMessage()), 7000);
};
