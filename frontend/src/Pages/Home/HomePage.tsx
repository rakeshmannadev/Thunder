import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import useMusicStore from "@/store/useMusicStore";
import { useEffect } from "react";
import AlbumGrid from "./components/AlbumGrid";
import { getGreetingMessage } from "@/utils/getGreetingMessage";



const HomePage = () => {

  const {isLoading,madeForYouAlbums,trending,fetchMadeForYouAlbums,fetchTrendingSongs} = useMusicStore()


  useEffect(()=>{
	if(madeForYouAlbums.length <=0 || trending.length <=0)
    fetchMadeForYouAlbums();
    fetchTrendingSongs();
  },[fetchMadeForYouAlbums,fetchTrendingSongs])




  return (

    <main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Header />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>{getGreetingMessage()}</h1>
					<FeaturedSection />

					<div className='space-y-8'>
						<AlbumGrid title='Made For You' songs={madeForYouAlbums}  isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trending} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
  );
};

export default HomePage;
