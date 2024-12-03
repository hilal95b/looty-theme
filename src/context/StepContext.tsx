import React, { createContext, useReducer, useContext, useEffect } from "react";

// Define ProductData Type
type ProductData = {
	product: {
		title: string;
		featuredImage: {
			id: string;
			url: string;
		};
		variants: {
			nodes: Array<{
				price: { amount: string; currencyCode: string };
				metafields: Array<{
					key: string;
					value: string | null;
					references?: {
						nodes: Array<{
							id: string;
							product: {
								title: string;
							};
							price: { amount: string; currencyCode: string };
							image: { url: string };
						}>;
					};
				}>;
			}>;
		};
	};
};

// Define StepState Type
type StepState = {
	currentStep: number;
	steps: Array<{
		title: string;
		subTitle: string;
		isValid: boolean;
		data: unknown;
	}>;
	pendingNextStep?: number;
	history: number[];
	fetchedData: ProductData | null;
	selectionType: "multi-selection" | "single-selection" | "group-selection" | null;
};

// Define Action Types
	type Action =
	| { type: "NEXT_STEP" }
	| { type: "PREVIOUS_STEP" }
	| { type: "SET_VALID"; payload: boolean }
	| { type: "SET_STEP_DATA"; payload: { stepIndex: number; data: unknown } }
	| { type: "SET_PENDING_NEXT_STEP"; payload: number }
	| { type: "SET_FETCHED_DATA"; payload: ProductData | null }
	| { type: "SET_SELECTION_TYPE"; payload: "multi-selection" | "single-selection" | "group-selection" | null };

// Initial Steps Configuration
const initialSteps = [
	{ title: "Delivery", subTitle: "Choose delivery Method", isValid: false, data: null },
	{ title: "City", subTitle: "Choose delivery to location", isValid: false, data: null },
	{ title: "Preparation", subTitle: "Preparation Type", isValid: false, data: null },
	{ title: "Select Sandwichs", subTitle: "Choose multiple options from Sandwichs", isValid: false, data: null },
	{ title: "Select Sandwich", subTitle: "Choose one option", isValid: false, data: null },
	{ title: "Select Drink", subTitle: "Choose one option", isValid: false, data: null },
	{ title: "Box Title", subTitle: "Select Title Print On The Box", isValid: false, data: null },
	{ title: "Add-Ons", subTitle: "Add Speatal your addons", isValid: false, data: null },
	{ title: "Printable Card Type", subTitle: "Select printable cards type", isValid: false, data: null },
	{ title: "Additional Information", subTitle: "Provide additional information", isValid: false, data: null },
];

// Initial State
const initialState: StepState = {
	currentStep: 0,
	steps: initialSteps,
	history: [],
	fetchedData: null,
	selectionType: null, // Add selectionType state
};

// Create Context
const StepsContext = createContext<{
	state: StepState;
	dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => { } });

// Reducer Function
const stepsReducer = (state: StepState, action: Action): StepState => {
	switch (action.type) {
		case "NEXT_STEP": {
			let nextStep = state.currentStep + 1;
		
			// Navigation Logic
			if (state.currentStep === 2) {
				// On Preparation Step
				if (state.selectionType === "single-selection") {
					nextStep = 4; // Skip MultiSelection, go to SingleSelection1
				} else if (state.selectionType === "multi-selection") {
					nextStep = 3; // Go to MultiSelection
				}
			}
		
			return {
				...state,
				history: [...state.history, state.currentStep], // Push current step to history
				currentStep: state.pendingNextStep ?? Math.min(nextStep, state.steps.length - 1),
				pendingNextStep: undefined, // Reset after navigation
			};
		}

		case "PREVIOUS_STEP":
			return {
				...state,
				currentStep: state.history[state.history.length - 1] || 0, // Navigate to the last step in history or fallback to 0
				history: state.history.slice(0, -1), // Remove the last step from history
			};

		case "SET_VALID":
			return {
				...state,
				steps: state.steps.map((step, index) =>
					index === state.currentStep ? { ...step, isValid: action.payload } : step
				),
			};

		case "SET_STEP_DATA":
			return {
				...state,
				steps: state.steps.map((step, index) =>
					index === action.payload.stepIndex ? { ...step, data: action.payload.data } : step
				),
			};

		case "SET_PENDING_NEXT_STEP":
			return { ...state, pendingNextStep: action.payload };

		case "SET_FETCHED_DATA":
			if (!action.payload || typeof action.payload !== "object") {
				throw new Error("Invalid fetched data payload");
			}
			return { ...state, fetchedData: action.payload };
			

		case "SET_SELECTION_TYPE":
			return { ...state, selectionType: action.payload };

		default:
			return state;
	}
};

// StepsProvider Component
export const StepsProvider: React.FC<React.PropsWithChildren<{ productHandle: string }>> = ({ children, productHandle }) => {

	console.log('product data json ===>', productHandle);
	const [state, dispatch] = useReducer(stepsReducer, initialState);

	// Fetch Product Data
	useEffect(() => {
		const fetchProductData = async () => {
			const query = `
				query MyQuery {
					product(handle: "${productHandle}") {
						title
						featuredImage {
						id
						url
						}
						variants(first: 1) {
						nodes {
							price {
							amount
							currencyCode
							}
							metafields(
								identifiers: [
									{key: "box_title", namespace: "custom"},
									{key: "component_group_1", namespace: "custom"},
									{key: "component_group_1_items_count", namespace: "custom"},
									{key: "component_group_1_items_count_group", namespace: "custom"},
									{key: "component_group_2", namespace: "custom"}, {key: "component_addons_1",namespace: "custom"},
									{key: "component_addons_1_maximum", namespace: "custom"}, {key: "component_addons_2", namespace: "custom"},
									{key: "component_addons_2_max_characters", namespace: "custom"}
								]
							) {
							value
							references(first: 10) {
								nodes {
								... on ProductVariant {
									id
									product {
									title
									variants(first: 10) {
										edges {
										node {
											title
											metafields(
											identifiers: {key: "component_addons_2_max_characters", namespace: "custom"}
											) {
											value
											}
										}
										}
									}
									}
									price {
									amount
									currencyCode
									}
									image {
									url
									}
								}
								}
							}
							key
							type
							}
						}
						}
					}
					}
      		`;

			try {
				const response = await fetch("/api/2024-10/graphql.json", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Shopify-Storefront-Access-Token": "66e7ba2f51ab468ba63087b9bb1f4cd9",
					},
					body: JSON.stringify({ query }),
				});

				const data = await response.json();
				if (data && data.data?.product) {
					dispatch({ type: "SET_FETCHED_DATA", payload: data.data as ProductData });
				} else {
					throw new Error("Invalid product data structure");
				}

				const metafields = data.data.product.variants.nodes[0]?.metafields as Array<{ key: string; value: string | null } | null>;
				const validMetafields = metafields?.filter((mf) => mf !== null && mf.key) || []; // Filter out null or undefined metafields
				const group1Exists = validMetafields.find((mf) => mf?.key === "component_group_1" && mf.value);
				const group2Exists = validMetafields.find((mf) => mf?.key === "component_group_2" && mf.value);				
				
				if (group1Exists && group2Exists) {
					dispatch({ type: "SET_SELECTION_TYPE", payload: "single-selection" });
				} else if (group1Exists) {
					dispatch({ type: "SET_SELECTION_TYPE", payload: "multi-selection" });
				}
			} catch (error) {
				console.error("Error fetching product data:", error);
			}
		};

		fetchProductData();
	}, [productHandle]);

	return (
		<StepsContext.Provider value={{ state, dispatch }}>
			{children}
		</StepsContext.Provider>
	);
};

// Custom Hook to Access Context
export const useSteps = () => useContext(StepsContext);
