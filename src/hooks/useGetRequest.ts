import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

interface UseGetRequestProps<T> {
  url: string;
  token: string;
}

const useGetRequest = <T>({ url, token }: UseGetRequestProps<T>) => {
  // const dispatch = useDispatch();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // dispatch(loaderTrue());
        const response: AxiosResponse<T> = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Accept: 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
        // dispatch(loaderFalse());
        setData(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError(error);
        // dispatch(loaderFalse());
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useGetRequest;
