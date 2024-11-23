import Header from "@/components/Header";
import Chatheader from "./components/Chatheader";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./components/MessageInput";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CurrentlyPlaying from "./components/CurrentlyPlaying";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import useSocketStore from "@/store/useSocketStore";
import useRoomStore from "@/store/useRoomStore";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const RoomPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  const { currentUser } = useUserStore();
  const { roomId } = useParams<string>();
  const { connectSocket, joinRoom, leaveRoom } = useSocketStore();
  const { getRoomById, currentRoom } = useRoomStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // fetch current roomByID
  useEffect(() => {
    if (roomId) {
      getRoomById(roomId);
    }
  }, [roomId]);

  console.log(currentRoom);

  // Socket Logics

  useEffect(() => {
    if (currentUser && roomId) {
      connectSocket(roomId);
      joinRoom(currentUser._id, roomId);
    }
    return () => {
      if (roomId && currentUser) leaveRoom(roomId, currentUser._id);
    };
  }, [currentUser, roomId, connectSocket, joinRoom]);

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Header />
      <div className="grid  grid-cols-[1fr] h-[calc(100vh-130px)]">
        {/* chat message */}
        <div className=" flex flex-col h-full">
          <Chatheader roomId={roomId} userId={currentUser?._id} />
          <ResizablePanelGroup
            direction="vertical"
            className=" flex flex-col h-full"
          >
            <ResizablePanel
              defaultSize={isMobile ? 27 : 20}
              maxSize={isMobile ? 27 : 20}
              className="relative h-full"
            >
              <CurrentlyPlaying isMobile={isMobile} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Messages */}
            <ResizablePanel>
              <ScrollArea className="h-[calc(100vh-360px)] pb-16    ">
                <div className="p-4  space-y-4  py-5   ">
                  {currentRoom && currentRoom?.messages?.length > 0 ? (
                    currentRoom.messages.map((message: any, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 z-20 ${
                          message.senderId === currentUser?._id
                            ? "flex-row-reverse"
                            : ""
                        }`}
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={
                              message.senderId === currentUser?._id
                                ? currentUser?.image
                                : message.senderId?.imageUrl
                            }
                          />
                        </Avatar>

                        <div
                          className={`rounded-lg p-3 max-w-[70%] 
													${message.senderId === currentUser?._id ? "bg-green-500" : "bg-zinc-800"}
												`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs text-zinc-300 mt-1 block">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoConversationPlaceholder />
                  )}
                </div>
              </ScrollArea>
            </ResizablePanel>
            <MessageInput />
          </ResizablePanelGroup>
        </div>
      </div>
    </main>
  );
};

export default RoomPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6 ">
    <img src="/google.png" alt="Thunder" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No Conversation till now
      </h3>
      <p className="text-zinc-500 text-sm">Start chatting with room members</p>
    </div>
  </div>
);
