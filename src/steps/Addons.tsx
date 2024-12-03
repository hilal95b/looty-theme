import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import ItemSelection from "../components/ItemSelection";
import CheckboxSelection from "../components/CheckboxSelection";

type ChangeType = {
	id: string;
	quintaty: number;
};

const Addons = () => {
	const { state, dispatch } = useSteps();
	const [totalSelected, setTotalSelected] = useState<number>(0);

// Check if savedSelection is not null before trying to access its properties
const savedSelection = (state?.steps[state.currentStep]?.data as { addons1?: Array<{ id: string; quintaty: number }>, printable_card?: boolean }) || null;

// Safely map over addons1 if savedSelection is not null
const addons = savedSelection?.addons1?.map((addon) => ({
    ...addon,
})) || []; // Default to an empty array if addons1 is undefined

const initvalue = {
    addons1: addons,
    printable_card: savedSelection?.printable_card || false, // Default to false if printable_card is undefined
};

const [addons1Selections, setAddons1Selections] = useState<ChangeType[]>(initvalue.addons1);
const [printableCard, setPrintableCard] = useState<boolean>(initvalue.printable_card);


	// Safely access fetched data
	const metafields = state.fetchedData?.product.variants.nodes[0].metafields || [];

	// Addon Rose Selections
	const addons1MaxSelection = parseInt(metafields[6]?.value || "1", 10);
	const addons1VariantsProducts = metafields[5]?.references?.nodes || [];

	// Addon Printable Card Selections
	const addons2VariantsProducts = metafields[7]?.references?.nodes || [];

	const updateTotalSelected = (change: ChangeType) => {
		setTotalSelected((prev) => 
			Math.min(addons1MaxSelection, Math.max(0, prev + change.quintaty))
		);
	
		setAddons1Selections((prevSelections) => {
			const existingIndex = prevSelections.findIndex((item) => item.id === change.id);
			const updatedSelections = [...prevSelections];
	
			if (existingIndex >= 0) {
				// Update existing item
				const updatedItem = { ...updatedSelections[existingIndex] };
				updatedItem.quintaty += change.quintaty;
	
				if (updatedItem.quintaty > 0) {
					updatedSelections[existingIndex] = updatedItem;
				} else {
					// Remove item if quantity becomes 0 or less
					updatedSelections.splice(existingIndex, 1);
				}
			} else if (change.quintaty > 0) {
				// Add new item if quantity is positive
				updatedSelections.push(change);
			}
	
			return updatedSelections;
		});
	};
	

	const updateHandelSelected = (value: boolean) => {
		setPrintableCard(value);
	};

	useEffect(() => {

		// Dispatch updated data with printable card selection
		dispatch({
			type: "SET_STEP_DATA",
			payload: {
				stepIndex: state.currentStep,
				data: {
					addons1: addons1Selections,
					printable_card: printableCard,
				},
			},
		});

		if (!printableCard) {
			dispatch({
				type: "SET_STEP_DATA",
				payload: {
					stepIndex: 8,
					data: null,
				},
			})
		}


		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: printableCard ? 8 : 9 });

	}, [addons1Selections, printableCard, dispatch, state.currentStep]);

	console.log('state =>', state);

	return (
		<div className="px-8 py-8 sm:px-0">
			<ul className="flex flex-col gap-6">
				{/* Addons Printable Card */}
				{addons2VariantsProducts.length > 0 && (
					<CheckboxSelection
						id={"printable-card"}
						title={addons2VariantsProducts[0].product.title}
						image={addons2VariantsProducts[0].image.url}
						price={"1"}
						currency={addons2VariantsProducts[0].price.currencyCode}
						optional={true}
						thubanailRounded="rounded-xl"
						stepIndex={state.currentStep}
						handelSelected={updateHandelSelected}
					/>
				)}
				{addons1VariantsProducts.map(
					(
						item: {
							id: string;
							product: {
								title: string;
								variants?: {
									edges: {
										node: { title: string };
									}[];
								}; // Make 'variants' optional
							};
							image: { url: string };
							price: { amount: string; currencyCode: string };
						},
						idx: number
					) => (
						<ItemSelection
							key={idx}
							id={item.id}
							title={item.product.variants?.edges[idx]?.node?.title || item.product.title}
							image={item.image.url}
							price={item.price.amount}
							currency={item.price.currencyCode}
							optional={true}
							type="multi-selection"
							maxQuintaty={String(addons1MaxSelection)}
							totalSelected={totalSelected}
							maxSelection={addons1MaxSelection}
							groupQuintaty={1}
							thubanailRounded="rounded-xl"
							stepIndex={state.currentStep}
							updateTotalSelected={updateTotalSelected}
						/>
					)
				)}
			</ul>
		</div>
	);
};

export default Addons;

