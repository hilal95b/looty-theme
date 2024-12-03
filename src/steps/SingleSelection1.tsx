import { useState } from "react";
import { useSteps } from "../context/StepContext";
import ItemSelection from "../components/ItemSelection";

type ChangeType = {
	id: string;
	quintaty: number;
};

const SingleSelection1 = () => {
	const { state, dispatch } = useSteps();
	const [totalSelected, setTotalSelected] = useState<number>(0);

	// Safely access fetched data
	const metafields = state.fetchedData?.product.variants.nodes[0].metafields || [];
	const maxSelection = parseInt(metafields[2]?.value || "1", 10); // Default to 1 if not present
	const variantsProducts = metafields[1]?.references?.nodes || []; // Default to empty array

	const updateTotalSelected = (change: ChangeType) => {
		
		setTotalSelected((prev) => Math.min(maxSelection, Math.max(0, prev + change.quintaty)));
			// Save the selected preparation option
			dispatch({
				type: "SET_STEP_DATA",
				payload: { stepIndex: state.currentStep, data: change },
			});
	
			// Mark the step as valid
			dispatch({ type: "SET_VALID", payload: true });
			dispatch({ type: "SET_PENDING_NEXT_STEP", payload: 5 });
	};

	console.log('State =>', state);

	return (
		<div className="px-8 py-8 sm:px-0">
			<ul className="flex flex-col gap-6">
				{variantsProducts.map(
					(
						item: {
							id: string;
							product: { title: string };
							image: { url: string };
							price: { amount: string; currencyCode: string };
						},
						idx: number
					) => (
						<ItemSelection
							key={idx}
							id={item.id}
							title={item.product.title}
							image={item.image.url}
							price={item.price.amount}
							currency={item.price.currencyCode}
							type={state.selectionType || "single-selection"} // Ensure non-null value
							maxQuintaty={String(maxSelection)} // Convert number to string
							totalSelected={totalSelected}
							maxSelection={maxSelection}
							groupQuintaty={Number(metafields[3]?.value || 1)}
							thubanailRounded="rounded-full"
							stepIndex={state.currentStep}
							updateTotalSelected={updateTotalSelected}
						/>
					)
				)}
			</ul>
		</div>
	);
};

export default SingleSelection1;
