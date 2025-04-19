import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Animated,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../../../components/CustomButton";
import useGet from "../../../../hook/useGet";

const busIcons = [
  "bus",
  "bus-articulated-front",
  "bus-clock",
  "bus-double-decker",
  "bus-electric",
  "bus-marker",
  "bus-multiple",
  "bus-school",
  "bus-side",
  "bus-stop",
];

const HomeScreen = () => {
  const bookBusScale = useRef(new Animated.Value(1)).current;
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureError, setDepartureError] = useState(false);
  const [destinationError, setDestinationError] = useState(false);
  const [companies, setCompanies] = useState([]);
  const scaleAnims = useRef([]).current;
  const { getData } = useGet();

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await getData("/company");
      const data = res?.data || [];
      setCompanies(data);
      scaleAnims.splice(
        0,
        scaleAnims.length,
        ...data.map(() => new Animated.Value(1))
      );
    };
    fetchCompanies();
  }, []);

  const validateInputs = () => {
    const depMissing = departure.trim() === "";
    const desMissing = destination.trim() === "";
    setDepartureError(depMissing);
    setDestinationError(desMissing);
    return !depMissing && !desMissing;
  };

  const handleBookBusPress = () => {
    if (!validateInputs()) return;
    router.push({
      pathname: "/user/bus/home/select",
      params: { departure, destination },
    });
  };

  const handleCompanyPress = (company) => {
    if (!validateInputs()) return;
    router.push({
      pathname: "/user/bus/home/select",
      params: {
        departure,
        destination,
        cid: company.CompanyID,
        company: company.Name,
      },
    });
  };

  const handleInputChange = (setter, errorSetter) => (text) => {
    setter(text);
    if (text.trim() !== "") {
      errorSetter(false);
    }
  };

  const renderCompany = ({ item, index }) => {
    const iconName =
      busIcons[index] || busIcons[Math.floor(Math.random() * busIcons.length)];
    return (
      <TouchableOpacity
        onPress={() => handleCompanyPress(item)}
        onPressIn={() => handlePressIn(index)}
        onPressOut={() => handlePressOut(index)}
        style={styles.companyCard}
       
      >
        <Animated.View
          style={[
            styles.cardContent,
            { transform: [{ scale: scaleAnims[index] }] },
          ]}
        >
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={28} color="#000" />
          </View>
          <Text style={styles.companyText}>{item.Name}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handlePressIn = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeContainer}  className="w-full">
      <View style={styles.container}>
        {/** 
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="bus" size={36} color="#FFBC07" />
            <Text style={styles.welcomeText}>WELCOME TO </Text>
            <Text style={styles.busmateText}>BUSMATE</Text>
          </View>
        </View>
        */}

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Icon name="map-marker" size={24} color="#FFBC07" />
            <Text style={styles.label} className="text-lg font-psemibold w-full">Departure</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter departure"
            value={departure}
            onChangeText={handleInputChange(setDeparture, setDepartureError)}
            placeholderTextColor="#888"
          />
          {departureError && (
            <Text style={styles.errorText}>Please enter departure</Text>
          )}

          <View style={styles.inputRow}>
            <Icon name="flag" size={24} color="#FFBC07" />
            <Text style={styles.label} className="text-lg font-psemibold w-full">Destination</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={destination}
            onChangeText={handleInputChange(
              setDestination,
              setDestinationError
            )}
            placeholderTextColor="#888"
          />
          {destinationError && (
            <Text style={styles.errorText}>Please enter destination</Text>
          )}
        </View>

        <Animated.View style={{ transform: [{ scale: bookBusScale }] }}>
          <CustomButton
            title="Book Bus"
            handlePress={handleBookBusPress}
            containerStyles="w-full mt-4 bg-[#FFBC07]"
            textStyles="text-white text-xl font-bold"
            isLoading={false}
            onPressIn={() =>
              Animated.spring(bookBusScale, {
                toValue: 0.95,
                useNativeDriver: true,
              }).start()
            }
            onPressOut={() =>
              Animated.spring(bookBusScale, {
                toValue: 1,
                useNativeDriver: true,
              }).start()
            }
          />
        </Animated.View>

        <View style={styles.companiesTitleContainer} className="w-full flex-row justify-start items-center  pt-5">
          <Icon
            name="bus"
            size={24}
            color="#FFBC07"
            //style={styles.companiesTitleIcon}
          />
          <Text style={styles.label} className="text-2xl font-psemibold ">Suggested Companies</Text>
        </View>

        <FlatList
          data={companies}
          renderItem={renderCompany}
          keyExtractor={(item, index) => `${item.Name}-${index}`}
          contentContainerStyle={styles.scrollContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#2D343C",
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "400",
    color: "#FFF",
    marginLeft: 10,
  },
  busmateText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFBC07",
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: "#FFF",
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
    fontSize: 18,
    color: "#000",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 5,
  },
  companiesTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  companiesTitleIcon: {
    marginRight: 10,
  },
  companiesTitle: {
   // fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
  },
  scrollContent: {
    //paddingHorizontal: 20,
    paddingBottom: 20,
  },
  companyCard: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 15,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#FFBC07",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  companyText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
});

export default HomeScreen;
