import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";

import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();
  const { sendMessage } = useSocketStore();

  const handleSend = () => {
    if (!currentRoom || !user || !currentUser || !newMessage) return;
    sendMessage(newMessage.trim(), currentUser?._id, currentRoom.roomId);
    setNewMessage("");
  };

  return (
    <div className="p-4  mb-16   border-t border-zinc-800 ">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-zinc-800 border-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button
          size={"icon"}
          onClick={handleSend}
          disabled={!newMessage.trim()}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};
export default MessageInput;
