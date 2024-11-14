import { Route, Routes } from "react-router-dom";
import AuthCallbackPage from "./Pages/Auth/AuthCallbackPage";
import HomePage from "./Pages/Home/HomePage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./Layout/MainLayout";
import RoomPage from "./Pages/Room/RoomPage";

function App() {
  return (
    <>
      <Routes>
        
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/room" element={<RoomPage />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
