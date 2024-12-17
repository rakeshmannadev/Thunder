import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import AlbumGrid from "@/Pages/Home/components/AlbumGrid.tsx";
import {Album} from "@/types";
import TopSongsSection from "@/Pages/Artist/TopSongsSection.tsx";

const ArtistPage = ()=>{
    const isLoading = false;
    const currentArtist = {
        name:'Arijit singh',
        image:"",
        type:"Singer",
        followers:423432423,
        fb:'',
        twitter:'',
        wiki:'',

    }
    const album:Album = [{
        _id: "34234",
        albumId: "42342",
        title:'Ek Villain',
        artist:'Arijit Singh',
        imageUrl:"/thunder_logo.png",

    },
        {
            _id: "34234",
            albumId: "42342",
            title:'Ek Villain',
            artist:'Arijit Singh',
            imageUrl:"/thunder_logo.png",

        }
    ]
    return <div className='h-full'>
        <ScrollArea className='h-full rounded-md'>

            <div className='relative min-h-screen'>
                <div
                    className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/40 to-zinc-900/20 pointer-events-none"
                    area-hidden="true"
                />
                {/*    content*/}
                <div className='relative z-10'>
                    <div className="flex flex-col md:flex-row  p-6 gap-6 pb-8">
                        {!isLoading && (
                            <img
                                src={currentArtist?.image}
                                alt=""
                                className="w-[240px] h-[240px] shadow-xl rounded"
                            />
                        )}
                        {isLoading && (
                            <Skeleton className="h-[240px] w-[240px] rounded"/>
                        )}
                        <div className="flex flex-col  justify-end">
                            <p className="text-sm font-medium">{currentArtist.type}</p>
                            {!isLoading && (
                                <h1 className="text-2xl md:text-7xl font-bold my-4">
                                    {currentArtist?.name}
                                </h1>
                            )}
                            {isLoading && <Skeleton className="h-10 w-[250px]"/>}
                            {!isLoading && (
                                <div className="flex items-center gap-2 text-sm text-zinc-100">
                                    <span>{currentArtist?.name}</span>
                                    <span>● {currentArtist?.twitter} Songs</span>
                                    <span>● {currentArtist?.wiki}</span>
                                </div>
                            )}
                            {isLoading && <Skeleton className="h-4 w-[250px] mt-5"/>}
                        </div>
                    </div>
                </div>
                <div className='space-y-8 p-5'>
                    <AlbumGrid title='Albums' songs={album} isLoading={isLoading} />
                    <AlbumGrid title='Singles' songs={album} isLoading={isLoading} />
                    <TopSongsSection />
                </div>

            </div>
        </ScrollArea>

    </div>
}

export default ArtistPage;