import PlaylistSkeleton from "@/components/Skeleton/PlaylistSkeleton";
import TooltipComponent from "@/components/Tooltip/TooltipComponent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Camera, Group, Home, Library, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { userId } = useAuth();
  const { roomId, isPlayingSong } = useSocketStore();
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
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        className:
                          "w-full cursor-pointer justify-start text-white hover:bg-zinc-800 ",
                      })
                    )}
                  >
                    <PlusCircle className="md:mr-2 size-5" />
                    <span className="hidden md:inline">Create Room</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create room</DialogTitle>
                  </DialogHeader>
                  <div className="grid  gap-4 py-4">
                    <div className=" relative group flex justify-center w-full pb-5">
                      <Avatar className="size-28">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>R</AvatarFallback>
                      </Avatar>
                      <div className="size-28 absolute items-center justify-center bg-gray-500/75 rounded-full hidden group-hover:flex cursor-pointer transition-transform ease-in-out duration-300">
                        <Camera />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right text-nowrap">
                        Room name
                      </label>
                      <Input
                        id="name"
                        defaultValue="room name"
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="username" className="text-right">
                        Visability
                      </label>
                      <Select>
                        <SelectTrigger className="w-fit">
                          <SelectValue placeholder="Choose room visablity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Visability</SelectLabel>
                            <SelectItem value="apple">Public</SelectItem>
                            <SelectItem value="banana">Private</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create room</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TooltipComponent>
          </SignedIn>

          {rooms &&
            rooms.length > 0 &&
            rooms.map((room) => (
              <div key={room._id} className="relative">
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
                {isPlayingSong && roomId == room.roomId && (
                  <div className="absolute  bottom-4 right-4 ">
                    <div className="circle"></div>
                  </div>
                )}
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
        <ScrollArea className="h-[calc(100vh-300px)] w-fit md:w-full pb-10">
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
