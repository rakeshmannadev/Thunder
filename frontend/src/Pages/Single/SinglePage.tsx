import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DownloadCloud,
  EllipsisVertical,
  Heart,
  Library,
  ListPlus,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import { formatDuration } from "../Album/AlbumPage";
import usePlayerStore from "@/store/usePlayerStore";
import useMusicStore from "@/store/useMusicStore";
import useUserStore from "@/store/useUserStore";
import useSocketStore from "@/store/useSocketStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useParams } from "react-router-dom";
import TooltipComponent from "@/components/Tooltip/TooltipComponent";
import { SelectSeparator } from "@/components/ui/select";
import AlbumGrid from "../Home/components/AlbumGrid";
import { useEffect } from "react";
import SectionGrid from "../Home/components/SectionGrid";
import Artists from "./Artists";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";

const SinglePage = () => {
  const { isPlaying, currentSong, togglePlay, playAlbum } = usePlayerStore();
  const { currentAlbum, isLoading, currentArtist, single, fetchSingle } =
    useMusicStore();
  const { addToFavorite, currentUser, playlists,addSongToPlaylist } = useUserStore();
  const { isPlayingSong, isBroadcasting, pauseSong, playSong, roomId } =
    useSocketStore();

  const { id } = useParams();

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song.songId === currentSong?.songId
    );
    if (currentUser && isBroadcasting) {
      if (isPlayingSong && isCurrentAlbumPlaying && currentSong) {
        pauseSong(currentUser._id, roomId, currentSong._id);
      } else {
        playSong(currentUser._id, roomId, currentSong!._id, null);
      }
    } else if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      // start playing the album from the beginning
      const currentSongIdx = currentAlbum.songs.findIndex(
        (song) => song.songId === id
      );
      playAlbum(currentAlbum?.songs, currentSongIdx);
    }
  };
  const handleAddToFavorite = () => {
    if (single) {
      addToFavorite(
        currentSong!.artists.primary,
        single.imageUrl,
        currentSong!._id,
        "Favorites"
      );
    }
  };

  const handleAddToPlaylist = (playlistId:string,playlistName:string) => {
    if (!currentSong) return toast.error("Play a song first");

    addSongToPlaylist(
      playlistId,
      currentSong._id,
      playlistName,
     currentSong.artists.primary,
      currentSong.imageUrl
    );
  };

  useEffect(() => {
    if (id) {
      fetchSingle(id);
    }
  }, [id]);

  let isAlreadyFavorite;
  const favoriteSongs = playlists.find(
    (playlist) => playlist.playlistName === "Favorites"
  );

  if (favoriteSongs && currentSong) {
    isAlreadyFavorite = favoriteSongs.songs.includes(currentSong._id);
  }
  // console.log(currentSong);
  // console.log("single", single);
  // console.log(favoriteSongs)

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
                  src={single?.imageUrl}
                  alt=""
                  className="w-[240px] h-[240px] shadow-xl rounded"
                />
              )}
              {isLoading && (
                <Skeleton className="h-[240px] w-[240px] rounded" />
              )}
              <div className="flex flex-col  justify-end">
                {!isLoading && single && (
                  <h1 className="text-2xl md:text-5xl font-bold my-4">
                    {single.title}
                  </h1>
                )}
                {isLoading && <Skeleton className="h-10 w-[250px]" />}
                {!isLoading && single && (
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    {single.artists.primary.map((artist) => (
                      <span key={artist.id}>{artist.name} ● </span>
                    ))}

                    <span>
                      {single?.releaseYear} ● {currentAlbum?.title}
                    </span>
                  </div>
                )}
                {isLoading && <Skeleton className="h-4 w-[250px] mt-5" />}
                {!isLoading && single && (
                  <div className="flex flex-col gap-2 items-start justify-center mt-2 text-sm text-zinc-100">
                    <span>
                      Song ● {single?.playCount} Plays ●{" "}
                      {formatDuration(single.duration)} ●{" "}
                      {single?.language?.charAt(0).toUpperCase() +
                        single?.language?.slice(1)}
                    </span>
                    <span>{single?.label}</span>
                  </div>
                )}
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
                single &&
                !isLoading &&
                single.songId === currentSong?.songId ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
              {/* Add to playlist button */}
              {isAlreadyFavorite ? (
                <TooltipComponent text="Added to favorites">
                  <Heart
                    className="size-7 cursor-pointer"
                    fill="green"
                    color="green"
                  />
                </TooltipComponent>
              ) : (
                <TooltipComponent text="Add to favorites">
                  <Heart
                    onClick={handleAddToFavorite}
                    className="size-7 cursor-pointer"
                  />
                </TooltipComponent>
              )}

              <TooltipComponent text="Download">
                <DownloadCloud className="rounded-full size-10 p-2 hover:bg-gray-600 cursor-pointer " />
              </TooltipComponent>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisVertical className="rounded-full size-10 p-2 hover:bg-gray-600 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:cursor-pointer">
                      <Link
                        to={`/album/${single?.albumId}`}
                        className="flex gap-2"
                      >
                        <Library className=" w-4" />
                        Go to album
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="hover:cursor-pointer">
                        <ListPlus />
                        <span>Add to playlist</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {playlists &&
                            playlists.map((playlist) => (
                              <DropdownMenuItem
                                className="cursor-pointer"
                                key={playlist._id}
                                onClick={() =>
                                  handleAddToPlaylist(playlist._id,'')
                                }
                              >
                                {playlist.playlistName}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="hover:cursor-pointer">
                      <Share2 />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <SelectSeparator />

            <div className="space-y-8 p-5">
              {currentAlbum && (
                <SectionGrid
                  title={`More from ${currentAlbum?.title}`}
                  songs={currentAlbum?.songs || []}
                  isLoading={isLoading}
                />
              )}
              <AlbumGrid
                title="Albums by artist"
                songs={currentArtist?.albums || []}
                isLoading={isLoading}
              />
              <h2 className="text-xl sm:text-2xl font-bold">Artists</h2>
              {/* Swiper for artists */}
              <div className="flex">
                <ScrollArea type="always" className="w-1 flex-1">
                  <div className="flex gap-2 pb-4">
                    {single &&
                      single.artists.all.map((artist, idx) => (
                        <Artists key={idx} artist={artist} />
                      ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="w-full" />
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SinglePage;
