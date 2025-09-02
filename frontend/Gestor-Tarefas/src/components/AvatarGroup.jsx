

// Componente para mostrar um grupo de avatares
// Props:
//   - avatars    → array de URLs das imagens de avatar
//   - maxVisible → número máximo de avatares a mostrar (padrão: 3)
const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
   // Seleciona apenas os primeiros avatares a mostrar
   const displayedAvatars = avatars.slice(0, maxVisible);

   return (
      <div className='flex items-center'>
         {/* Renderiza cada avatar visível */}
         {displayedAvatars.map((avatar, index) =>
            avatar ? (
               // Mostra imagem se existir
               <img 
                  key={index} 
                  src={avatar} 
                  alt={`Avatar ${index}`} 
                  className='w-9 h-9 rounded-full border border-white -ml-3 first:ml-0' 
               />
            ) : (
               // Mostra placeholder caso não exista imagem
               <div 
                  key={index} 
                  className='w-9 h-9 rounded-full bg-gray-200 border border-gray-300 -ml-3 first:ml-0' 
               />
            )
         )}

         {/* Mostra "+X" se houver mais avatares do que o limite */}
         {avatars.length > maxVisible && (
            <div className='w-9 h-9 flex justify-center items-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3'>
               +{avatars.length - maxVisible}
            </div>
         )}
      </div>
   );
};

export default AvatarGroup;
