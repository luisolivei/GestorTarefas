import React from 'react'

const AvatarGroup = ({ avatars, maxVisible=3 }) => {
   const displayedAvatars = avatars.slice(0, maxVisible);

		return (
			<div className='flex items-center'>
				{displayedAvatars.map((avatar, index) =>
					avatar ? (
						<img key={index} src={avatar} alt={`Avatar ${index}`} className='w-9 h-9 rounded-full border border-white -ml-3 first:ml-0' />
					) : (
						<div key={index} className='w-9 h-9 rounded-full bg-gray-200 border border-gray-300 -ml-3 first:ml-0' />
					),
				)}

				{avatars.length > maxVisible && (
					<div className='w-9 h-9 flex justify-center items-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3'>+{avatars.length - maxVisible}</div>
				)}
			</div>
		);
}

export default AvatarGroup
