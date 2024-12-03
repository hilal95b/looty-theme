import PriceOntainer from './PriceOntainer'

interface ViewHeaderProps {
	title: string;
	img: string;
}
const ViewHeader: React.FC<ViewHeaderProps> = ({ title, img }) => {

	return (
	<div className="relative w-full pb-60 md:pb-72 lg:pb-80 overflow-hidden rounded-2xl bg-[#f9dbb887]">
			<img src={img} alt={`Product Feature Image ${title}`} className="absolute object-cover w-full h-full" />
			<PriceOntainer price="7.00" />
		</div>
	)
}

export default ViewHeader
