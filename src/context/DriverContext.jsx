import { createContext, useContext, useState } from "react";

const DriverContext = createContext();
export const useDriver = () => useContext(DriverContext);

export const DriverProvider = ({ children }) => {
  const [driverData, setDriverData] = useState(null);

  return (
    <DriverContext.Provider value={{ driverData, setDriverData }}>
      {children}
    </DriverContext.Provider>
  );
};
