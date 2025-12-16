import { api } from "../api";
import useInterceptors from "./interceptors/useInterceptors";

const useAxios = () => {
  useInterceptors(api);
};

export default useAxios;
