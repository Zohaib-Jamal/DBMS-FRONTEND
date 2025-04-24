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
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../../../components/CustomButton";
import useGet from "../../../../hook/useGet";
import usePost from "../../../../hook/usePost";
import Ionicons from "@expo/vector-icons/Ionicons";

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

const Divider = ({
  width = "90%",
  height = 1,
  color = "gray",
  marginVertical = 20,
}) => {
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: color,
        marginVertical: marginVertical,
      }}
    />
  );
};

const HomeScreen = () => {
  const bookBusScale = useRef(new Animated.Value(1)).current;
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureError, setDepartureError] = useState(false);
  const [destinationError, setDestinationError] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const { postData } = usePost();
  const scaleAnims = useRef([]).current;
  const { getData } = useGet();
  const fetchJournies = async () => {
    setJourneyLoading(true);
    const res = await getData("/bus/reservations");
    const data = res?.data || [];
   

    setJourneys(data);
    setJourneyLoading(false);
  };
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
    
    fetchJournies();
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

  const cancelSeat = async (seatID) => {
    setJourneyLoading(true)
    await postData({ seatID }, "/bus/cancel", "Delete");
    await  fetchJournies();
    setJourneyLoading(false)
  };

  return (
    <SafeAreaView style={styles.safeContainer} className="w-full">
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Icon name="map-marker" size={24} color="#FFBC07" />
              <Text
                style={styles.label}
                className="text-lg font-psemibold w-full"
              >
                Departure
              </Text>
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
              <Text
                style={styles.label}
                className="text-lg font-psemibold w-full"
              >
                Destination
              </Text>
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
          <View
            style={{
              backgroundColor: "#242A33",
              borderRadius: 10,
              shadowColor: "#000",
              elevation: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 6.5,
              elevation: 10,
            }}
            className="w-full p-5 h-52 mt-5"
          >
            <Text className="font-pbold text-lg text-white ">Your Seats:</Text>
            <ScrollView nestedScrollEnabled={true}>
              {!journeyLoading ? (
                journeys.length > 0 ? (
                  journeys
                    .sort((a, b) => new Date(b.RideDate) - new Date(a.RideDate))
                    .map((item, index) => {
                      if (
                        item.ArrivalLocation !== "null" &&
                        item.DepartureLocation !== "null" &&
                        item.RideDate !== "null"
                      ) {
                        return (
                          <RecentCard
                            key={index}
                            from={item.ArrivalLocation}
                            to={item.DepartureLocation}
                            date={new Date(item.StartTime).toLocaleDateString()}
                            seat={item.SeatNumber}
                            fare={item.Fare}
                            cancelSeat={()=>{cancelSeat(item.SeatID)}}
                          />
                        );
                      } else {
                        return null;
                      }
                    })
                ) : (
                  <Text className="text-white font-plight text-sm text-center mt-10">
                    Book a seat now to see it here!
                  </Text>
                )
              ) : (
                <View className="flex-1 justify-center items-center ">
                  <ActivityIndicator color="#FFBC07" size="large" />
                </View>
              )}
            </ScrollView>
          </View>

          <View
            style={styles.companiesTitleContainer}
            className="w-full flex-row justify-start items-center  pt-5"
          >
            <Icon
              name="bus"
              size={24}
              color="#FFBC07"
              //style={styles.companiesTitleIcon}
            />
            <Text style={styles.label} className="text-2xl font-psemibold ">
              Suggested Companies
            </Text>
          </View>

          {companies.map((item, index) => (
            <RenderCompany
              key={index}
              index={index}
              item={item}
              handleCompanyPress={handleCompanyPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const RecentCard = ({ from, to, date, seat, fare,cancelSeat }) => {
  return (
    <View className="flex flex-col">
      <Divider color="white" width="100%" />
      <View className="flex-row justify-between items-center mt-2">
        <Text className="font-psemibold text-sm text-white ">From: {from}</Text>
        <Text className="font-psemibold text-sm text-white ">Fare: {fare}</Text>
      </View>
      <View className="flex-row justify-between items-center mt-2">
        <Text className="font-psemibold text-sm text-white">To: {to}</Text>
        <Text className="font-psemibold text-sm text-white">Seat: {seat}</Text>
      </View>
      <View className="flex-row justify-between items-center mt-2">
        <Text className="font-plight text-xs text-white mt-2">
          Dated: {date}
        </Text>
        <TouchableOpacity onPress={cancelSeat}>
          <Ionicons name="trash-bin-sharp" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
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

const RenderCompany = ({ item, index, handleCompanyPress }) => {
  const iconName =
    busIcons[index] || busIcons[Math.floor(Math.random() * busIcons.length)];
  return (
    <TouchableOpacity
      onPress={() => handleCompanyPress(item)}
      style={styles.companyCard}
    >
      <View style={[styles.cardContent]}>
        <View style={styles.iconContainer}>
          {/* <Icon name={iconName} size={28} color="#000" />*/}
          <Image
            source={{
              uri: item.Image ? item.Image : "",
            }}
            className="w-12 h-12 rounded-full"
            resizeMethod="contain"
          />
        </View>
        <Text style={styles.companyText}>{item.Name}</Text>
      </View>
    </TouchableOpacity>
  );
};
