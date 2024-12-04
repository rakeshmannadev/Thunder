import { Button } from "@/components/ui/button";
import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
  const { isPlaying, currentSong, togglePlay, setCurrentSong } =
    usePlayerStore();
  const { isBroadcasting, isPlayingSong, playSong, pauseSong, roomId } =
    useSocketStore();
  const { currentUser } = useUserStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (currentUser && isBroadcasting) {
      if (isPlayingSong && isCurrentSong) {
        pauseSong(currentUser._id, roomId, song._id);
      } else {
        playSong(currentUser._id, roomId, song._id, null);
      }
    } else if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <Button
      size={"icon"}
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
          isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-black" />
      ) : (
        <Play className="size-5 text-black" />
      )}
    </Button>
  );
};
export default PlayButton;
