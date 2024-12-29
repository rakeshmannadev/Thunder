import { Link } from "react-router-dom";

const Artists = () => {
  return (
    
      <div
        className="rounded-lg border text-card-foreground shadow-sm group w-32 cursor-pointer border-none bg-transparent transition-shadow duration-200 hover:bg-accent hover:shadow-md sm:w-36 sm:border-solid md:w-48 lg:w-56"
        title="Devi Sri Prasad"
      >
        <div className="size-full p-2">
          <div className="relative w-full overflow-hidden aspect-square rounded-full border">
            <Link className="absolute inset-0 z-10" to={`/artist/M0dlT,PMjDs_`}>
              <span className="sr-only">View Devi Sri Prasad</span>
            </Link>
            <img
              alt="Devi Sri Prasad"
              loading="lazy"
              width="200"
              height="200"
              decoding="async"
              data-nimg="1"
              className="size-full object-cover bg-transparent transition-transform duration-300 group-hover:scale-110"
              src="https://c.saavncdn.com/artists/Devi_Sri_Prasad_007_20240902064823_500x500.jpg"
            />
          </div>
          <div className="mt-1 flex w-full flex-col items-center justify-between">
            <h4 className="w-full font-semibold lg:text-lg">
              <Link
                className="mx-auto flex max-w-fit items-center"
                to={`/artist/M0dlT,PMjDs_`}
              >
                <span className="truncate">Devi Sri Prasad</span>
              </Link>
            </h4>
          </div>
        </div>
      </div>
   
  );
};

export default Artists;
