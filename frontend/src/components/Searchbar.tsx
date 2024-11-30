import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
            {!searchLoading &&
              searchedSongs?.length > 0 &&
              searchedSongs.map((song,idx) => (
                <CommandGroup>
                  <CommandItem key={idx}>
                    <Link
                      className="w-full flex gap-3 justify-start items-center"
                      to={`/album/${song.album.id}`}
                    >
                      <div>
                        <img
                          src={song.image[1].url}
                          alt={song.name}
                          className="size-10 rounded-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <p>{song.name}</p>
                        <p>{song.artists.primary[0]?.name}</p>
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
