import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  EllipsisVertical,
  LogOut,
  Music,
  Play,
  RouteOffIcon,
  SatelliteDish,
  Trash,
  Unplug,
  UserCog,
  X,
} from "lucide-react";
import Memberslist from "./Memberslist";
import useSocketStore from "@/store/useSocketStore";
import useRoomStore from "@/store/useRoomStore";
import useUserStore from "@/store/useUserStore";
import { Link, useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Alertdialog from "@/components/Alertdialog/Alertdialog";
import useMusicStore from "@/store/useMusicStore";
import { SongRequest } from "@/types";
import toast from "react-hot-toast";

const Chatheader = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const {
    startBroadcast,
    endBroadcast,
    leaveRoom,
    isBroadcasting,
    activeUsers,
    deleteRoom,
    sendSongRequest,
    songRequests,
    playSong,
  } = useSocketStore();
  const { currentRoom, leaveJoinedRoom } = useRoomStore();
  const { currentUser } = useUserStore();
  const { fetchAllSongs, songs } = useMusicStore();

  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [requestedSong, setRequestSong] = useState<SongRequest>({
    _id: "",
    title: "",
    imageUrl: "",
    albumId: "",
    userName: currentUser!.name,
    userId: currentUser!._id,
  });
  const [isAlertOpen, setAlertOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const navigate = useNavigate();
  const isAlreadyJoined =
    Array.isArray(activeUsers) &&
    activeUsers.includes(currentUser?._id?.toString());

  const isAdmin =
    currentUser?._id?.toString() === currentRoom?.admin?.toString();
  const handleEndSession = () => {
    if (!isAlreadyJoined) return;
    leaveRoom(roomId, userId);

    navigate("/");
  };

  const handleDeleteRoom = () => {
    if (currentUser && currentRoom) {
      deleteRoom(currentUser._id, currentRoom._id, roomId);
    }
  };

  useEffect(() => {
    if (songs.length <= 0) {
      fetchAllSongs();
    }
  }, []);

  if (!currentUser || !currentRoom) return null;

  return (
    <div className=" flex justify-between p-4 border-b border-zinc-900">
      <div className="flex items-center gap-3 text-nowrap">
        <Avatar>
          <AvatarImage src={currentRoom?.image} />
          <AvatarFallback>{currentRoom?.roomName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{currentRoom?.roomName}</h2>
          <Memberslist roomId={roomId}>
            <p className="text-sm hover:underline cursor-pointer text-zinc-400">
              See members
            </p>
          </Memberslist>
        </div>
      </div>
      <div>
        {/* Dialog for room menu */}
        <Dialog open={isOpen} onOpenChange={closeModal}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                title="Open menu"
                aria-haspopup="true"
                size="icon"
                variant="ghost"
                className="hover:bg-gray-700/75"
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {!isAdmin && isAlreadyJoined ? (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleEndSession}
                  >
                    <Unplug className="size-4" /> End session
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={openModal}
                    className="cursor-pointer"
                  >
                    <Music className="size-4" /> Request song
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => toast.success("Feature coming soon")}
                  >
                    <UserCog className="size-4" /> Be modaretor
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400"
                    onClick={() => {
                      leaveJoinedRoom(currentRoom._id);
                      navigate("/");
                    }}
                  >
                    <LogOut className="size-4" /> Leave room
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  {isBroadcasting ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => endBroadcast(userId, roomId)}
                    >
                      <SatelliteDish className="size-4" /> End broadcast
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => startBroadcast(userId, roomId)}
                    >
                      <RouteOffIcon className="size-4" /> Start broadcast
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                      className={`${
                        songRequests.length > 0 && "text-green-400"
                      }`}
                    >
                      <Music className="size-4" />
                      <span>Song requests</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {songRequests.length > 0 ? (
                          songRequests.map((song, index) => (
                            <DropdownMenuItem key={index}>
                              <div className="flex gap-2 justify-between">
                                <Avatar>
                                  <AvatarImage src={song.imageUrl} />
                                  <AvatarFallback></AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-1 justify-center">
                                  <Link
                                    to={`/album/${song.albumId}`}
                                    className="hover:underline"
                                  >
                                    {song.title}
                                  </Link>
                                  <Link
                                    to={`/profile/${song.userId}`}
                                    className="hover:underline"
                                  >
                                    {song.userName}
                                  </Link>
                                </div>
                                <div className="flex gap-2 items-center justify-center">
                                  <div
                                    title="Play"
                                    className="h-full cursor-pointer   w-fit flex justify-center items-center hover:bg-slate-500 px-3 rounded-md"
                                  >
                                    <Play
                                      className="size-4 text-green-500"
                                      onClick={() =>
                                        playSong(
                                          currentUser._id,
                                          roomId,
                                          song._id,
                                          song.userId
                                        )
                                      }
                                    />
                                  </div>
                                  <div
                                    title="Remove"
                                    className="h-full  cursor-pointer  w-fit flex justify-center items-center hover:bg-slate-500 px-3 rounded-md"
                                  >
                                    <X className="size-4 text-red-500" />
                                  </div>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <p>No song requests</p>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuItem className="text-red-400">
                    <Trash className="size-4" />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlertOpen(true);
                      }}
                    >
                      Delete room
                    </span>
                  </DropdownMenuItem>
                  <Alertdialog
                    message="This action cannot be undone. This will permanently delete the
            room and remove all members from our servers."
                    isOpen={isAlertOpen}
                    setOpen={setAlertOpen}
                    onConfirm={handleDeleteRoom}
                  />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog for searching song and send request */}
          <DialogContent
            className="sm:max-w-[425px]"
            onEscapeKeyDown={closeModal}
          >
            <DialogHeader>
              <DialogTitle>Request song</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-fit justify-between"
                    >
                      {requestedSong.title
                        ? songs.find(
                            (song) => song.title === requestedSong.title
                          )?.title
                        : "Select song..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0">
                    <Command>
                      <CommandInput placeholder="Search a song..." />
                      <CommandList>
                        <CommandEmpty>No song found.</CommandEmpty>
                        <CommandGroup>
                          {songs.map((song) => (
                            <CommandItem
                              key={song._id}
                              value={song.title}
                              onSelect={(currentValue) => {
                                setRequestSong({
                                  ...requestedSong,
                                  _id: song._id,
                                  albumId: song.albumId,
                                  title:
                                    currentValue === requestedSong.title
                                      ? ""
                                      : currentValue,
                                  imageUrl: song.imageUrl,
                                });
                                setOpen(false);
                              }}
                            >
                              <Avatar>
                                <AvatarImage src={song.imageUrl} />
                                <AvatarFallback>
                                  {song.title.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {song.title}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  requestedSong.title === song.title
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4"></div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  sendSongRequest(currentUser?._id, roomId, requestedSong);
                  closeModal();
                }}
              >
                Send request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Chatheader;
