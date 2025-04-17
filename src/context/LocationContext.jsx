import { createContext, useContext, useState } from "react";

const LocationContext = createContext();
export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState(null);

  const [userlongitude, setUserLongitude] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState(null);
  const [destinationlongitude, setDestinationLongitude] = useState(null);

  const [userLocation, setUserLocation] = useState({
    address: null,
    longitude: null,
    latitude: null,
  });

  const [destinationLocation, setDestinationLocation] = useState({
    address: null,
    longitude: null,
    latitude: null,
  });

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        destinationLocation,
        setDestinationLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
