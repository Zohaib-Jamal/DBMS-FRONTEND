import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useGet from "../../../../../../hook/useGet";
import usePost from "../../../../../../hook/usePost";
import { useUser } from "../../../../../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";

const Seats = () => {
  const { JourneyID, departure, destination, fare, startTime, company } =
    useLocalSearchParams();

  const router = useRouter();
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { getData, loading } = useGet();
  const { postData, loading: postLoading, error: postError } = usePost();
  const { userData } = useUser();

  useEffect(() => {
    console.log("j", JourneyID)
    if (JourneyID) fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const res = await getData("/bus/available?journeyID=" + JourneyID);
      console.log("Available seats response:", res); // Debug
      setAvailableSeats(res?.data || []);
    } catch (err) {
      console.error("Fetch seats error:", err.message); // Debug
      Alert.alert("Error", err?.message || "Failed to fetch seats");
    }
  };

  const toggleSeat = (seat) => {
    const normalizedSeat = Number(seat);
    console.log("toggleSeat called with seat:", normalizedSeat); // Debug
    setSelectedSeats((prev) => {
      const newSeats = prev.includes(normalizedSeat)
        ? prev.filter((s) => s !== normalizedSeat)
        : [...prev, normalizedSeat];
      console.log("Updated selectedSeats:", newSeats); // Debug
      return newSeats;
    });
  };

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

  const { date, time } = formatDateTime(startTime);

  const handleBookSeats = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("No Seats Selected", "Please select at least one seat.");
      return;
    }

    if (!userData?.UserID) {
      Alert.alert("Error", "User not authenticated. Please log in.");
      return;
    }

    try {
      for (const seat of selectedSeats) {
        const data = {
          journeyID: JourneyID,
          seatNumber: seat,
          userId: userData.userId,
        };
        console.log("Sending reservation for seat:", data); // Debug
        const result = await postData(data, "/bus/reserve");
        if (result instanceof Error || postError) {
          throw new Error(
            result?.message || postError?.message || "Failed to reserve seat"
          );
        }
      }
      Alert.alert("Success", "Seats Confirmed", [
        { text: "OK", onPress: () => router.replace("/user/bus/home") },
      ]);
      setSelectedSeats([]); // Clear selections
      await fetchSeats(); // Refresh seat availability
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to reserve seats");
    }
  };

  const availableSeatOptions = availableSeats.map((seat) => Number(seat.seat));
  console.log("Available seat numbers:", availableSeatOptions); // Debug
  console.log("Selected seats:", selectedSeats); // Debug

  // Generate all seats (1–20)
  const allSeats = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <LinearGradient colors={["#2D343C", "#2A3439"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text //style={styles.title}
        className="text-secondary text-2xl font-pbold text-center mb-5"
        >Booking Summary</Text>

        <View style={styles.card}>
          <Section title="Bus Company">
            <Info label="Name" value={company} />
          </Section>

          <Section title="Route Info">
            <Info label="From" value={departure} />
            <Info label="To" value={destination} />
          </Section>

          <Section title="Schedule">
            <Info label="Date" value={date} />
            <Info label="Time" value={time} />
          </Section>

          <Section title="Payment">
            <Info label="Fare" value={`Rs ${fare}`} />
          </Section>
        </View>

        <Text style={styles.seatTitle}>Seat Availability</Text>

        <View style={styles.grid}>
          {allSeats.map((seat) => {
            const isAvailable = availableSeatOptions.includes(seat);
            const isSelected = selectedSeats.includes(seat);
            console.log(
              "Seat:",
              seat,
              "Available:",
              isAvailable,
              "Selected:",
              isSelected
            ); // Debug
            return (
              <View
                key={seat}
                style={[
                  styles.seat,
                  isAvailable
                    ? isSelected
                      ? styles.selectedSeat
                      : styles.availableSeat
                    : styles.unavailableSeat,
                ]}
              >
                <Text style={styles.seatText}>{seat}</Text>
                <Text style={styles.statusText}>{isAvailable ? "A" : "U"}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            Select Seats{" "}
            {selectedSeats.length > 0 ? `(${selectedSeats.length})` : ""}
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Available Seats</Text>
              <ScrollView style={styles.modalScroll}>
                {availableSeatOptions.length > 0 ? (
                  availableSeatOptions.map((seat) => {
                    const isSelected = selectedSeats.includes(seat);
                    return (
                      <TouchableOpacity
                        key={seat}
                        style={[
                          styles.modalItem,
                          isSelected && styles.modalItemSelected,
                        ]}
                        onPress={() => toggleSeat(seat)}
                      >
                        <Text style={styles.modalItemText}>Seat {seat}</Text>
                        {isSelected && (
                          <Text style={styles.modalItemCheck}>✓</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={styles.modalEmptyText}>No seats available</Text>
                )}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {selectedSeats.length > 0 && (
          <TouchableOpacity style={styles.bookButton} onPress={handleBookSeats}>
            <Text style={styles.bookButtonText}>Book Seats</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const Info = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 15,
    paddingTop: 50,
  },
  title: {
    fontSize: 35,
    fontWeight: "800",
    color: "#FFCA28",
    marginBottom: 22,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2A3439",
    marginBottom: 5,
    borderBottomWidth: 5,
    borderBottomColor: "#eee",
    paddingBottom: 2,
  },
  sectionContent: {
    marginTop: 4,
  },
  infoRow: {
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1C2526",
    marginTop: 2,
  },
  seatTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFCA28",
    marginVertical: 18,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  seat: {
    width: 60,
    height: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: 5,
  },
  availableSeat: {
    backgroundColor: "#66BB6A",
  },
  unavailableSeat: {
    backgroundColor: "#ccc",
  },
  selectedSeat: {
    backgroundColor: "#FFCA28",
  },
  seatText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  dropdownButton: {
    backgroundColor: "#FFCA28",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 15,
  },
  dropdownButtonText: {
    color: "#1C2526",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C2526",
    marginBottom: 15,
    textAlign: "center",
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalItemSelected: {
    backgroundColor: "#FFCA28",
  },
  modalItemText: {
    fontSize: 16,
    color: "#1C2526",
  },
  modalItemCheck: {
    fontSize: 16,
    color: "#1C2526",
    fontWeight: "600",
  },
  modalEmptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    paddingVertical: 20,
  },
  modalCloseButton: {
    backgroundColor: "#FFCA28",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: "#1C2526",
    fontSize: 16,
    fontWeight: "600",
  },
  bookButton: {
    backgroundColor: "#FFCA28",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Seats;
