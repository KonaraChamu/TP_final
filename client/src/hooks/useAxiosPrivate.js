import { useEffect } from 'react';
import axios, { axiosPrivate } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // If refresh token is valid, try again with new access token
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }

        // If refresh token is expired, log out
        if (error?.response?.status === 403) {
          setAuth({});
          await axios.post('signout', {}, { withCredentials: true });
          navigate('/auth');
          return axiosPrivate(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
