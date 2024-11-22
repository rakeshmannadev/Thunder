import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const CurrentlyPlaying = ({isMobile}:{isMobile:boolean}) => {

  return (
    <div className=" absolute top-0 w-full  p-4  bg-green-500/30 z-10  backdrop-blur-sm ">
      <div className="flex gap-3 items-center  w-full">
        <img
          src="/Agneepath.jpg"
          alt="album"
          className="rounded-full size-7 animate-spin "
        />
        <Link to="song/4234" className="flex flex-col w-4/5  whitespace-nowrap  text-ellipsis overflow-hidden ">
          {isMobile ? <marquee behavior='scroll'  scrollamount='3'  className="text-emerald-100 font-bold ">Abhi Mujhme kahi</marquee>:
          <p className="text-emerald-100 font-bold ">Abhi Mujhme kahi</p>
          }
          <p className="text-emerald-50 text-sm font-semibold">Sonu nigam</p>
        </Link>
        <div className="float-right flex gap-2 text-sm ml-auto text-nowrap">
          <p className="hidden md:inline">Playing by </p>{" "}
          <Link to="/profile/34234">
            <Badge variant={"default"} className="cursor-pointer">
              Arijit
            </Badge>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
