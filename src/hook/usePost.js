import { useState } from "react";

const usePost = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = async (data, api) => {
    if (!data || !api) return;

    setLoading(true);
    try {
      const str = `http://192.168.1.4:3000${api}`;
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      console.log("Sending data:", data);

      const res = await fetch(str, options);
      const result = await res.json();

      setResponse(result);
    } catch (err) {
      setError(err);
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, postData };
};

export default usePost;
