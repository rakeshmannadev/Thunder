import PlaylistSkeleton from "@/components/Skeleton/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import useMusicStore from "@/store/useMusicStore";
import useUserStore from "@/store/useUserStore";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { Group, Home, Library, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
//   const{albums,songs,fetchAlbums,fetchSongs,isLoading} = useMusicStore()
  // useEffect(()=>{
  //     fetchAlbums();
  // },[])

  const {user} = useUser();

  const {isLoading,rooms,fetchJoinedRooms} = useUserStore();

  useEffect(()=>{
    if(user){
      fetchJoinedRooms();
    }
  },[user])
  
  const albums = [
    {
      _id: 2342342,
      imageUrl: "/Kesariya.jpg",
      title: "Top charts",
      artist: "Sonu nigam",
    },
    {
      _id: 2342342,
      imageUrl: "/Kesariya.jpg",
      title: "Top charts",
      artist: "Sonu nigam",
    },
    {
      _id: 2342342,
      imageUrl: "/Kesariya.jpg",
      title: "Top charts",
      artist: "Sonu nigam",
    },
    {
      _id: 2342342,
      imageUrl: "/Kesariya.jpg",
      title: "Top charts",
      artist: "Sonu nigam",
    },
    {
      _id: 2342342,
      imageUrl: "/Kesariya.jpg",
      title: "Top charts",
      artist: "Sonu nigam",
    },
    {
      _id: 2342342,
      imageUrl: "/Kesariya.jpg",
      title: "Top charts",
      artist: "Sonu nigam",
    },
  ];

  return (
    <aside className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <section className=" rounded-lg bg-zinc-900 p-4 ">
        <div className="space-y-2 ">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800 ",
              })
            )}
          >
            <Home className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 ",
                })
              )}
            >
              <PlusCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Create Room</span>
            </Link>
          </SignedIn>


          {rooms && rooms.length>0 && rooms.map((room)=>(
            <Link
            key={room._id}
            to={`/room/${room.roomId}`}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800 ",
              })
            )}
          >
            <Group className="mr-2 size-5" />
            <span className="hidden md:inline"> {room.roomName}</span>
          </Link>
          ))

          }
        </div>
      </section>

      {/* Library section */}
      <section className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className=" flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Playlists</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {isLoading ? <PlaylistSkeleton /> : 
                (
                    albums.map((album)=>(
                        <Link 
                        to={`/album/${album._id}`}
                        key={album._id}
                        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                        
                        >
                        <img src={album.imageUrl} alt="album_img" 
                        className="size-12 rounded-md flex-shrink-0 object-cover " />
                        <div className="flex-1 min-w-0 hidden md:block">
                            <p className="font-medium truncate">{album.title}</p>
                            <p className="text-sm text-zinc-400 truncate">Album ● {album.artist}</p>
                        </div>
                        </Link>

                    ))
                )
            }
          </div>
        </ScrollArea>
      </section>
    </aside>
  );
};

export default LeftSidebar;
