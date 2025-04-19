import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";

const baseurl = BASE_URL


const useGet = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const getData = async (str, method = "GET") => {
    try {
      setLoading(true);
      const api = `${baseurl}${str}`;
      let accToken = await AsyncStorage.getItem("access_token");

      let options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accToken || ""}`,
        },
      };

      

      let res = await fetch(api, options);
      let result = await res.json();

      if (res.status === 403) {
        const refToken = await AsyncStorage.getItem("refresh_token");

        const refreshRes = await fetch(`${baseurl}/refresh_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refToken }),
        });

        const refreshResult = await refreshRes.json();

        if (refreshRes.status === 403) {
          throw new Error("Unauthorized");
        }

        accToken = refreshResult.access_token;
        await AsyncStorage.setItem("access_token", accToken);

        options.headers.Authorization = `Bearer ${accToken}`;
        res = await fetch(api, options);
        result = await res.json();
      } else if (res.status > 299) {
        throw new Error(result.message || "Request failed");
      }

      setResponse(result);

      return result
    } catch (err) {
      setError(err);

      return err.message
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, getData };
};

export default useGet;
