import { useCallback, useEffect, useState } from 'react';

export const useApi = (request, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request();
      setData(response.data);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, reload, setData };
};
