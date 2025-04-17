import { useState } from "react";

const baseurl = "http://192.168.21.133:3000"

const useGet = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const [error, setError] = useState(null);

  const getData = async (str) => {
    try {
      setLoading(true);
      const api = `${baseurl}${str}`;

      const accToken = await AsyncStorage.getItem("access_token");

      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accToken ? accToken : ""}`,
        },
      };

      

      const res = await fetch(api, options);

      const result = await res.json();


      if (res.status === 403) {
        const refToken = await AsyncStorage.getItem("refresh_token");

        const res = await fetch(`${baseurl}/refresh_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify(refToken),
        });

        const result2 = await res.json()

        if (res.status === 403) {
          throw new Error("Unauthorized");
        }
        const accToken = result2.access_token;
        await AsyncStorage.setItem("access_token", accToken);


        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accToken ? accToken : ""}`,
          },
        };

        res = await fetch(api, options);

        result = await res.json();

        
      } else if (res.status > 299) {
        throw new Error(result.message);
      }

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




