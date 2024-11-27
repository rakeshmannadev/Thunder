import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { useUser } from "@clerk/clerk-react";
import {
  Heart,
  ListMusic,
  ListPlus,
  Loader2,
  Mic2,
  Pause,
  Play,
  Plus,
  PlusCircle,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import TooltipComponent from "@/components/Tooltip/TooltipComponent";
import useMusicStore from "@/store/useMusicStore";
import useSocketStore from "@/store/useSocketStore";
import useRoomStore from "@/store/useRoomStore";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const {
    currentSong,
    isPlaying,
    playNext,
    playPrevious,
    playAlbum,
    togglePlay,
    isShuffle,
    isRepeat,
  } = usePlayerStore();
  const { featured, trending } = useMusicStore();

  const { addToFavorite, playlists, addSongToPlaylist, currentUser } =
    useUserStore();
  const {
    isBroadcasting,
    isPlayingSong,
    playSong,
    pauseSong,
    roomId,
    isLoading,
  } = useSocketStore();
  const { currentRoom } = useRoomStore();
  const { user } = useUser();

  const [volume, setVolume] = useState(20);
  const [isMute, setMute] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlistName, setPlaylistName] = useState("");
  const [artist, setArtist] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      if (isRepeat && currentSong) {
        setCurrentTime(0);
        usePlayerStore.setState({ isPlaying: true });
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      } else {
        usePlayerStore.setState({ isPlaying: false });
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, isRepeat]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const handleShuffle = () => {
    if (isShuffle) return usePlayerStore.setState({ isShuffle: false });

    const songs = [...featured, ...trending];
    const album = {
      _id: "34234",
      albumId: "42342",
      title: "Shuffle album",
      imageUrl: "shuffle",
      artist: "various",
      releaseYear: "null",
      songs: songs,
    };
    const randomIndex = Math.floor(Math.random() * songs.length);
    useMusicStore.setState({ currentAlbum: album });
    const updatedAlbum = useMusicStore.getState().currentAlbum;

    if (!updatedAlbum) return;

    playAlbum(updatedAlbum?.songs, randomIndex);
    usePlayerStore.setState({ isShuffle: true });
  };

  const handleRepeat = () => {
    if (isRepeat) return usePlayerStore.setState({ isRepeat: false });

    usePlayerStore.setState({ isRepeat: true });
  };

  let isAlreadyFavorite;
  const favoriteSongs = playlists.find(
    (playlist) => playlist.playListName === "Favorites"
  );

  if (favoriteSongs && currentSong) {
    isAlreadyFavorite = favoriteSongs.songs.includes(currentSong._id);
  }

  const handleAddToFavorite = () => {
    if (currentSong) {
      const currUserName = user?.firstName || "You";

      addToFavorite(
        currUserName,
        currentSong.imageUrl,
        currentSong._id,
        "Favorites"
      );
    }
  };

  const handleAddToPlaylist = (playlistId = null) => {
    if (!currentSong) return toast.error("Play a song first");

    addSongToPlaylist(
      playlistId,
      currentSong._id,
      playlistName,
      artist,
      currentSong.imageUrl
    );
    closeModal();
  };

  //Set the volume to the last saved volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTogglePlay = () => {
    if (currentUser && isBroadcasting) {
      if (isPlayingSong) {
        pauseSong(currentUser._id, roomId, currentSong._id);
      } else {
        playSong(currentUser._id, roomId, currentSong._id);
      }
    } else {
      togglePlay();
    }
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* currently playing song */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/album/${currentSong.albumId}`}
                  className="font-medium truncate hover:underline cursor-pointer"
                >
                  {currentSong.title}
                </Link>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls*/}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <TooltipComponent text={isShuffle ? "Suffle on" : "Shuffle off"}>
              <Button
                onClick={handleShuffle}
                disabled={
                  isBroadcasting && currentRoom?.admin !== currentUser?._id
                }
                size="icon"
                variant="ghost"
                className="inline-flex hover:text-white text-zinc-400"
              >
                <Shuffle className={`size-4 ${isShuffle && "text-white"}`} />
              </Button>
            </TooltipComponent>
            <TooltipComponent text="Previous song">
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-white text-zinc-400"
                onClick={playPrevious}
                disabled={
                  !currentSong ||
                  (isBroadcasting && currentRoom?.admin !== currentUser?._id)
                }
              >
                <SkipBack className="h-4 w-4" />
              </Button>
            </TooltipComponent>
            <TooltipComponent text={isPlaying ? "Pause song" : "Play song"}>
              <Button
                size="icon"
                className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8"
                onClick={handleTogglePlay}
                disabled={
                  !currentSong ||
                  (isBroadcasting && currentRoom?.admin !== currentUser?._id)
                }
              >
                {isLoading && <Loader2 className="size-5 animate-spin" />}
                {isPlaying && !isLoading ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  !isLoading && <Play className="h-5 w-5" />
                )}
              </Button>
            </TooltipComponent>
            <TooltipComponent text="Next song">
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-white text-zinc-400"
                onClick={playNext}
                disabled={
                  !currentSong ||
                  (isBroadcasting && currentRoom?.admin !== currentUser?._id)
                }
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </TooltipComponent>
            <TooltipComponent text={isRepeat ? "Repeat on" : "Repeat off"}>
              <Button
                onClick={handleRepeat}
                disabled={
                  isBroadcasting && currentRoom?.admin !== currentUser?._id
                }
                size="icon"
                variant="ghost"
                className="inline-flex hover:text-white text-zinc-400"
              >
                {isRepeat ? (
                  <Repeat1 className="h-4 w-4 text-white" />
                ) : (
                  <Repeat className="size-4" />
                )}
              </Button>
            </TooltipComponent>
          </div>

          <div className="flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-pointer active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>
        {/* volume controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          {user && (
            <TooltipComponent
              text={
                isAlreadyFavorite ? "Added to favorites" : "Add to favorite"
              }
            >
              <Button
                onClick={handleAddToFavorite}
                size="icon"
                variant="ghost"
                className="hover:text-white text-zinc-400"
              >
                <Heart
                  className="h-4 w-4"
                  fill={isAlreadyFavorite ? "green" : "#18181b"}
                  color={isAlreadyFavorite ? "green" : "#a1a1aa"}
                />
              </Button>
            </TooltipComponent>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
          >
            <Mic2 className="h-4 w-4" />
          </Button>
          <TooltipComponent text="Current queue">
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
            >
              <ListMusic className="h-4 w-4" />
            </Button>
          </TooltipComponent>

          <Dialog open={isOpen} onOpenChange={closeModal}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user && (
                  <Button
                    title="Add to playlist"
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                    className="hover:text-white text-zinc-400"
                  >
                    <ListPlus className="h-4 w-4" />
                  </Button>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={openModal}>
                  <PlusCircle /> Create playlist
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Plus />
                    <span>Add to playlist</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {playlists &&
                        playlists.map((playlist) => (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            key={playlist._id}
                            onClick={() => handleAddToPlaylist(playlist._id)}
                          >
                            {playlist.playListName}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent
              className="sm:max-w-[425px]"
              onEscapeKeyDown={closeModal}
            >
              <DialogHeader>
                <DialogTitle>Create Playlist</DialogTitle>
                <DialogDescription>
                  Playlist will appeare on leftside
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    onChange={(e) => setPlaylistName(e.target.value)}
                    id="name"
                    placeholder="Party songs"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="username" className="text-right">
                    Artist name
                  </label>
                  <Input
                    onChange={(e) => setArtist(e.target.value)}
                    id="username"
                    placeholder="Arijit"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => handleAddToPlaylist(null)}>
                  Create playlist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2">
            <TooltipComponent text={`Volume:${volume}`}>
              <Button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.volume = isMute ? volume / 100 : 0;
                    setMute(!isMute);
                  }
                }}
                size="icon"
                variant="ghost"
                className="hover:text-white text-zinc-400"
              >
                {isMute ? (
                  <VolumeX className="size-4" />
                ) : volume <= 20 ? (
                  <Volume className="h-4 w-4" />
                ) : volume > 20 && volume <= 50 ? (
                  <Volume1 className="size-4" />
                ) : (
                  volume > 50 && <Volume2 className="size-4" />
                )}
              </Button>
            </TooltipComponent>
            <Slider
              value={[volume]}
              onWheel={(event) => {
                const delta = event.deltaY; // Detect scroll direction
                setVolume((prevVolume) => {
                  // Adjust the volume and clamp between 0 and 100
                  const newVolume = Math.min(
                    100,
                    Math.max(0, prevVolume - delta / 20)
                  );
                  if (audioRef.current) {
                    audioRef.current.volume = newVolume / 100; // Update audio volume
                  }
                  return newVolume;
                });
              }}
              max={100}
              step={1}
              className="w-24 hover:cursor-pointer active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
