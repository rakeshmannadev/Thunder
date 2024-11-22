import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SatelliteDish } from 'lucide-react';
import Memberslist from './Memberslist';

const Chatheader = () => {
    const selectedUser ={
        fullName:"Arijit Singh",
        imageUrl:'google.png',

    }


	if (!selectedUser) return null;

	return (
		<div className=' flex justify-between p-4 border-b border-zinc-900'>
			<div className='flex items-center gap-3 text-nowrap'>
				<Avatar>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium'>{selectedUser.fullName}</h2>
					<Memberslist>
					<p className='text-sm hover:underline cursor-pointer text-zinc-400'>
						See members
					</p>
					</Memberslist>
					
				</div>
			</div>
			<div>
				<Button
				title='Broadcast song'
				variant='outline'
				>
					<SatelliteDish className='size-4' />
					<span className='hidden md:inline'>Broadcast Song</span>
				
				</Button>
			</div>
		</div>
	);
}

export default Chatheader