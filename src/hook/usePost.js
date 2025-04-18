import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseurl = "http://192.168.1.13:3000"


const usePost = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



  const postData = async (data, api, method = "POST") => {
    if (!data || !api) return;

    console.log("sending...",data)

    setLoading(true);
    try {
      const str = `${baseurl}${api}`;

      const accToken = await AsyncStorage.getItem("access_token");

      const options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accToken ? accToken : ""}`,
        },

        body: JSON.stringify(data),
      };

      console.log("Sending data:", data);

      const res = await fetch(str, options);


      
      console.log("status: ", res.status);
      const result = await res.json();
      console.log(result);

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

        
      } else if (res.status > 299) {
        throw new Error(result.message);
      }


      if (api === "/auth/user/login" || api === "/auth/user/signup") {
        const refToken = result.refresh_token;
        const accToken = result.access_token;

        await AsyncStorage.setItem("access_token", accToken);
        await AsyncStorage.setItem("refresh_token", refToken);
      }

      setResponse(result);
      console.log("fin")
      return result
    } catch (err) {
      setError(err); // invlaid token invalid req incomplete data
      console.log("post:", err); // print error




      return err.message // 
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, postData };
};

export default usePost;
