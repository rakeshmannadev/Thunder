import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  LogOut,
  Music,
  Music2,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

const Chatheader = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const {
    startBroadcast,
    endBroadcast,
    disconnectSocket,
    isBroadcasting,
    activeUsers,
    roomId: storeRoomId,
  } = useSocketStore();
  const { currentRoom } = useRoomStore();
  const { currentUser } = useUserStore();

  const navigate = useNavigate();
  const isAlreadyJoined =
    Array.isArray(activeUsers) &&
    activeUsers.includes(currentUser?._id.toString());

  const isAdmin = currentUser?._id === currentRoom?.admin;

  const handleEndSession = () => {
    if (!isAlreadyJoined) return;

    disconnectSocket();
    navigate("/");
  };

  if (!currentUser) return null;

  return (
    <div className=" flex justify-between p-4 border-b border-zinc-900">
      <div className="flex items-center gap-3 text-nowrap">
        <Avatar>
          <AvatarImage />
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
      <div className="flex gap-2 items-center">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger asChild className="  cursor-pointer">
              <Button size={"icon"} variant={"ghost"}>
                <EllipsisVertical className="size-5 cursor-pointer" />
              </Button>
            </MenubarTrigger>
            <MenubarContent className="w-fit">
              {currentUser && isAlreadyJoined && !isAdmin && (
                <>
                  <MenubarItem>
                    <Button variant={"ghost"} onClick={handleEndSession}>
                      <Unplug className="size-4" />
                      <span>End session</span>
                    </Button>
                  </MenubarItem>
                  <MenubarItem>
                    <Button variant={"ghost"}>
                      <Music className="size-4" />
                      <span>Request song</span>
                    </Button>
                  </MenubarItem>
                  <MenubarItem>
                    <Button variant={"ghost"}>
                      <UserCog className="size-4" />
                      <span>Be modarator</span>
                    </Button>
                  </MenubarItem>
                  <MenubarItem className="text-red-400">
                    <Button variant={"ghost"}>
                      <LogOut className="size-4" />
                      <span>Leave room</span>
                    </Button>
                  </MenubarItem>
                </>
              )}

              {currentUser && isAlreadyJoined && isAdmin && (
                <>
                  <MenubarItem className="">
                    {currentUser && !isBroadcasting && isAdmin && (
                      <Button
                        onClick={() => startBroadcast(userId, roomId)}
                        title="Broadcast song"
                        variant="ghost"
                      >
                        <SatelliteDish className="size-4" />
                        <span>Broadcast Song</span>
                      </Button>
                    )}
                    {currentUser && isBroadcasting && isAdmin && (
                      <Button
                        onClick={() => endBroadcast(userId, roomId)}
                        title="End Broadcast "
                        variant="ghost"
                      >
                        <RouteOffIcon className="size-4" />
                        <span>End broadcast </span>
                      </Button>
                    )}
                  </MenubarItem>
                  {isBroadcasting && <MenubarSeparator />}
                  {currentUser && isBroadcasting && isAdmin && (
                    <MenubarSub>
                      <MenubarSubTrigger>Song requests</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem>Email link</MenubarItem>
                        <MenubarItem>Messages</MenubarItem>
                        <MenubarItem>Notes</MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                  )}
                  <MenubarSeparator />
                  <MenubarItem className="flex justify-center items-center gap-4 text-red-400">
                    <Button variant={"ghost"} onClick={handleEndSession}>
                      <Trash className="size-4" />
                      <span>Delete room</span>
                    </Button>
                  </MenubarItem>
                </>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default Chatheader;
