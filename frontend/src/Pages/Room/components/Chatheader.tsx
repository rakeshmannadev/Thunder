import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Chatheader = () => {
    const selectedUser ={
        fullName:"Arijit Singh",
        imageUrl:'google.png',

    }


	if (!selectedUser) return null;

	return (
		<div className='p-4 border-b border-zinc-800'>
			<div className='flex items-center gap-3'>
				<Avatar>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium'>{selectedUser.fullName}</h2>
					<p className='text-sm text-zinc-400'>
						Online 
					</p>
				</div>
			</div>
		</div>
	);
}

export default Chatheader