import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import useDebounceSearch from "@/hooks/useDebouceSearch";
import { Link } from "react-router-dom";
import useMusicStore from "@/store/useMusicStore";

const Searchbar = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { searchSong, searchedSongs, searchLoading } = useMusicStore();
  const debouncedValue = useDebounceSearch(value, 1000);

  useEffect(() => {
    if (debouncedValue?.length > 0) {
      searchSong(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="md:w-[300px] justify-between"
        >
          Search a song...
          <Search className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search a song..."
            onValueChange={(value) => setValue(value)}
          />
          <CommandList>
            <CommandEmpty>No song found.</CommandEmpty>
            {searchedSongs && (
              <p className="text-sm font-bold p-3">Top Result:</p>
            )}
            {!searchLoading &&
              searchedSongs &&
              searchedSongs.topQuery.results.map((result, idx) => (
                <CommandGroup key={idx}>
                  {/*  TopQuery result section */}
                  <CommandItem >
                    <Link
                      className="w-full flex gap-3 justify-start items-center"
                      to={`/${result.type}/${result.id}`}
                    >
                      <div>
                        <img
                          src={result.image[0].url}
                          alt={result.title}
                          className="size-10 rounded-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <p>{result.title}</p>
                        <p>
                          {result?.type.charAt(0).toUpperCase() +
                            result.type.slice(1)}
                        </p>
                      </div>
                    </Link>
                  </CommandItem>
                </CommandGroup>
              ))}
            {searchedSongs && (
              <>
                <CommandSeparator />
                <p className="text-sm font-bold p-3">Songs:</p>
              </>
            )}
            {!searchLoading &&
              searchedSongs &&
              searchedSongs.songs.results.map((result, idx) => (
                <CommandGroup key={idx}>
                  <CommandItem >
                    <Link
                      className="w-full flex gap-3 justify-start items-center"
                      to={`/song/${result.id}`}
                    >
                      <div>
                        <img
                          src={result.image[0].url}
                          alt={result.title}
                          className="size-10 rounded-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <p>{result.title}</p>
                        <p>{result.singers}</p>
                      </div>
                    </Link>
                  </CommandItem>
                </CommandGroup>
              ))}
            {searchedSongs && (
              <>
                <CommandSeparator />
                <p className="text-sm font-bold p-3">Albums:</p>
              </>
            )}
            {!searchLoading &&
              searchedSongs &&
              searchedSongs.albums.results.map((result, idx) => (
                <CommandGroup key={idx}>
                  <CommandItem >
                    <Link
                      className="w-full flex gap-3 justify-start items-center"
                      to={`/album/${result.id}`}
                    >
                      <div>
                        <img
                          src={result.image[0].url}
                          alt={result.title}
                          className="size-10 rounded-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <p>{result.title}</p>
                        <p>{result.artist}</p>
                      </div>
                    </Link>
                  </CommandItem>
                </CommandGroup>
              ))}
            {searchedSongs && (
              <>
                <CommandSeparator />
                <p className="text-sm font-bold p-3">Playlists:</p>
              </>
            )}
            {!searchLoading &&
              searchedSongs &&
              searchedSongs.playlists.results.map((result, idx) => (
                <CommandGroup key={idx}>
                  <CommandItem >
                    <Link
                      className="w-full flex gap-3 justify-start items-center"
                      to={`/playlist/${result.id}`}
                    >
                      <div>
                        <img
                          src={result.image[0].url}
                          alt={result.title}
                          className="size-10 rounded-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <p>{result.title}</p>
                        <p>{result.type}</p>
                      </div>
                    </Link>
                  </CommandItem>
                </CommandGroup>
              ))}

            {searchLoading &&
              Array.from({ length: 10 }).map((_, idx) => (
                <CommandGroup>
                  <CommandItem key={idx}>
                    <div className="w-full flex  justify-start items-center gap-3  animate-pulse">
                      <div className="h-12 w-12 rounded-sm bg-zinc-800" />
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="h-4 w-28  bg-zinc-800" />
                        <div className="h-4 w-20   bg-zinc-800" />
                      </div>
                    </div>
                  </CommandItem>
                </CommandGroup>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Searchbar;
