import { useState } from "react";
import { useSteps } from "../context/StepContext";

type PrintableCardType = {
	id: string;
	image: { url: string };
	product: {
		title: string;
		variants?: {
			edges: {
				node: {
					title: string;
					metafields: { value: string }[];
				};
			}[];
		};
	};
	price: {
		amount: string;
		currencyCode: string;
	};
};

const PrintableCards = () => {
	const { state, dispatch } = useSteps();
	const stepIndex = state.currentStep;

	// Retrieve the previously selected card ID from global state (step data)
	const rawSavedCardId = state.steps[stepIndex].data;
	const savedCardId = typeof rawSavedCardId === "string" ? rawSavedCardId : null;
	const [selectedCard, setSelectedCard] = useState<string | null>(savedCardId);

	// Safely access fetched data
	const metafields = state.fetchedData?.product.variants.nodes[0].metafields || [];
	const printableCards: PrintableCardType[] = metafields[7]?.references?.nodes || []; // Default to empty array

	const handleCardSelection = (id: string) => {
		setSelectedCard(id); // Set the selected card locally

		// Save the selected card ID to the global state
		dispatch({
			type: "SET_STEP_DATA",
			payload: { stepIndex, data: id },
		});

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
					printable_card: true,
				},
			},
		});
		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: stepIndex + 1 });
	};

	return (
		<div className="px-8 py-8 sm:px-0">
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-0">
				{printableCards.map((card, idx) => (
					<div
						key={idx}
						id={card.id}
						onClick={() => handleCardSelection(card.id)}
						className={`flex flex-col gap-3 rounded-xl p-3 cursor-pointer ${selectedCard === card.id ? "bg-[#f9dbb8]" : "bg-transparent"
							} ease-in-out duration-300`}
					>
						<div className="relative">
							<img
								src={card.image.url}
								alt={`Printable card ${card.product.variants?.edges[idx]?.node?.title || card.product.title
									} thumbnail`}
								className="rounded-xl"
							/>
							<span className="absolute bottom-2 py-2 px-4 rounded-full left-1/2 block w-3/4 text-center -translate-x-1/2 bg-white text-base font-medium">
								Max: {card.product.variants?.edges[idx]?.node?.metafields[0]?.value || "N/A"} Char
							</span>
						</div>
						<div className="flex flex-col">
							<p className="h3 capitalize text-center text-xl line-clamp-1">
								{card.product.variants?.edges[idx]?.node?.title || card.product.title}
							</p>
							<span className="text-blue-600 font-medium text-lg text-center">
								+{card.price.amount} {card.price.currencyCode}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default PrintableCards;
