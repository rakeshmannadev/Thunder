import PlaylistSkeleton from "@/components/Skeleton/PlaylistSkeleton";
import TooltipComponent from "@/components/Tooltip/TooltipComponent";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { Group, Home, Library, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { userId } = useAuth();

  const {
    playlistLoading,
    rooms,
    playlists,
    fetchJoinedRooms,
    fetchPlaylists,
  } = useUserStore();

  useEffect(() => {
    if (userId && rooms.length <= 0 && playlists.length <= 0) {
      fetchJoinedRooms();
      fetchPlaylists();
    }
  }, [userId, rooms.length, playlists.length]);

  return (
    <aside className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <section className=" rounded-lg bg-zinc-900 p-4 flex flex-col items-center ">
        <div className="space-y-2  w-fit ">
          <TooltipComponent text="Home">
            <Link
              to={"/"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 ",
                })
              )}
            >
              <Home className="md:mr-2 size-5" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </TooltipComponent>

          <SignedIn>
            <TooltipComponent text="Create room">
              <Link
                to={"/"}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className:
                      "w-full justify-start text-white hover:bg-zinc-800 ",
                  })
                )}
              >
                <PlusCircle className="md:mr-2 size-5" />
                <span className="hidden md:inline">Create Room</span>
              </Link>
            </TooltipComponent>
          </SignedIn>

          {rooms &&
            rooms.length > 0 &&
            rooms.map((room) => (
              <div key={room._id}>
                <TooltipComponent text={room.roomName}>
                  <Link
                    to={`/room/${room.roomId}`}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        className:
                          "w-full justify-start text-white hover:bg-zinc-800 ",
                      })
                    )}
                  >
                    <Group className="md:mr-2 size-5" />
                    <span className="hidden md:inline"> {room.roomName}</span>
                  </Link>
                </TooltipComponent>
              </div>
            ))}
        </div>
      </section>

      {/* Library section */}
      <section className="flex-1 flex flex-col   items-center rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between md:float-start md:mr-auto mb-4">
          <div className=" flex items-center text-white px-2">
            <Library className="size-5 md:mr-2" />
            <span className="hidden md:inline">Playlists</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)] w-fit md:w-full pb-5">
          <div className="space-y-2 ">
            {playlistLoading ? (
              <PlaylistSkeleton />
            ) : (
              playlists &&
              playlists.length > 0 &&
              playlists.map((playlist) => (
                <div key={playlist._id}>
                  <TooltipComponent text={playlist.playListName}>
                    <Link
                      to={`/playlist/${playlist._id}`}
                      className="p-2 max-sm:w-16 hover:bg-zinc-800 rounded-full md:rounded-md flex items-center gap-3 group cursor-pointer"
                    >
                      <img
                        src={playlist.imageUrl}
                        alt="playlist_img"
                        className="  md:size-12 rounded-full md:rounded-md flex-shrink-0 object-cover "
                      />
                      <div className="flex-1 min-w-0 hidden md:block">
                        <p className="font-medium truncate">
                          {playlist.playListName}
                        </p>
                        <p className="text-sm text-zinc-400 truncate">
                          playlist ● {playlist.artist}
                        </p>
                      </div>
                    </Link>
                  </TooltipComponent>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </section>
    </aside>
  );
};

export default LeftSidebar;
