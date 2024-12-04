import PlaylistSkeleton from "@/components/Skeleton/PlaylistSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { useAuth } from "@clerk/clerk-react";
import {
  Bell,
  BellDot,
  Check,
  HeadphonesIcon,
  MessageSquare,
  Users2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const [notification, setNotification] = useState(false);
  const { isLoading, fetchPublicRooms, publicRooms, rooms } = useUserStore();
  const { joinPublicRoom, fetchJoinRequests, joinRequests } = useRoomStore();
  const { sendJoinRequest, acceptJoinRequest, rejectJoinRequest } =
    useSocketStore();
  const { userId } = useAuth();
  const { currentUser } = useUserStore();

  const userCreatedRooms: string[] = [];

  if (userId && currentUser) {
    rooms.forEach((room) => {
      if (room.admin === currentUser._id) {
        userCreatedRooms.push(room._id);
      }
    });
  }

  useEffect(() => {
    fetchJoinRequests(userCreatedRooms);
  }, [fetchJoinRequests, userCreatedRooms.length]);

  useEffect(() => {
    if (joinRequests.length > 0) {
      setNotification(true);
    } else {
      setNotification(false);
    }
  }, [joinRequests.length]);

  useEffect(() => {
    if (publicRooms.length <= 0) {
      fetchPublicRooms();
    }
  }, []);

  const handleJoinPublicRoom = (roomId: string) => {
    if (!userId) return toast.error("Please login to join rooms");
    joinPublicRoom(roomId);
  };
  const handleSendRequest = (roomId: string) => {
    if (!userId || !currentUser)
      return toast.error("Please login to send request");
    sendJoinRequest(currentUser?._id, roomId);
  };

  return userId ? (
    <aside className="h-full flex flex-col gap-2">
      <section className="rounded-lg bg-zinc-900 p-4">
        <div className="flex  flex-col lg:flex-row  gap-2">
          {userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  title="Messages"
                  variant={"ghost"}
                  className="w-full justify-center md:justify-start text-white hover:bg-zinc-800 "
                >
                  <MessageSquare className=" size-5" />
                  <span className="hidden md:inline">Messages</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <ScrollArea>
                  <div className="space-y-2">
                    {publicRooms.map((room) => (
                      <Link
                        to={`/room/${room._id}`}
                        key={room._id}
                        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                      >
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 block">
                          <p className="font-medium truncate">
                            {room.roomName}
                          </p>
                          <p className="text-sm text-zinc-400 truncate">
                            Text message
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  title="Requests"
                  variant={"ghost"}
                  className="w-full justify-center md:justify-start text-white hover:bg-zinc-800 "
                >
                  {notification ? (
                    <BellDot className=" text-green-400 size-5" />
                  ) : (
                    <Bell className="size-5" />
                  )}
                  <span className="hidden md:inline">Requests</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Join Requests</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea>
                  <div className="space-y-2">
                    {joinRequests.length > 0 ? (
                      joinRequests.map((request) => (
                        <div
                          key={request.user.userId}
                          className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                        >
                          <Avatar>
                            <AvatarImage src={request.room.image} />
                            <AvatarFallback>
                              {request.room.roomName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1  min-w-0 flex gap-2 items-center">
                            <div>
                              <Link
                                to={`/room/${request.room.roomId}`}
                                className="font-medium block truncate hover:underline"
                              >
                                {request.room.roomName}
                              </Link>
                              <Link
                                to={`/profile/${request.user.userId}`}
                                className="text-sm hover:underline text-zinc-400 truncate"
                              >
                                {request.user.userName}
                              </Link>
                            </div>

                            <div className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      onClick={() =>
                                        acceptJoinRequest(
                                          request.user.userId,
                                          request.room._id
                                        )
                                      }
                                      variant={"outline"}
                                      size={"icon"}
                                    >
                                      <Check color="green" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Accept</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      onClick={() =>
                                        rejectJoinRequest(
                                          request.user.userId,
                                          request.room._id
                                        )
                                      }
                                      variant={"outline"}
                                      size={"icon"}
                                    >
                                      <X color="red" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Decline</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center p-3">No requests</p>
                    )}
                  </div>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </section>
      {/* Show rooms */}

      <section className="flex-1 flex flex-col   items-center rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between md:float-start md:mr-auto mb-4 w-full border-b-2 ">
          <div className=" flex flex-col md:flex-row text-center gap-2 items-center md:text-start text-white p-2  ">
            <Users2 className="size-5 mr-2" />
            <span className="">Rooms</span>
          </div>
        </div>
        <ScrollArea className=" h-[calc(100vh-300px)] w-fit md:w-full pb-10  ">
          <div className="space-y-2  ">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              publicRooms.map((room) => (
                <div
                  key={room._id}
                  className="p-2 hover:bg-zinc-800 rounded-md flex flex-col md:flex-row justify-center items-center gap-3 group cursor-pointer"
                >
                  <Avatar className="size-10">
                    <AvatarImage src={room.image} />
                    <AvatarFallback>
                      {room.roomName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 text-center md:text-start ">
                    <p className=" font-medium truncate">{room.roomName}</p>

                    <p className=" text-sm text-zinc-400 truncate">
                      {room.visability.charAt(0).toUpperCase() +
                        room.visability.slice(1)}{" "}
                      ● {room.participants.length}
                    </p>
                  </div>
                  {room.visability === "public" ? (
                    <Button
                      onClick={() => handleJoinPublicRoom(room._id)}
                      size={"sm"}
                    >
                      {rooms.find((r) => r._id === room._id)
                        ? "Joined"
                        : "Join"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSendRequest(room._id)}
                      size={"sm"}
                    >
                      {room.requests.find(
                        (r) => r.user.userId === currentUser?._id
                      )
                        ? "Pending"
                        : "Request"}
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </section>
    </aside>
  ) : (
    <LoginPrompt />
  );
};

export default RightSidebar;

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-lg bg-zinc-900">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-zinc-900 rounded-full p-4">
        <HeadphonesIcon className="size-5 md:size-8 text-emerald-400" />
      </div>
    </div>

    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-sm md:text-lg font-semibold text-white">
        Join rooms and listen together
      </h3>
      <p className="text-xs md:text-sm text-zinc-400">
        Login to discover what music others enjoing right now
      </p>
    </div>
  </div>
);
