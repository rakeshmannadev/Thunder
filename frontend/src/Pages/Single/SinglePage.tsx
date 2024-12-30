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
import { Link } from "react-router-dom";
import TooltipComponent from "@/components/Tooltip/TooltipComponent";
import { SelectSeparator } from "@/components/ui/select";
import AlbumGrid from "../Home/components/AlbumGrid";
import { useEffect } from "react";
import SectionGrid from "../Home/components/SectionGrid";
import Artists from "./Artists";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const SinglePage = () => {
  const { isPlaying, currentSong, togglePlay, playAlbum } = usePlayerStore();
  const {
    currentAlbum,
    isLoading,
    fetchAlbumById,
    fetchArtistById,
    currentArtist,
  } = useMusicStore();
  const { addToFavorite, currentUser } = useUserStore();
  const { isPlayingSong, isBroadcasting, pauseSong, playSong, roomId } =
    useSocketStore();

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (currentUser && isBroadcasting) {
      if (isPlayingSong && isCurrentAlbumPlaying) {
        pauseSong(currentUser._id, roomId, currentSong._id);
      } else {
        playSong(currentUser._id, roomId, currentSong._id, null);
      }
    } else if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      // start playing the album from the beginning
      playAlbum(currentAlbum?.songs, 0);
    }
  };
  const handleAddToFavorite = () => {
    if (single) {
      const currUserName = currentUser?.name || "You";

      addToFavorite(currUserName, single.imageUrl, single._id, "Favorites");
    }
  };
  const single = {
    _id: "342342",
    title: "Kalank",
    artist: "Arijit singh",
    year: "2024",
    releaseDate: "324234",
    duration: 225,
    language: "hindi",
    label: "T-series",
    playcount: 2342342,
    album: {
      id: "15394623",
      name: "Kalank",
    },
    artists: {
      primary: [
        { id: "459320", name: "Arijit Singh" },
        { id: "342343", name: "Pritam" },
      ],
      all: [{ id: "342342", name: "Arijit Singh" }],
    },
    imageUrl:
      "https://i.scdn.co/image/ab67616d0000b273f4b3b3b3b3b3b3b3b3b3b3b3",
    downLoadeUrl: {
      url: "",
    },
  };

  useEffect(() => {
    if (single.album.id) {
      useMusicStore.setState({ currentAlbum: null });
      fetchAlbumById(single.album.id);
    }
  }, [single.album.id, fetchAlbumById]);

  useEffect(() => {
    if (single.artists.primary[0].id) {
      const id = single.artists.primary[0].id;
      fetchArtistById(id);
    }
  }, [single.artists.primary[0].id, fetchArtistById]);

  const isAddedToFavorites = true;
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
                {!isLoading && (
                  <h1 className="text-2xl md:text-5xl font-bold my-4">
                    {single?.title}
                  </h1>
                )}
                {isLoading && <Skeleton className="h-10 w-[250px]" />}
                {!isLoading && (
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    {single.artists.primary.map((artist) => (
                      <span key={artist.id}>{artist.name} ● </span>
                    ))}

                    <span>
                      {single?.year} ● {single.album.name}
                    </span>
                  </div>
                )}
                {isLoading && <Skeleton className="h-4 w-[250px] mt-5" />}
                {!isLoading && (
                  <div className="flex flex-col gap-2 items-start justify-center mt-2 text-sm text-zinc-100">
                    <span>
                      Song ● {single.playcount} Plays ●{" "}
                      {formatDuration(single.duration)} ●{" "}
                      {single.language.charAt(0).toUpperCase() +
                        single.language.slice(1)}
                    </span>
                    <span>{single.label}</span>
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
                {isPlaying && single && single._id === currentSong?._id ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
              {/* Add to playlist button */}
              {isAddedToFavorites ? (
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
                      <Link to={`/album/342342`} className="flex gap-2">
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
                          <DropdownMenuItem className="hover:cursor-pointer">
                            <span>Email</span>
                          </DropdownMenuItem>
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
                    <Artists />
                    <Artists />
                    <Artists />
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
