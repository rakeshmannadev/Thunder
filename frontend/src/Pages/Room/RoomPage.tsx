import Header from "@/components/Header";
import Chatheader from "./components/Chatheader";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./components/MessageInput";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UsersList from "./components/UserLists";

import CurrentlyPlaying from "./components/CurrentlyPlaying";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const RoomPage = () => {
  const selectedUser = {
    fullName: "Arijit Singh",
    imageUrl: "/Kesariya.jpg",
  };

  const messages = [
    {
      _id: "r23432s",
      senderId: 34234,
      content: "This is test message",
      createdAt: "20-05-2024",
    }, {
      _id: "r23432",
      senderId: 3423,
      content: "This is test message",
      createdAt: "20-05-2024",
    }, {
      _id: "r2343",
      senderId: 34234,
      content: "This is test message",
      createdAt: "20-05-2024",
    }, {
      _id: "r234",
      senderId: 3423,
      content: "This is test message",
      createdAt: "20-05-2024",
    },{
      _id: "r234",
      senderId: 3423,
      content: "This is test message",
      createdAt: "20-05-2024",
    },{
      _id: "r234",
      senderId: 3423,
      content: "This is test message",
      createdAt: "20-05-2024",
    },{
      _id: "r234",
      senderId: 3423,
      content: "This is test message",
      createdAt: "20-05-2024",
    },,{
      _id: "r234",
      senderId: 34234,
      content: "This is test message",
      createdAt: "20-05-2024",
    },,{
      _id: "r234",
      senderId: 3423,
      content: "This is test message",
      createdAt: "20-05-2024",
    },
  ];

  const user = {
    id: 34234,
    imageUrl: "/Agneepath.jpg",
  };


  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Header />

      <div className="grid lg:grid-cols-[250px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-130px)]">
        {/* <UsersList /> */}
        <UsersList/>
        {/* chat message */}
        <div className=" flex flex-col h-full">
          {selectedUser ? (
            <>
              <Chatheader />
              <ResizablePanelGroup direction="vertical" className=" flex flex-col h-full" >

              <ResizablePanel defaultSize={18} maxSize={18} className="relative h-full" >
              <CurrentlyPlaying/>

              </ResizablePanel>
              <ResizableHandle withHandle />
              {/* Messages */}
              <ResizablePanel  >

              
              <ScrollArea className="h-[calc(100vh-360px)] pb-16    ">
                <div className="p-4  space-y-4  py-5   ">
                  {messages &&
                    messages.map((message: any) => (
                      <div
                        key={message._id}
                        className={`flex items-start gap-3 z-20 ${
                          message.senderId === user?.id
                            ? "flex-row-reverse"
                            : ""
                        }`}
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={
                              message.senderId === user?.id
                                ? user.imageUrl
                                : selectedUser.imageUrl
                            }
                          />
                        </Avatar>

                        <div
                          className={`rounded-lg p-3 max-w-[70%] 
													${message.senderId === user?.id ? "bg-green-500" : "bg-zinc-800"}
												`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs text-zinc-300 mt-1 block">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              </ResizablePanel>
              <MessageInput />
              </ResizablePanelGroup>
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};

export default RoomPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/google.png" alt="Spotify" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">
        Choose a friend or room to start chatting
      </p>
    </div>
  </div>
);
