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
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  Check,
  HeadphonesIcon,
  MessageSquare,
  Users2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";


const RightSidebar = () => {


  const isLoading = false;
  const rooms = [
    {
      _id: 423452,
      roomId: 23452,
      roomName: "Sangeet",
      image: "/google.png",
    },
    {
      _id: 423452,
      roomId: 23452,
      roomName: "Sangeet",
      image: "/google.png",
    },
    {
      _id: 423452,
      roomId: 23452,
      roomName: "Sangeet",
      image: "/google.png",
    },
    {
      _id: 423452,
      roomId: 23452,
      roomName: "Sangeet",
      image: "/google.png",
    },
    {
      _id: 423452,
      roomId: 23452,
      roomName: "Sangeet",
      image: "/google.png",
    },
  ];
  return (
    <aside className="h-full flex flex-col gap-2">
      <section className="rounded-lg bg-zinc-900 p-4">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                className="w-full justify-start text-white hover:bg-zinc-800 "
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
                  {rooms.map((room) =>
                    rooms.map((room) => (
                      <Link
                        to={`/room/${room._id}`}
                        key={room._id}
                        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                      >
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 hidden md:block">
                          <p className="font-medium truncate">
                            {room.roomName}
                          </p>
                          <p className="text-sm text-zinc-400 truncate">
                            Text message
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                className="w-full justify-start text-white hover:bg-zinc-800 "
              >
                <Bell className=" size-5" />
                <span className="hidden md:inline">Requests</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Join Requests</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea>
                <div className="space-y-2">
                  {rooms.map((room) =>
                    rooms.map((room) => (
                      <Link
                        to={`/room/${room._id}`}
                        key={room._id}
                        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                      >
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div className="flex-1  min-w-0 hidden md:flex gap-2 items-center">
                          <div>
                            <p className="font-medium truncate">
                              {room.roomName}
                            </p>
                            <p className="text-sm text-zinc-400 truncate">
                              Text message
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button variant={"outline"} size={"icon"}>
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
                                  <Button variant={"outline"} size={"icon"}>
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
                      </Link>
                    ))
                  )}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      {/* Show public rooms */}

      <section className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className=" flex items-center text-white px-2">
            <Users2 className="size-5 mr-2" />
            <span className="hidden md:inline">Public rooms</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              rooms.map((room) => (
                <Link
                  to={`/room/${room._id}`}
                  key={room._id}
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={room.image}
                    alt="room_img"
                    className="size-12 rounded-md flex-shrink-0 object-cover "
                  />
                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">{room.roomName}</p>
                    <p className="text-sm text-zinc-400 truncate">
                      Joined ● 100
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </section>
    </aside>
  );
};

export default RightSidebar;

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-zinc-900 rounded-full p-4">
        <HeadphonesIcon className="size-8 text-emerald-400" />
      </div>
    </div>

    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-semibold text-white">
        Join rooms and listen together
      </h3>
      <p className="text-sm text-zinc-400">
        Login to discover what music your friends are enjoying right now
      </p>
    </div>
  </div>
);
