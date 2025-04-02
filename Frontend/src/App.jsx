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
import { DoctorProvider } from "./context/DoctorContext"; // Import DoctorProvider
import ChatPage from "./pages/ChatPage"; // Import Chat component
import { LanguageProvider } from "./context/LanguageContext";
import UserContext from "./context/UserContext";
import MessageProvider from "./context/MessageContext";

const App = () => {
  return (
    <LanguageProvider>
      <MessageProvider>
        <UserContext>
          <DoctorProvider>
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
                      <ChatPage />
                    </UserProtectWrapper>
                  }
                />
                <Route path="/chat/:roomId" element={<ChatPage />} />
                <Route path="/result" element={<Result />} />
              </Routes>
            </div>
          </DoctorProvider>
        </UserContext>
      </MessageProvider>
    </LanguageProvider>
  );
};

export default App;
