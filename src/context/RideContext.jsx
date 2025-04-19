import { createContext, useContext, useState ,useRef} from "react";


const RideContext = createContext()
export const useRide = () => useContext(RideContext)

export const RideProvider = ({children}) => {

   const socket = useRef(null);
    const [rideData, setRideData] = useState(null);
    
    return(
        <RideContext.Provider value={{rideData, setRideData,socket}}>
            {children}
        </RideContext.Provider>
    )
   
}

