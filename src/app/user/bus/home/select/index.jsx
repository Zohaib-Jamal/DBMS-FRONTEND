import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import useGet from "../../../../../hook/useGet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
const SelectBus = () => {
  const { departure, destination, company, cid } = useLocalSearchParams();
  const { getData, loading } = useGet();
  const [busses, setBusses] = useState([]);
  const [error, setError] = useState(null);
  const scaleAnims = useRef({}).current;

  useEffect(() => {
    const fetchBusses = async () => {
      try {
        let url = "";
        console.log("co", company)
        if (company && cid) {
          url = `/company/bus?departure=${departure}&arrival=${destination}&cid=${cid}`;
        } else {
          url = `/company/location?departure=${departure}&arrival=${destination}`;
        }

        const res = await getData(url);
        console.log("Fetched busses:", res.data);

        if (res?.data) {
         // console.log(res.data)
          const mappedBusses = res.data.map((bus, index) => ({
            ...bus,
            id: bus.id || index.toString(),
            CompanyName: bus.CompanyName || bus.Name || "Unknown",
          }));
          console.log("Mapped busses:", mappedBusses);
          setBusses(mappedBusses);

          mappedBusses.forEach((bus) => {
            scaleAnims[bus.id] = new Animated.Value(1);
          });
        } else {
          setError(res?.message || "No available buses");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBusses();
  }, [departure, destination, company, cid]);

  const formatDateTime = (timestamp) => {
    if (!timestamp) return { date: "N/A", time: "N/A" };
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj.getTime())) return { date: "Invalid", time: "Invalid" };

    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleBusPressIn = (busId) => {
    Animated.spring(scaleAnims[busId], {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handleBusPressOut = (busId) => {
    Animated.spring(scaleAnims[busId], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleBusPress = (bus) => {
    Animated.spring(scaleAnims[bus.id], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    router.push({
      pathname: "/user/bus/home/select/book",
      params: {
        departure: bus.DepartureLocation,
        destination: bus.ArrivalLocation,
        fare: bus.Fare,
        startTime: bus.StartTime,
        company: bus.CompanyName,
        JourneyID: bus.JourneyID,
      },
    });
  };

  const renderBus = ({ item }) => {
    const { date, time } = formatDateTime(item.StartTime);
    console.log("Rendering bus with CompanyName:", item.CompanyName);

    return (
      <TouchableOpacity
        style={styles.busCard}
        onPress={() => handleBusPress(item)}
        onPressIn={() => handleBusPressIn(item.id)}
        onPressOut={() => handleBusPressOut(item.id)}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.cardGradient,
            { transform: [{ scale: scaleAnims[item.id] }] },
          ]}
        >
          <LinearGradient
            colors={["#FFFFFF", "#E8E8E8"]}
            style={styles.cardInner}
          >
            <View style={styles.cardHeader}>
              <View className="flex-row justify-center items-center">
                <Text style={styles.routeText}>{item.DepartureLocation}</Text>
                <View className="flex-row justify-center items-center mx-2">
                  <FontAwesome
                    name="long-arrow-right"
                    size={24}
                    color="#FFBC07"
                  />
                </View>
                <Text style={styles.routeText}>{item.ArrivalLocation}</Text>
              </View>
              {!company && (
                <Text style={styles.companyText}>{item.CompanyName}</Text>
              )}
            </View>
            <View style={styles.divider} />
            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time:</Text>
                <Text style={styles.detailValue}>{time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fare:</Text>
                <Text style={styles.detailValue}>Rs {item.Fare}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                item.STATUS === "Available"
                  ? styles.statusAvailable
                  : styles.statusUnavailable,
              ]}
            >
              <Text style={styles.statusText}>{item.STATUS}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  //backgroundColor: "#2D343C",
  return (
    <LinearGradient colors={["#2D343C", "#2A3439"]} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>
          {company ? `${company} Rides` : `Available Buses`}
        </Text>
        <View style={styles.routeContainer}>
          <View style={styles.routeBox}>
            <Text style={styles.routeBoxText}>{departure}</Text>
          </View>
          <View className="flex-row justify-center items-center mx-2">
            <FontAwesome name="long-arrow-right" size={24} color="#FFBC07" />
          </View>
          <View style={styles.routeBox}>
            <Text style={styles.routeBoxText}>{destination}</Text>
          </View>
        </View>
      </View>
      {loading ? (
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#FFBC07" />
          <Text style={styles.loaderText}>Loading buses...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : busses.length === 0 ? (
        <View style={styles.errorCard}>
          <Text style={styles.error}>No buses found.</Text>
        </View>
      ) : (
        <FlatList
          data={busses}
          keyExtractor={(item) => item.id}
          renderItem={renderBus}
          contentContainerStyle={styles.listContent}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    //backgroundColor: "#2D343C",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFBC07",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  routeBox: {
    backgroundColor: "#FFBC07",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  routeBoxText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C2526",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFBC07",
    marginHorizontal: 5,
  },
  loaderCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFBC07",
    borderStyle: "dashed",
    elevation: 4,
  },
  loaderText: {
    color: "#FFBC07",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
  errorCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FF0000",
    borderStyle: "dashed",
    alignItems: "center",
    elevation: 4,
  },
  error: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  busCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    overflow: "hidden",
  },
  cardGradient: {
    borderRadius: 15,
  },
  cardInner: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    borderStyle: "dashed",
  },
  cardHeader: {
    marginBottom: 8,
  },
  routeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFBC07",
    marginBottom: 8,
    textAlign: "center",
  },
  companyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2526",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#FFBC07",
    marginVertical: 10,
    opacity: 0.5,
  },
  cardDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    width: 80,
    textAlign: "right",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C2526",
    flex: 1,
    marginLeft: 10,
  },
  statusBadge: {
    alignSelf: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: "#FFBC07",
  },
  statusUnavailable: {
    backgroundColor: "#FF0000",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
});

export default SelectBus;
