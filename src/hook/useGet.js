import { useState } from "react";

const useGet = () => {
  const [loading, setLoading] = useState(false);
  const [reponse, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const getData = async (str) => {
    try {
      setLoading(true);
      const api = `http://192.168.1.4:3000${str}`;
      const res = await fetch(api);

      const result = await res.json();

      setResponse(result); 
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { reponse, error, loading, getData };
};

export default useGet




