import { createContext, useContext, useState } from "react";

const BookingContext = createContext();
export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingId, setBookingId] = useState(null);

  // 🔹 NEW: store the saved Booking Request payload
  const [bookingRequestData, setBookingRequestData] = useState(null);

  return (
    <BookingContext.Provider
      value={{
        bookingId,
        setBookingId,
        bookingRequestData,
        setBookingRequestData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
