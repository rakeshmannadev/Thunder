import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";

import { useUser } from "@clerk/clerk-react";
import { Send, Smile } from "lucide-react";
import { useState } from "react";
import useComponentVisible from "@/hooks/useComponentVisible";

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");

  const { user } = useUser();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();
  const { sendMessage } = useSocketStore();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const handleSend = () => {
    if (!currentRoom || !user || !currentUser || !newMessage) return;
    sendMessage(newMessage.trim(), currentUser?._id, currentRoom.roomId);
    setNewMessage("");
  };

  return (
    <div className="p-4 border-t border-zinc-800 ">
      <div className="relative flex gap-2">
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-zinc-800 border-none pl-10  "
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button
          size={"icon"}
          onClick={handleSend}
          disabled={!newMessage.trim()}
        >
          <Send className="size-4" />
        </Button>
        <div ref={ref} onClick={() => setIsComponentVisible(true)}>
          {isComponentVisible && (
            <EmojiPicker
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.NATIVE}
              style={{
                position: "absolute",
                bottom: "3rem",
                left: "1rem",
                zIndex: 50,
              }}
              onEmojiClick={(emojiObject) => {
                setNewMessage((prev) => prev + emojiObject.emoji);
              }}
            />
          )}
          <Smile
            className={`absolute left-2 top-2 size-5 cursor-pointer  ${
              isComponentVisible ? "text-white" : "text-gray-600"
            } `}
          />
        </div>
      </div>
    </div>
  );
};
export default MessageInput;
