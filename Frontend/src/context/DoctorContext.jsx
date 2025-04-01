import React, { createContext, useState } from "react";

// Create the context
export const DoctorContext = createContext();

// Create the provider component
export const DoctorProvider = ({ children }) => {
  const [doctorDetails, setDoctorDetails] = useState({
    doctorId: null,
    doctorName: null,
  });

  return (
    <DoctorContext.Provider value={{ doctorDetails, setDoctorDetails }}>
      {children}
    </DoctorContext.Provider>
  );
};