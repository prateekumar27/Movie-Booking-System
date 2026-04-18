import { createContext, useContext, useState } from "react";

const SeatContext = createContext();

export const SeatContextProvider = ({ children }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [shows, setShows] = useState(null);
  return (
    <SeatContext.Provider value={{ selectedSeats, setSelectedSeats, shows, setShows }}>
      {children}
    </SeatContext.Provider>
  );
};

export const useSeatContext = () => useContext(SeatContext);
