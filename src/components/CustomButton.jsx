import {
    View,
    Text,
    TouchableOpacity,
    GestureResponderEvent,
    ActivityIndicator,
  } from "react-native";
  
  const CustomButton = ({
    title,
    handlePress,
    containerStyles,
    isLoading,
    textStyles,
  }) => {
    return (
      <TouchableOpacity
        className={`bg-secondary rounded-xl min-h-[62px] w-full justify-center items-center ${containerStyles} ${
          isLoading ? "opacity-50" : ""
        }`}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
        style={{backgroundColor:"#FFBC07"}}
      >
        {!isLoading ? (
          <Text className={`text-white font-psemibold text-lg ${textStyles}`} style={{fontSize:25, fontWeight:"bold"}}>
            {title}
          </Text>
        ) : (
          <ActivityIndicator size="large" color="#161622" />
        )}
      </TouchableOpacity>
    );
  };
  
  export default CustomButton;