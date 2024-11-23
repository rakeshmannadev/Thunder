import { Route, Routes } from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import AuthCallbackPage from "./Pages/Auth/AuthCallbackPage";
import HomePage from "./Pages/Home/HomePage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./Layout/MainLayout";
import RoomPage from "./Pages/Room/RoomPage";
import AlbumPage from "./Pages/Album/AlbumPage";
import PlaylistPage from "./Pages/Playlist/PlaylistPage";


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
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          

        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
