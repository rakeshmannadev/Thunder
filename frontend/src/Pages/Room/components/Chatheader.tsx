import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SatelliteDish } from "lucide-react";
import Memberslist from "./Memberslist";
import useSocketStore from "@/store/useSocketStore";
import useRoomStore from "@/store/useRoomStore";
import useUserStore from "@/store/useUserStore";

const Chatheader = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const { startBroadcast } = useSocketStore();
  const { currentRoom } = useRoomStore();
  const { currentUser } = useUserStore();

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
        {currentUser && currentUser.role === "admin" && (
          <Button
            onClick={() => startBroadcast(userId, roomId)}
            title="Broadcast song"
            variant="outline"
          >
            <SatelliteDish className="size-4" />
            <span className="hidden md:inline">Broadcast Song</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Chatheader;
