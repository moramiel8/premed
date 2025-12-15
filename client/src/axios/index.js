import axios from 'axios';
import useInterceptors from './interceptors/useInterceptors';

axios.defaults.baseURL ="";

axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

const useAxios = () => {
  useInterceptors();
};

export default useAxios;
