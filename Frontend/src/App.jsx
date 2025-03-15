import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorSignup from "./pages/DoctorSignup";
import Home from "./pages/Home";
import Result from "./pages/Result";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import DoctorHome from "./pages/DoctorHome";
import Chat from "./pages/Chat"; // Import Chat component
import { LanguageProvider } from "./context/LanguageContext";

const App = () => {
  return (
    <LanguageProvider>
      <div className="">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-signup" element={<DoctorSignup />} />
          <Route
            path="/home"
            element={
              <UserProtectWrapper>
                <Home />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/users/logout"
            element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/results"
            element={
              <UserProtectWrapper>
                <Result />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/doctor-home"
            element={
              <UserProtectWrapper>
                <DoctorHome />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/chat/:roomId"
            element={
              <UserProtectWrapper>
                <Chat />
              </UserProtectWrapper>
            }
          />
        </Routes>
      </div>
    </LanguageProvider>
  );
};

export default App;