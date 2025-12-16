import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { GET_USER_FAILURE } from '../../redux/auth/types';

const refreshTokenUrl = '/auth/refreshToken';

const useInterceptors = (api) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const id = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // אין response (רשת/timeout)
        if (!error.response) return Promise.reject(error);

        // אם refresh עצמו נכשל ב-401 → להוציא משתמש
        if (error.response.status === 401 && originalRequest?.url === refreshTokenUrl) {
          dispatch({ type: GET_USER_FAILURE });
          return Promise.reject(error);
        }

        const isAuthRoute =
          originalRequest?.url === '/auth/login' ||
          originalRequest?.url === '/auth/register' ||
          originalRequest?.url === refreshTokenUrl ||
          originalRequest?.url === '/auth/logout';

        // על 401: refresh פעם אחת ואז retry
        if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {
          originalRequest._retry = true;

          try {
            await api.post(refreshTokenUrl);
            return api(originalRequest);
          } catch (err) {
            dispatch({ type: GET_USER_FAILURE });
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    // cleanup כדי שלא יצטברו interceptors
    return () => {
      api.interceptors.response.eject(id);
    };
  }, [api, dispatch]);
};

export default useInterceptors;
