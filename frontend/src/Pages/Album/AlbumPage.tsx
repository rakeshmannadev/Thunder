import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";

import {
  CircleCheckBig,
  Clock,
  Pause,
  Play,
  PlusCircle,
  Shuffle,
} from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const AlbumPage = () => {
  const { id } = useParams();
  const { isPlaying, currentSong, togglePlay, playAlbum, isShuffle } =
    usePlayerStore();
  const { currentAlbum, fetchAlbumById, isLoading } = useMusicStore();
  const { addAlbumToPlaylist, playlists, currentUser } = useUserStore();
  const { isPlayingSong, isBroadcasting, pauseSong, playSong, roomId } =
    useSocketStore();

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (currentUser && isBroadcasting) {
      if (isPlayingSong && isCurrentAlbumPlaying) {
        pauseSong(currentUser._id, roomId, currentSong!._id);
      } else {
        playSong(currentUser._id, roomId, currentSong!._id, null);
      }
    } else if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      // start playing the album from the beginning
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;

    playAlbum(currentAlbum?.songs, index);
  };

  const handleShuffleAlbum = () => {
    if (!currentAlbum) return;
    if (isShuffle) return usePlayerStore.setState({ isShuffle: false });

    usePlayerStore.setState({ isShuffle: true });
    const randomIndex = Math.floor(Math.random() * currentAlbum.songs.length);
    playAlbum(currentAlbum?.songs, randomIndex);
  };

  useEffect(() => {
    if (id) {
      useMusicStore.setState({ currentAlbum: null });
      fetchAlbumById(id);
    }
  }, [id, fetchAlbumById]);

  const isAddedToPlaylist = playlists.find(
    (playlist) => playlist.albumId === currentAlbum?.albumId
  );

  const handleAddAlbumToPlaylist = () => {
    if (currentAlbum) {
      const songs: string[] = [];
      currentAlbum.songs.map((song) => {
        songs.push(song._id);
      });
      addAlbumToPlaylist(
        null,
        currentAlbum.title,
        currentAlbum.artists.primary[0].name,
        currentAlbum.albumId,
        currentAlbum.imageUrl,
        songs
      );
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-screen">
          {/* gradiant background */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            area-hidden="true"
          />
          {/* content */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row  p-6 gap-6 pb-8">
              {!isLoading && (
                <img
                  src={currentAlbum?.imageUrl}
                  alt=""
                  className="w-[240px] h-[240px] shadow-xl rounded"
                />
              )}
              {isLoading && (
                <Skeleton className="h-[240px] w-[240px] rounded" />
              )}
              <div className="flex flex-col  justify-end">
                <p className="text-sm font-medium">Album</p>
                {!isLoading && (
                  <h1 className="text-2xl md:text-7xl font-bold my-4">
                    {currentAlbum?.title}
                  </h1>
                )}
                {isLoading && <Skeleton className="h-10 w-[250px]" />}
                {!isLoading && (
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    <span>{currentAlbum?.artists.primary.map((artist)=>artist.name).join(", ")}</span>
                    <span>● {currentAlbum?.songs.length} Songs</span>
                    <span>● {currentAlbum?.releaseYear}</span>
                  </div>
                )}
                {isLoading && <Skeleton className="h-4 w-[250px] mt-5" />}
              </div>
            </div>
            {/* Play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
              {/* Add to playlist button */}
              {isAddedToPlaylist ? (
                <CircleCheckBig
                  className="size-7 cursor-pointer"
                  color="green"
                />
              ) : (
                <PlusCircle
                  onClick={handleAddAlbumToPlaylist}
                  className="size-7 cursor-pointer"
                />
              )}

              <Shuffle
                onClick={handleShuffleAlbum}
                className={`size-5 cursor-pointer ${
                  isShuffle && "text-green-500"
                } `}
              />
            </div>

            {/* Table section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* Song lists */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {!isLoading &&
                    currentAlbum?.songs.map((song, index) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div
                          key={song._id}
                          onClick={() => handlePlaySong(index)}
                          className={`grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                        >
                          <div className="flex items-center justify-center">
                            {isCurrentSong && isPlaying ? (
                              <div className="size-4 text-green-500">♫</div>
                            ) : (
                              <span className="group-hover:hidden">
                                {index + 1}
                              </span>
                            )}
                            {!isCurrentSong && (
                              <Play className="h-4 w-4 hidden group-hover:block" />
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <img
                              src={song.imageUrl}
                              alt={song.title}
                              className="size-10"
                            />

                            <div>
                              <div className={`font-medium text-white`}>
                                {song.title}
                              </div>
                              <div>{song.artists.primary.map((artist)=>artist.name).join(", ")}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {song.releaseDate}
                          </div>
                          <div className="flex items-center">
                            {formatDuration(song.duration)}
                          </div>
                          <div className="flex items-center"></div>
                        </div>
                      );
                    })}
                  {isLoading &&
                    Array.from({ length: 10 }).map((_, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 px-10 mt-5"
                        >
                          <div className="flex gap-2">
                            <Skeleton className="h-[55px] size-10 " />
                            <div className="space-y-2">
                              <Skeleton className="h-[15px] w-20  " />
                              <Skeleton className="h-[15px] w-12  " />
                            </div>
                          </div>
                          <div>
                            <Skeleton className="h-[15px] w-20  " />
                          </div>
                          <div>
                            <Skeleton className="h-[15px] w-12  " />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
