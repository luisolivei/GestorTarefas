// Componente InfoCard que recebe 3 props: label, value e color
const InfoCard = ({ label, value, color }) => {
	return (
		// Contêiner principal com flexbox para alinhar elementos lado a lado
		<div className='flex items-center gap-3'>
			<div className={`w-2 md:w-2 h-3 md:h-5 ${color} rounded-full`} />
			{/* Texto com valor em destaque e label descritivo ao lado */}
			<p className='text-xs md:text-[14px] text-gray-500'>
				<span className='text-sm md:text-[15px] text-black font-semibold'>{value}</span> {label}
			</p>
		</div>
	);
};

// Exportação do componente para ser usado noutros ficheiros
export default InfoCard;
