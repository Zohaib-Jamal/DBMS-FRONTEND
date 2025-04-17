import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import useGet from "../../../hook/useGet";

const index = () => {
  const { getData } = useGet();

  useEffect(() => {
    const fn = async () => {
      const res = await getData("/company");
      console.log(res)
    };

    fn();
  }, []);

  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
