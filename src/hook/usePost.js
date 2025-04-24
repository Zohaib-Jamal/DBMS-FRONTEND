import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";

const baseurl = BASE_URL


const usePost = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



  const postData = async (data, api, method = "POST") => {
    if (!data || !api) return;
    

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

      

      const res = await fetch(str, options);


      
      
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








        options.headers.Authorization = `Bearer ${accToken}`;
        res = await fetch(str, options);
        result = await res.json();


      } else if (res.status > 299) {
        throw new Error(result.message);
      }


      if (api === "/auth/user/login" || api === "/auth/user/signup" || api === "/auth/driver/signup" || api === "/auth/driver/login/email") {
        const refToken = result.refresh_token;
        const accToken = result.access_token;

        await AsyncStorage.setItem("access_token", accToken);
        await AsyncStorage.setItem("refresh_token", refToken);
      }

      setResponse(result);
  
      return result
    } catch (err) {
      setError(err); 
      console.log("post:", err); 




      return err.message 
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, postData };
};

export default usePost;
