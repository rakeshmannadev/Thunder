import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthCallbackPage from "./Pages/Auth/AuthCallbackPage";
import HomePage from "./Pages/Home/HomePage";
import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/clerk-react";
import MainLayout from "./Layout/MainLayout";
import RoomPage from "./Pages/Room/RoomPage";
import AlbumPage from "./Pages/Album/AlbumPage";
import PlaylistPage from "./Pages/Playlist/PlaylistPage";
import { useEffect } from "react";
import useUserStore from "./store/useUserStore";
import useSocketStore from "./store/useSocketStore";

function App() {
  const { userId } = useAuth();
  const { currentUser } = useUserStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    if (userId && currentUser) {
      connectSocket(currentUser._id);
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      disconnectSocket();
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, currentUser, disconnectSocket, connectSocket]);
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
