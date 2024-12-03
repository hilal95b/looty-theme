import { useSteps } from "../context/StepContext";

const Preparation = () => {

	const { state, dispatch } = useSteps();
	const selectionType = state.selectionType;

	// Retrieve the selected city from Locations step (if applicable)
	const deliveryOption = state.steps[0]?.data;
	const selectedCity = state.steps[1]?.data;

	const isBakedAvailable =
		deliveryOption === "Pick Up From Shop" || selectedCity === "Amman";

	const handleSelection = (value: string) => {
		// Save the selected preparation option
		dispatch({
			type: "SET_STEP_DATA",
			payload: { stepIndex: state.currentStep, data: value },
		});

		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
		// Conditional navigation logic
		switch (selectionType) {
			case "single-selection":
				dispatch({ type: "SET_PENDING_NEXT_STEP", payload: 4 }); // Skip MultiSelection
				break;
			case "multi-selection":
				dispatch({ type: "SET_PENDING_NEXT_STEP", payload: 3 }); // Go to MultiSelection
				break;
			default:
				console.warn("Unknown selection type:", selectionType);
				// You can set a fallback step or log this for debugging
		}
	};

	// Retrieve the selected preparation from state
	const selectedPreparation = state.steps[state.currentStep]?.data;

	console.log('State =>', state);

	return (
		<div className="px-8 py-8 sm:px-0">
			<div className="grid grid-cols-2 gap-8">
				<div className="flex flex-col gap-3">
					<label
						htmlFor="Baked"
						className={`
							cursor-pointer relative flex flex-col gap-6 items-center border rounded-lg p-6 text-2xl font-medium h3 text-center ease-in-out duration-300
							${selectedPreparation === "Baked" ? "border-[#5a0616] bg-[#f9dbb8] text-[#5a0616]" : "border-gray-200 bg-gray-100"}
							${!isBakedAvailable ? "opacity-50 pointer-events-none" : ""}
						`}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="39.527" height="53.797" viewBox="0 0 39.527 53.797"><path d="M99.461,31.6h-.038a6.827,6.827,0,0,0,1.512-4.253c-.038-2.346-1.441-4.641-4.168-6.821a5.794,5.794,0,0,0,.213-3.022c-.793-3.918-5.044-5.482-8.945-6.352a5.051,5.051,0,0,0-2.423-5.891c1.562-3.171,3.644-3.522,4.482-3.522a4.5,4.5,0,0,1,2.126.434.87.87,0,1,0,.82-1.535A6.19,6.19,0,0,0,90.093,0a6.036,6.036,0,0,0-4.531,2.223A10.471,10.471,0,0,0,83.946,4.7a5.051,5.051,0,0,0-5.167,2.541,5.655,5.655,0,0,1-.913-1.326.871.871,0,0,0-1.213-.386A13.256,13.256,0,0,0,71,11.321a11.724,11.724,0,0,0-1.165,5c-.074.029-.147.057-.215.086a6,6,0,0,0-3.762,5.322,9.605,9.605,0,0,0,.153,2.552A5.04,5.04,0,0,0,62.974,31.6h-.7a.871.871,0,0,0-.85,1.065l4.319,19A2.717,2.717,0,0,0,68.411,53.8H93.329a2.717,2.717,0,0,0,2.663-2.125l4.319-19a.872.872,0,0,0-.85-1.065ZM83.194,6.391A3.311,3.311,0,1,1,79.882,9.7,3.315,3.315,0,0,1,83.194,6.391ZM68.411,52.054a.983.983,0,0,1-.963-.769L63.371,33.347h2.82l3.115,18.278a3.237,3.237,0,0,0,.1.429Zm3.115,0c-.158,0-.42-.251-.5-.722L67.96,33.347H70.8l2.072,18.23a4.127,4.127,0,0,0,.082.477Zm3.272,0a1.673,1.673,0,0,1-.2-.674L72.551,33.347H75.4l1.033,18.181q.016.28.048.526Zm5.2,0H78.247a4.517,4.517,0,0,1-.075-.625L77.145,33.347H80Zm3.569-.625a4.516,4.516,0,0,1-.075.625H81.741V33.347H84.6Zm3.374.625H85.259q.033-.246.048-.526l1.033-18.181h2.848L87.14,51.38A1.671,1.671,0,0,1,86.942,52.054Zm3.272,0H88.789a4.1,4.1,0,0,0,.082-.477l2.071-18.23H93.78L90.715,51.332C90.635,51.8,90.373,52.054,90.214,52.054Zm4.078-.769a.983.983,0,0,1-.963.769h-1a3.237,3.237,0,0,0,.1-.429l3.116-18.278h2.821ZM97.067,31.6H83.7a63.414,63.414,0,0,0,6.889-4.136.871.871,0,1,0-1-1.427,68.209,68.209,0,0,1-9.84,5.563H65.094a3.605,3.605,0,0,1-.9-3.372,3.887,3.887,0,0,1,3.295-2.558c1.655-.331,6.032-1.253,10.914-2.656a.871.871,0,1,0-.482-1.675c-4.352,1.251-8.3,2.114-10.224,2.511-.266-1.434-.442-4.54,2.607-5.847a36.794,36.794,0,0,1,6.087-1.4l.844-.154a.871.871,0,0,0-.315-1.714l-.841.154c-1.631.3-3.2.584-4.489.9a10.417,10.417,0,0,1,5.174-8.3,8.228,8.228,0,0,0,.922,1.135c.188.194.348.345.488.467a5.051,5.051,0,0,0,9.037,3.663A23.219,23.219,0,0,1,91.5,14.044a.805.805,0,0,1,.128.756c-.216.678-1.567,2.543-9.408,5.2a.871.871,0,1,0,.56,1.65,43.794,43.794,0,0,0,6.777-2.831c2.134-1.17,3.355-2.313,3.731-3.494.028-.087.05-.174.069-.261a4.488,4.488,0,0,1,1.912,2.785c.321,1.584-.4,3.332-2.14,5.2a.871.871,0,0,0,1.274,1.189A12.592,12.592,0,0,0,96,22.159c2.087,1.752,3.159,3.507,3.187,5.221A5.876,5.876,0,0,1,97.067,31.6Z" transform="translate(-61.408)" fill={`${selectedPreparation === 'Baked' ? '#5a0616' : '#333'}`}></path></svg>
						<input
							value="Baked"
							onChange={() => handleSelection("Baked")}
							type="radio"
							name="preparation"
							id="Baked"
							disabled={!isBakedAvailable}
							className="absolute opacity-0 invisible -z-[1]"
						/>
						Baked
					</label>
					<small className="text-gray-500 text-center">Ready to eat and serve</small>
				</div>
				<div className="flex flex-col gap-3">
					<label htmlFor="Frozen" className={`
						cursor-pointer relative flex flex-col gap-6 items-center border rounded-lg p-6 text-2xl font-medium h3 text-center ease-in-out duration-300
						${selectedPreparation === "Frozen" ? "border-[#5a0616] bg-[#f9dbb8] text-[#5a0616]" : "border-gray-200 bg-gray-100"}
					`}>
						<svg xmlns="http://www.w3.org/2000/svg" width="39.527" height="53.797" viewBox="0 0 39.527 53.797"><path d="M99.461,31.6h-.038a6.827,6.827,0,0,0,1.512-4.253c-.038-2.346-1.441-4.641-4.168-6.821a5.794,5.794,0,0,0,.213-3.022c-.793-3.918-5.044-5.482-8.945-6.352a5.051,5.051,0,0,0-2.423-5.891c1.562-3.171,3.644-3.522,4.482-3.522a4.5,4.5,0,0,1,2.126.434.87.87,0,1,0,.82-1.535A6.19,6.19,0,0,0,90.093,0a6.036,6.036,0,0,0-4.531,2.223A10.471,10.471,0,0,0,83.946,4.7a5.051,5.051,0,0,0-5.167,2.541,5.655,5.655,0,0,1-.913-1.326.871.871,0,0,0-1.213-.386A13.256,13.256,0,0,0,71,11.321a11.724,11.724,0,0,0-1.165,5c-.074.029-.147.057-.215.086a6,6,0,0,0-3.762,5.322,9.605,9.605,0,0,0,.153,2.552A5.04,5.04,0,0,0,62.974,31.6h-.7a.871.871,0,0,0-.85,1.065l4.319,19A2.717,2.717,0,0,0,68.411,53.8H93.329a2.717,2.717,0,0,0,2.663-2.125l4.319-19a.872.872,0,0,0-.85-1.065ZM83.194,6.391A3.311,3.311,0,1,1,79.882,9.7,3.315,3.315,0,0,1,83.194,6.391ZM68.411,52.054a.983.983,0,0,1-.963-.769L63.371,33.347h2.82l3.115,18.278a3.237,3.237,0,0,0,.1.429Zm3.115,0c-.158,0-.42-.251-.5-.722L67.96,33.347H70.8l2.072,18.23a4.127,4.127,0,0,0,.082.477Zm3.272,0a1.673,1.673,0,0,1-.2-.674L72.551,33.347H75.4l1.033,18.181q.016.28.048.526Zm5.2,0H78.247a4.517,4.517,0,0,1-.075-.625L77.145,33.347H80Zm3.569-.625a4.516,4.516,0,0,1-.075.625H81.741V33.347H84.6Zm3.374.625H85.259q.033-.246.048-.526l1.033-18.181h2.848L87.14,51.38A1.671,1.671,0,0,1,86.942,52.054Zm3.272,0H88.789a4.1,4.1,0,0,0,.082-.477l2.071-18.23H93.78L90.715,51.332C90.635,51.8,90.373,52.054,90.214,52.054Zm4.078-.769a.983.983,0,0,1-.963.769h-1a3.237,3.237,0,0,0,.1-.429l3.116-18.278h2.821ZM97.067,31.6H83.7a63.414,63.414,0,0,0,6.889-4.136.871.871,0,1,0-1-1.427,68.209,68.209,0,0,1-9.84,5.563H65.094a3.605,3.605,0,0,1-.9-3.372,3.887,3.887,0,0,1,3.295-2.558c1.655-.331,6.032-1.253,10.914-2.656a.871.871,0,1,0-.482-1.675c-4.352,1.251-8.3,2.114-10.224,2.511-.266-1.434-.442-4.54,2.607-5.847a36.794,36.794,0,0,1,6.087-1.4l.844-.154a.871.871,0,0,0-.315-1.714l-.841.154c-1.631.3-3.2.584-4.489.9a10.417,10.417,0,0,1,5.174-8.3,8.228,8.228,0,0,0,.922,1.135c.188.194.348.345.488.467a5.051,5.051,0,0,0,9.037,3.663A23.219,23.219,0,0,1,91.5,14.044a.805.805,0,0,1,.128.756c-.216.678-1.567,2.543-9.408,5.2a.871.871,0,1,0,.56,1.65,43.794,43.794,0,0,0,6.777-2.831c2.134-1.17,3.355-2.313,3.731-3.494.028-.087.05-.174.069-.261a4.488,4.488,0,0,1,1.912,2.785c.321,1.584-.4,3.332-2.14,5.2a.871.871,0,0,0,1.274,1.189A12.592,12.592,0,0,0,96,22.159c2.087,1.752,3.159,3.507,3.187,5.221A5.876,5.876,0,0,1,97.067,31.6Z" transform="translate(-61.408)" fill={`${selectedPreparation === 'Frozen' ? '#5a0616' : '#333'}`}></path></svg>
						<input
							value="Frozen"
							onChange={() => handleSelection("Frozen")}
							type="radio"
							name="preparation"
							id="Frozen"
							className="absolute opacity-0 invisible -z-[1]"
						/>
						Frozen
					</label>
					<small className="text-gray-500 text-center">10 min in microwave</small>
				</div>
			</div>
			{
				!isBakedAvailable &&
				<p className="text-red-500 text-center text-lg">*Baked option only available in Amman city</p>
			}
		</div>
	)
}

export default Preparation
