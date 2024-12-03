import { useState } from "react";
import { useSteps } from "../context/StepContext";

interface SelectedPrintableCardProps {
	onChangeMessage: (message: string) => void;
}

interface Metafield {
    key: string;
    value: string | null; // Allow null for value
    references?: {
        nodes: Array<{
            id: string;
            product: {
				title: string;
				variants?: {
					edges: Array<{
						node: {
							title: string;
							metafields: Array<{
								value: string
							}>
						}
					}>
				}
			};
            price: { amount: string; currencyCode: string };
            image: { url: string };
        }>;
    };
}

const SelectedPrintableCard: React.FC<SelectedPrintableCardProps> = ({ onChangeMessage }) => {

	const { state, dispatch } = useSteps();
	const [emptyPrintableCard, setEmptyPrintableCard] = useState(false);
	const [messageCount, setMessageCount] = useState(0);

	const currentStep = state.currentStep;
	const storedCard = state.steps[currentStep - 1]?.data;

	// Safely access 'metafields' with optional chaining
	const metafields: Metafield[] = state.fetchedData?.product?.variants?.nodes[0]?.metafields || [];
	const filteredData = metafields.filter((item) => item?.key === 'component_addons_2');
	const availableCards = filteredData[0]?.references?.nodes || [];
	const selectableCard = availableCards.find((item) => item.id === storedCard);
	
	const messageHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const messageLength = event.target.value.length; // Get the length of the text
		setMessageCount(messageLength); // Update state with the length
		onChangeMessage(event.target.value)
	};
	

	const handelChangeCard = () => {
		onChangeMessage('')
		dispatch({ type: "PREVIOUS_STEP" });
	};

	const handelRemoveCard = () => {
		setEmptyPrintableCard(true);
		onChangeMessage('')

		// const stepData = state?.steps[7]?.data as { addons1?: { printable_card?: boolean } };
		const stepData = state?.steps[7]?.data as { addons1?: Array<{ id: string; quintaty: number }> };
		const updatedAddons1 = stepData?.addons1?.map((addon) => ({
			...addon
		}));
		dispatch({
			type: "SET_STEP_DATA",
			payload: {
				stepIndex: 7,
				data: {
					addons1: updatedAddons1,
					printable_card: false,
				},
			},
		});

		dispatch({
			type: "SET_STEP_DATA",
			payload: {
				stepIndex: 8,
				data: null,
			},
		});
	};

	console.log('state last one ==>', state);


	if (!selectableCard || emptyPrintableCard) {
		return (
			<div className="col-span-2 mb-2">
				{/* Add Printable Card Button */}
				<button
					type="button"
					onClick={handelChangeCard}
					className="flex items-center gap-4"
				>
					<div className="h-20 w-20 border border-dashed border-gray-300 rounded-lg flex justify-center items-center">
						+
					</div>
					<div className="flex flex-col gap-1">
						<span className="h4 text-xl">Add Printable Card?</span>
						<div className="flex gap-2">
							<span className="text-gray-600 text-lg font-medium">Start from</span>
							<span className="text-blue-400 text-lg font-medium">+1 JOD</span>
						</div>
					</div>
				</button>
			</div>
		);
	}

	// Extract card details
	const { image, price, product } = selectableCard;
	const { amount, currencyCode } = price || {};
	const selectedCardIndex = availableCards.findIndex((item) => item.id === storedCard);
	const cardTitle =
		product?.variants?.edges?.[selectedCardIndex]?.node?.title || "Card Title";
	const maxCharachter =
		product?.variants?.edges?.[selectedCardIndex]?.node?.metafields?.[0]?.value || "N/A";

	return (
		<div className="col-span-2">
			{/* Selected Card Information */}
			<div className="flex gap-3 col-span-2 mb-6 items-center">
				<img
					src={image?.url || ""}
					alt={cardTitle}
					className="w-20 h-20 rounded-lg"
				/>
				<div className="flex justify-between items-center w-full">
					<div className="flex flex-col gap-2">
						<span className="text-lg font-medium capitalize">{cardTitle}</span>
						<span className="text-blue-600 text-lg font-medium">{amount} {currencyCode}</span>
					</div>
					<div className="flex flex-col gap-3">
						<button
							onClick={handelChangeCard}
							type="button"
							className="text-blue-600 text-lg font-medium"
						>
							Change Card
						</button>
						<button
							onClick={handelRemoveCard}
							type="button"
							className="text-red-500 text-lg font-medium"
						>
							Remove Card
						</button>
					</div>
				</div>
			</div>

			{/* Message Section */}
			<div className="flex flex-col gap-2 col-span-2">
				<label htmlFor="message" className="text-lg font-medium">
					Message:
				</label>
				<textarea
					rows={4}
					id="message"
					maxLength={Number(maxCharachter)}
					onChange={messageHandler}
					placeholder="Message on printable card"
					className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md w-full resize-none"
				/>
				<div className="flex justify-end text-base">
					<span>{messageCount}/{maxCharachter} Charachters</span>
				</div>
			</div>
		</div>
	);
};

export default SelectedPrintableCard;
