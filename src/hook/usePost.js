import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePost = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = async (data, api, method="POST") => {
    if (!data || !api) return;

    setLoading(true);
    try {
      const str = `http://192.168.1.4:3000${api}`;

      const accToken = await AsyncStorage.getItem('access_token')

      const options = {
        method: method,
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${accToken ? accToken : ''}`
        },

        body: JSON.stringify(data),
      };



      console.log("Sending data:", data);

      const res = await fetch(str, options);
      if(res.status >299){
        throw new Error(res.body.message)
      }


      const result = await res.json();

      if(res.status === 403){
        const refToken = await AsyncStorage.getItem('refresh_token')

        const res = await fetch("http://192.168.1.4:3000/refresh_token", 
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
    
            body: JSON.stringify(refToken),
          }

        );

        if(res.status === 403){
          throw new Error("Una")
        }
        const accToken = res.body.access_token
        await AsyncStorage.setItem('access_token', accToken);
      }

      if(api === '/user/login' || api === '/driver/signup'){

          const refToken = result.data.refresh_token
          const accToken = result.data.access_token
          
          await AsyncStorage.setItem('access_token', accToken);
          await AsyncStorage.setItem('refresh_token', refToken);


      }
    
      

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
