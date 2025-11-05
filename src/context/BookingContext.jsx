import { createContext, useContext, useState } from "react";

const BookingContext = createContext();
export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingId, setBookingId] = useState(null);
  return (
    <BookingContext.Provider value={{ bookingId, setBookingId }}>
      {children}
    </BookingContext.Provider>
  );
};
