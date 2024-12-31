import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./Pages/Home/HomePage";
import MainLayout from "./Layout/MainLayout";
import RoomPage from "./Pages/Room/RoomPage";
import AlbumPage from "./Pages/Album/AlbumPage";
import PlaylistPage from "./Pages/Playlist/PlaylistPage";
import { useEffect } from "react";
import useUserStore from "./store/useUserStore";
import useSocketStore from "./store/useSocketStore";
import AuthPage from "./Pages/Auth/AuthPage";
import { Loader } from "lucide-react";
import ArtistPage from "@/Pages/Artist/ArtistPage.tsx";
import SinglePage from "./Pages/Single/SinglePage";
import usePlayerStore from "./store/usePlayerStore";

function App() {
  const { currentUser, getCurrentUser, isLoading } = useUserStore();
  const { connectSocket, disconnectSocket } = useSocketStore();
const {currentSong} = usePlayerStore();
  useEffect(() => {
    if (!currentUser) {
      getCurrentUser();
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
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
  }, [currentUser, disconnectSocket, connectSocket]);


  useEffect(()=>{
    if(currentSong){
      document.title=`${currentSong.title} | Thunder`
    }
  },[currentSong])

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Loader className="animate-spin text-emerald-500 size-8" />
      </div>
    );
  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={!currentUser ? <AuthPage /> : <Navigate to={"/"} />}
        />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/artist/:id" element={<ArtistPage/>} />
          <Route path="/song/:id" element={<SinglePage/>} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
