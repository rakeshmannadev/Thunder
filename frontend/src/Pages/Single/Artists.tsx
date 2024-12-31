import { Link } from "react-router-dom";

interface ArtistsProps {
  id: string |null;
  artistId: string;
  name: string;
  role: string;
  type: string;
  image: [{ url: string }, { url: string }, { url: string }] | any;
}


const Artists = ({ artist,playlistPage }: { artist: ArtistsProps,playlistPage:boolean }) => {
  const isUser = artist.role === "user" ? true:false;
  return (
    <Link
      to={`/${isUser ? 'user':'artist'}/${playlistPage ?artist.artistId :artist.id}`}
      className="rounded-lg border text-card-foreground shadow-sm group w-32 cursor-pointer border-none bg-transparent transition-shadow duration-200 hover:bg-accent hover:shadow-md sm:w-36 sm:border-solid md:w-48 lg:w-56"
      title={`View ${artist.name}`}
    >
      <div className="size-full p-2">
        <div className="relative w-full overflow-hidden aspect-square rounded-full border">
          <div className="absolute inset-0 z-10">
            <span className="sr-only">View Devi Sri Prasad</span>
          </div>
          <img
            alt={artist.name}
            loading="lazy"
            width="200"
            height="200"
            decoding="async"
            data-nimg="1"
            className="size-full object-cover bg-transparent transition-transform duration-300 group-hover:scale-110"
            src={!playlistPage ?artist.image[2].url:artist.image}
          />
        </div>
        <div className="mt-1 flex w-full flex-col items-center justify-between">
          <h4 className="w-full font-semibold lg:text-lg">
            <div className="mx-auto flex max-w-fit items-center">
              <span className="truncate">{artist.name}</span>
            </div>
          </h4>
        </div>
      </div>
    </Link>
  );
};

export default Artists;
