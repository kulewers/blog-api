import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../context/LoginContext";
import Cookies from "js-cookie";

export default function useFetch(url) {
  const { isLoggedIn } = useContext(LoginContext);

  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        let headers;
        if (isLoggedIn) {
          const token = Cookies.get("Authorization");
          headers = {
            Authorization: token,
          };
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
