import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function useFetch(url, { authorize } = {}) {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        let headers = {};
        if (authorize) {
          const token = Cookies.get("Authorization");
          if (token) {
            headers["Authorization"] = token;
          }
        }

        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsPending(false);
        setData(json);
        setError(null);
      } catch (error) {
        setError(`${error} Could not Fetch Data `);
        setIsPending(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, isPending, error };
}
