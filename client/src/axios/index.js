import axios from 'axios';
import useInterceptors from './interceptors/useInterceptors';

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || '/api';

axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

const useAxios = () => {
  useInterceptors();
};

export default useAxios;
