import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, RouteOffIcon, SatelliteDish } from "lucide-react";
import Memberslist from "./Memberslist";
import useSocketStore from "@/store/useSocketStore";
import useRoomStore from "@/store/useRoomStore";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

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
      <div>
        {currentUser && !isBroadcasting && currentUser.role === "admin" && (
          <Button
            onClick={() => startBroadcast(userId, roomId)}
            title="Broadcast song"
            variant="outline"
          >
            <SatelliteDish className="size-4" />
            <span className="hidden md:inline">Broadcast Song</span>
          </Button>
        )}
        {currentUser && isBroadcasting && currentUser.role === "admin" && (
          <Button
            onClick={() => endBroadcast(userId, roomId)}
            title="End Broadcast "
            variant="outline"
          >
            <RouteOffIcon className="size-4" />
            <span className="hidden md:inline">End broadcast </span>
          </Button>
        )}

        {currentUser &&
          isAlreadyJoined &&
          currentUser.role !== "admin" &&
          storeRoomId === roomId && (
            <Button variant={"outline"} onClick={handleEndSession}>
              <LogOut className="size-4" />
              <span>End session</span>
            </Button>
          )}
      </div>
    </div>
  );
};

export default Chatheader;
