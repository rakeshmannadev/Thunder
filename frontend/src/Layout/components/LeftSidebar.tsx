import PlaylistSkeleton from "@/components/Skeleton/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { Group, Home, Library, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
    const isLoading =false;
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

          <Link
            to={"/room"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800 ",
              })
            )}
          >
            <Group className="mr-2 size-5" />
            <span className="hidden md:inline"> Room</span>
          </Link>
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
                {isLoading ?(
                    <PlaylistSkeleton/>
                ):("Playlist")}

            </div>
        </ScrollArea>
      </section>
    </aside>
  );
};

export default LeftSidebar;
