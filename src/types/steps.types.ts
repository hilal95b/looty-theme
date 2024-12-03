export type ProductData = {
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
							product: { title: string };
							price: { amount: string; currencyCode: string };
							image: { url: string };
						}>;
					};
				}>;
			}>;
		};
	};
};

export type StepState = {
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

export type Action =
	| { type: "NEXT_STEP" }
	| { type: "PREVIOUS_STEP" }
	| { type: "SET_VALID"; payload: boolean }
	| { type: "SET_STEP_DATA"; payload: { stepIndex: number; data: unknown } }
	| { type: "SET_PENDING_NEXT_STEP"; payload: number }
	| { type: "SET_FETCHED_DATA"; payload: ProductData | null }
	| { type: "SET_SELECTION_TYPE"; payload: "multi-selection" | "single-selection" | "group-selection" | null };
