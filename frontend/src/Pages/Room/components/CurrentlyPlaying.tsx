import { Badge } from "@/components/ui/badge";
import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
import { Link } from "react-router-dom";

const CurrentlyPlaying = ({ isMobile }: { isMobile: boolean }) => {
  const { currentSong } = usePlayerStore();

  const { isBroadcasting, userName, requestedUser, userId, isPlayingSong } =
    useSocketStore();
  // console.log("requestedUser", requestedUser);
  return (
    <div className=" absolute top-0 w-full  p-4  bg-green-500/30 z-10  backdrop-blur-sm ">
      <div className="flex gap-3 items-center  w-full">
        {isBroadcasting && isPlayingSong && (
          <img
            src={currentSong!.imageUrl}
            alt="album"
            className="rounded-full size-8 animate-spin "
          />
        )}
        <div className="flex flex-col w-4/5  whitespace-nowrap  text-ellipsis overflow-hidden">
          {isMobile ? (
            <div className="text-emerald-100 font-bold marquee ">
              {isBroadcasting ? (
                isPlayingSong ? (
                  <Link
                    className="hover:underline"
                    to={`/album/${currentSong!.albumId}`}
                  >
                    {currentSong!.title}{" "}
                  </Link>
                ) : (
                  "Admin is about to broadcast"
                )
              ) : (
                "Currently no song is broadcasting!"
              )}
            </div>
          ) : (
            <p className="text-emerald-100 font-bold ">
              {isBroadcasting ? (
                isPlayingSong ? (
                  <Link
                    className="hover:underline"
                    to={`/album/${currentSong!.albumId}`}
                  >
                    {currentSong!.title}{" "}
                  </Link>
                ) : (
                  "Admin is about to broadcast"
                )
              ) : (
                "Currently no song is broadcasting!"
              )}
            </p>
          )}
          {isBroadcasting && isPlayingSong && (
            <p className="text-emerald-50 text-sm font-semibold">
              {currentSong!.artists.primary
                .map((artist) => artist.name)
                .join(", ")}
            </p>
          )}
        </div>

        {isBroadcasting && isPlayingSong && (
          <div className="float-right flex gap-2 text-sm ml-auto text-nowrap">
            <p className="hidden md:inline">
              {requestedUser ? "Requested by" : "Playing by"}{" "}
            </p>{" "}
            <Link to={`/profile/${requestedUser?._id || userId}`}>
              <Badge variant={"default"} className="cursor-pointer">
                {requestedUser ? requestedUser.name : userName}
              </Badge>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
