import { Badge } from "@/components/ui/badge";
import useSocketStore from "@/store/useSocketStore";
import { Link } from "react-router-dom";

const CurrentlyPlaying = ({ isMobile }: { isMobile: boolean }) => {
  const { isBroadcasting, userName, userId, isPlayingSong } = useSocketStore();
  return (
    <div className=" absolute top-0 w-full  p-4  bg-green-500/30 z-10  backdrop-blur-sm ">
      <div className="flex gap-3 items-center  w-full">
        {isBroadcasting && isPlayingSong && (
          <img
            src="/Agneepath.jpg"
            alt="album"
            className="rounded-full size-7 animate-spin "
          />
        )}
        <Link
          to="song/4234"
          className="flex flex-col w-4/5  whitespace-nowrap  text-ellipsis overflow-hidden "
        >
          {isMobile ? (
            <marquee
              behavior="scroll"
              scrollamount="3"
              className="text-emerald-100 font-bold "
            >
              {isBroadcasting
                ? isPlayingSong
                  ? "Song name"
                  : "Admin is about to broadcast"
                : "Currently no song is broadcasting!"}
            </marquee>
          ) : (
            <p className="text-emerald-100 font-bold ">
              {isBroadcasting
                ? isPlayingSong
                  ? "Song name"
                  : "Admin is about to broadcast"
                : "Currently no song is broadcasting!"}
            </p>
          )}
          {isBroadcasting && isPlayingSong && (
            <p className="text-emerald-50 text-sm font-semibold">Sonu nigam</p>
          )}
        </Link>

        {isBroadcasting && isPlayingSong && (
          <div className="float-right flex gap-2 text-sm ml-auto text-nowrap">
            <p className="hidden md:inline">Playing by </p>{" "}
            <Link to={`/profile/${userId}`}>
              <Badge variant={"default"} className="cursor-pointer">
                {userName}
              </Badge>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
