import React, { createContext, useState } from "react";

// Create the context
export const DoctorContext = createContext();

// Create the provider component
export const DoctorProvider = ({ children }) => {
  const [doctorDetails, setDoctorDetails] = useState({
    doctorId: '',
    doctorName: '',
  });

  return (
    <DoctorContext.Provider value={{ doctorDetails, setDoctorDetails }}>
      {children}
    </DoctorContext.Provider>
  );
};