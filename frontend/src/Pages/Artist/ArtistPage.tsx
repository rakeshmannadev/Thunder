import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import AlbumGrid from "@/Pages/Home/components/AlbumGrid.tsx";
import TopSongsSection from "@/Pages/Artist/TopSongsSection.tsx";
import useMusicStore from "@/store/useMusicStore.ts";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Bird,
  Facebook,
  Instagram,
  Loader,
  Twitter,
  Verified,
} from "lucide-react";
import TooltipComponent from "@/components/Tooltip/TooltipComponent";
import { Button } from "@/components/ui/button";
import { formatFollowers } from "@/utils/getFormatFollowers";

const ArtistPage = () => {
  const { isLoading, currentArtist, fetchArtistById } = useMusicStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchArtistById(id);
    }
  }, [id]);

  if (!isLoading && !currentArtist) {
    return <div className="min-h-screen flex w-full items-center justify-center text-xl ">
     <Bird className="size-8 mr-2" /> {" "} Oops! No Artist found
      </div>;
  }
  if (isLoading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center ">
        <Loader className="text-emerald-500 animate-spin" />
      </div>
    );
  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-screen">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/50 via-zinc-900/20 to-zinc-900/10 pointer-events-none"
            area-hidden="true"
          />
          {/*    content*/}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row  p-6 gap-6 pb-8">
              {!isLoading && (
                <img
                  src={currentArtist?.image}
                  alt=""
                  className="w-[240px] h-[240px] shadow-xl rounded"
                />
              )}
              {isLoading && (
                <Skeleton className="h-[240px] w-[240px] rounded" />
              )}
              <div className="flex flex-col  justify-end">
                <div className="flex gap-2">
                  <p className="text-sm font-medium">
                    {currentArtist?.type.charAt(0).toUpperCase() +
                      currentArtist!.type.slice(1)}{" "}
                  </p>
                  {currentArtist?.isVerified && (
                    <TooltipComponent text="Verified">
                      <Verified className=" cursor-pointer text-green-500 w-5" />
                    </TooltipComponent>
                  )}
                </div>
                {!isLoading && (
                  <h1 className="text-2xl md:text-7xl font-bold my-4">
                    {currentArtist?.name}
                  </h1>
                )}
                {isLoading && <Skeleton className="h-10 w-[250px]" />}
                {!isLoading && (
                  <div className="flex items-center gap-4 text-sm text-zinc-100">
                    <span>
                      {" "}
                      <a href={currentArtist?.fb}>
                        {" "}
                        <Facebook />{" "}
                      </a>{" "}
                    </span>
                    <span>
                      <a href={currentArtist?.twitter}>
                        <Twitter />
                      </a>{" "}
                    </span>
                    <span>
                      <a href={currentArtist?.wiki}>
                        <Instagram />
                      </a>{" "}
                    </span>

                    <Button variant={"default"} size={"sm"}  >
                        Followers {" "}
                        {formatFollowers(currentArtist!.followers)}
                    </Button>
                    <Button variant={"default"} size={"sm"}  >
                        Fans {" "}
                        {formatFollowers(currentArtist!.fanCount)}
                    </Button>

                  </div>
                )}
                {isLoading && <Skeleton className="h-4 w-[250px] mt-5" />}
              </div>
            </div>
          </div>
          <div className="space-y-8 p-5">
            <AlbumGrid
              title="Albums"
              songs={currentArtist!.albums}
              isLoading={isLoading}
            />
            <AlbumGrid
              title="Singles"
              songs={currentArtist!.singles}
              isLoading={isLoading}
            />
            <h2 className="text-xl sm:text-2xl font-bold">Top Songs</h2>
            <TopSongsSection />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistPage;
