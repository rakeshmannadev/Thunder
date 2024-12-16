import Alertdialog from "@/components/Alertdialog/Alertdialog";
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
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Bird, Camera, Home, Library, PlusCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LeftSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [nextRoomId, setNextRoomId] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>();
  const [visablity, setVisability] = useState<string>();
  const [imageFile, setImageFile] = useState<null | any>();
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null | any>();
  const imageRef = useRef<HTMLInputElement>(null);

  const { roomId, isPlayingSong, isJoined, leaveRoom } = useSocketStore();
  const {
    playlistLoading,
    rooms,
    playlists,
    fetchJoinedRooms,
    fetchPlaylists,
    currentUser,
  } = useUserStore();

  const { createRoom, isLoading } = useRoomStore();
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoomId = location.pathname.slice(6);
  const currentPlaylistId = location.pathname.slice(10);

  const handleLeaveRoom = () => {
    leaveRoom(roomId, currentUser!._id);
    setAlertOpen(false);
    if (nextRoomId) navigate(`/room/${nextRoomId}`);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if (currentUser && rooms.length <= 0 && playlists.length <= 0) {
      fetchJoinedRooms();
      fetchPlaylists();
    }
  }, [rooms.length, playlists.length]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      setImageFile(image);
    }

    if (image) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(image);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName || !visablity || !imageFile)
      return toast.error("Please fill all details and select an image file");
    await createRoom(roomName, visablity, imageFile);
    if (!isLoading) {
      setImageFile(null);
      setImageUrl(null);
      setRoomName("");
      setVisability("");
      closeModal();
    }
  };

  const handleOpenRoom = (room_id: string) => {
    if (!room_id) return;
    // check if user is joined current room
    if (roomId !== room_id && isJoined) {
      setNextRoomId(room_id);
      setAlertOpen(true);
    } else {
      navigate(`/room/${room_id}`);
    }
  };

  return (
    <aside className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <section className=" rounded-lg bg-zinc-900 p-4 flex flex-col items-center ">
        <div className="space-y-2  w-fit md:w-full flex flex-col items-center md:items-start  ">
          <Link to={"/"} className="block md:hidden w-fit p-2  text-white ">
            <img src="/Thunder_logo.png" alt="logo" className="size-8 " />
          </Link>

          <TooltipComponent text="Home">
            <Link
              to={"/"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: `w-fit md:w-full p-4  justify-center md:justify-start text-white rounded-md hover:bg-zinc-800 ${
                    location.pathname === "/" ? "bg-zinc-700" : ""
                  }`,
                })
              )}
            >
              <Home className="md:mr-2 size-5" />
              <span className="hidden md:block">Home</span>
            </Link>
          </TooltipComponent>
          {currentUser && (
            <TooltipComponent text="Create room">
              <div
                onClick={openModal}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className:
                      " w-fit md:w-full p-4 cursor-pointer justify-center md:justify-start text-white hover:bg-zinc-800 ",
                  })
                )}
              >
                <PlusCircle className="md:mr-2 size-5" />
                <span className="hidden md:inline">Create Room</span>
              </div>
            </TooltipComponent>
          )}

          {currentUser && (
            <Dialog open={isOpen} onOpenChange={closeModal}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create room</DialogTitle>
                </DialogHeader>
                <div className="grid  gap-4 py-4">
                  <div className=" relative group flex justify-center w-full pb-5">
                    <Avatar className="size-28">
                      <AvatarImage
                        src={
                          imageUrl ? imageUrl : "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback>R</AvatarFallback>
                    </Avatar>
                    <div
                      onClick={() => imageRef.current?.click()}
                      className="size-28 absolute items-center justify-center bg-gray-500/75 rounded-full hidden group-hover:flex cursor-pointer transition-transform ease-in-out duration-300"
                    >
                      <Camera />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={imageRef}
                      onChange={handleImageSelect}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right text-nowrap">
                      Room name
                    </label>
                    <Input
                      onChange={(e) => setRoomName(e.target.value)}
                      id="name"
                      placeholder="room name"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="username" className="text-right">
                      Visability
                    </label>
                    <Select onValueChange={(value) => setVisability(value)}>
                      <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Choose room visablity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Visability</SelectLabel>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={
                      isLoading || !imageFile || !roomName || !visablity
                    }
                    onClick={handleCreateRoom}
                  >
                    {isLoading ? "Creating room..." : "Create room"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <ScrollArea className="h-fit w-full pb-2">
            {currentUser &&
              rooms &&
              rooms.length > 0 &&
              rooms.map((room) => (
                <div
                  key={room._id}
                  className={`relative mt-3 p-2 hover:bg-zinc-800 rounded-md ${
                    currentRoomId === room.roomId ? "bg-zinc-700" : ""
                  } `}
                >
                  <TooltipComponent text={room.roomName}>
                    <div
                      onClick={() => handleOpenRoom(room.roomId)}
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                          className:
                            "w-fit md:w-full flex cursor-pointer items-center justify-center md:justify-start text-white   ",
                        })
                      )}
                    >
                      <div>
                        <Avatar>
                          <AvatarImage src={room.image} />
                          <AvatarFallback>
                            {room.roomName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <span className="hidden md:block"> {room.roomName}</span>
                    </div>
                  </TooltipComponent>
                  {isPlayingSong && roomId == room.roomId && (
                    <div className="absolute  bottom-6 right-6 ">
                      <div className="circle"></div>
                    </div>
                  )}
                </div>
              ))}
          </ScrollArea>
        </div>
      </section>
      <Alertdialog
        isOpen={isAlertOpen}
        setOpen={setAlertOpen}
        onConfirm={handleLeaveRoom}
        message="You are already in a Session ,leave the session to continue."
      />
      {/* Library section */}
      <section className="flex-1 flex flex-col   items-center rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between md:float-start md:mr-auto mb-4">
          <div className=" flex items-center text-white px-2">
            <Library className="size-5 md:mr-2" />
            <span className="hidden md:inline">Playlists</span>
          </div>
        </div>
        {!currentUser && <LoginPrompt />}
        <ScrollArea className="h-[calc(100vh-400px)] w-fit md:w-full pb-10">
          <div className="space-y-2 w-full ">
            {playlistLoading ? (
              <PlaylistSkeleton />
            ) : (
              playlists &&
              playlists.length > 0 &&
              playlists.map((playlist) => (
                <div key={playlist._id} className=" w-2/3 ">
                  <TooltipComponent text={playlist.playListName}>
                    <Link
                      to={`/playlist/${playlist._id}`}
                      className={`p-2 max-sm:w-16 hover:bg-zinc-800 rounded-full md:rounded-md flex items-center gap-3 group cursor-pointer ${
                        currentPlaylistId === playlist._id ? "bg-zinc-700" : ""
                      } `}
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

const LoginPrompt = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-lg bg-zinc-900">
      <div className="relative">
        <div
          className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse"
          aria-hidden="true"
        />
        <div className="relative bg-zinc-900 rounded-full p-4">
          <Bird className="size-5 md:size-8 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-2 max-w-[250px]">
        <h3 className="text-sm md:text-lg font-semibold  text-white">
          Create playlists and save your favorite songs
        </h3>
        <p className="text-xs md:text-sm text-zinc-400">
          Login to save millions of songs and albums while listening them
        </p>
      </div>
    </div>
  );
};
