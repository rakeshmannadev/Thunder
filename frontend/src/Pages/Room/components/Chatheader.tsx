import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  EllipsisVertical,
  LogOut,
  Music,
  RouteOffIcon,
  SatelliteDish,
  Trash,
  Unplug,
  UserCog,
} from "lucide-react";
import Memberslist from "./Memberslist";
import useSocketStore from "@/store/useSocketStore";
import useRoomStore from "@/store/useRoomStore";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
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

const Chatheader = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const {
    startBroadcast,
    endBroadcast,
    leaveRoom,
    isBroadcasting,
    activeUsers,
  } = useSocketStore();
  const { currentRoom } = useRoomStore();
  const { currentUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const navigate = useNavigate();
  const isAlreadyJoined =
    Array.isArray(activeUsers) &&
    activeUsers.includes(currentUser?._id.toString());

  const isAdmin = currentUser?._id === currentRoom?.admin;

  const handleEndSession = () => {
    if (!isAlreadyJoined) return;
    leaveRoom(roomId, userId);

    navigate("/");
  };
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
  ];
  if (!currentUser) return null;

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
                className="hover:bg-gray-700/75 "
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
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCog className="size-4" /> Be modaretor
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-400">
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
                    <DropdownMenuSubTrigger>
                      <Music className="size-4" />
                      <span>Song requests</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>list 1</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem className="text-red-400">
                    <Trash className="size-4" />
                    <span>Delete room</span>
                  </DropdownMenuItem>
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
                <label htmlFor="name" className="text-right">
                  Select song
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? frameworks.find(
                            (framework) => framework.value === value
                          )?.label
                        : "Select song..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search a song..." />
                      <CommandList>
                        <CommandEmpty>No song found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === framework.value
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
              <Button>Send request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Chatheader;
