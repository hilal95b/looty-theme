import { useEffect, useState } from "react"
import { useSteps } from "../context/StepContext";


interface BottomNavProps {
	variantApiId: string;
	onNext: () => void;
	onPrevious: () => void;
	isNextDisabled: boolean;
  }
  
  interface ItemProperties {
	_bundleId: string;
	status?: string;
	message?: string;
  }
  
  interface Item {
	id: string;
	quantity: number;
	properties: ItemProperties;
  }

  const BottomNav: React.FC<BottomNavProps> = ({ isNextDisabled, variantApiId }) => {

	const cartDrawer = document.querySelector("cart-drawer");


	const { state, dispatch } = useSteps();
	const [progress, setProgress] = useState(0);
	const currentStep = state.currentStep;

	// Set progreddbar parsentage
	const setBorgressBar = (status: string) => {

		if (status === "decrement") {
			setProgress(progress - 10);
			dispatch({ type: "PREVIOUS_STEP" });
		} else {
			setProgress(progress + 10);
			dispatch({ type: "NEXT_STEP" }); // Handle conditional navigation
		}
	}

	// Update progress bar
	useEffect(() => {

		if (state.currentStep === 9) {
			setProgress(100)
		}


	}, [state.currentStep])


	const handelAddToCart = async () => {

		console.log('variantApiId', variantApiId);

		console.log('Add To Cart');

		let items: Item[] = [];

		const deleveryType = state.steps[0].data;
		const deleveryCity = state.steps[1].data;
		const orderStatus = state.steps[2].data;

		const itemSelection1 = state.steps[4].data.id;
		const itemSelection1_id = itemSelection1.replace('gid://shopify/ProductVariant/', '');
	
		const itemSelection2 = state.steps[5].data.id;
		const itemSelection2_id = itemSelection2.replace('gid://shopify/ProductVariant/', '');

		const boxTitle = state.steps[6].data;

		const itemAddons1 = state.steps[7].data.addons1[0].id;
		const itemAddons1_id = itemAddons1.replace('gid://shopify/ProductVariant/', '');
		const itemAddons1_quintaty = state.steps[7].data.addons1[0].quintaty;

		const printableCard = state.steps[8].data;
		const printableCardId = printableCard.replace('gid://shopify/ProductVariant/', '');

		const deliveryDate = state.steps[9].data.deliveryDate;
		const deliveryTime = state.steps[9].data.deliveryTime;
		const message = state.steps[9].data.message;
		const recipientMobile = state.steps[9].data.recipientMobile;
		const recipientName = state.steps[9].data.recipientName;
		const senderName = state.steps[9].data.senderName;

		const isAddon1Select = state.steps[7].data;


		try {

			if (state.selectionType === 'single-selection') {
				items = [
					{
						id: itemSelection1_id,
						quantity: 1,
						properties: {
							_bundleId: variantApiId,
							status: orderStatus // Attach the status to the parent product
						}
					},
					{
						id: itemSelection2_id,
						quantity: 1,
						properties: {
							_bundleId: variantApiId,
							status: orderStatus // Attach the status to the parent product
						}
					}
				];
			} else {
				items = items
			}
			
			
			// Add optional addons1 with dynamic quantity if selected
			if (isAddon1Select) {
				items.push({
					id: itemAddons1_id,
					quantity: itemAddons1_quintaty || 1, // Default to 1 if no quantity is provided
					properties: {
						_bundleId: variantApiId
					}
				});
			}

			// Add optional addons2 if selected
			if (printableCard) {
				items.push({
					id: printableCardId,
					quantity: 1,
					properties: {
						_bundleId: variantApiId,
						message: message
					}
				});
			}

			const response = await fetch('/cart/add.js', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					items,
					sections: cartDrawer.getSectionsToRender().map((section: any) => section.id)
				})
			});

			// Update the cart note with Additional Details
			await fetch('/cart/update.js', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					// note: noteData.join('\n'), // Join fields with newlines for readability
					attributes: {
						'Status:': orderStatus,
						'Delevery Type:': deleveryType,
						'Delevery City:': deleveryCity,
						'Box Title:': boxTitle,
						'Message:': message,
						'Sender Name:': senderName,
						'Recipient Name:': recipientName,
						'Recipient Mobile:': recipientMobile,
						'Delivery Date:':deliveryDate,
						'Delivery Time:': deliveryTime,
					}
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error:', errorData);
				alert('Error adding items to cart.');
			} else {
				console.log('Items added to cart successfully.');
				console.log('response', response);
				
				cartDrawer.renderContents(response);
				// Redirect or reload the page after successful addition
				// window.location.reload();
				// document.dispatchEvent(new CustomEvent('cart:refresh')); // Trigger the event to open the cart drawer
				// Shopify.theme.cartDrawer.open();
			}

		} catch (error) {
			console.error('Network error:', error);
			alert('Network error occurred.');
		}

	}



	return (
		<nav className="bg-[#f9dbb8] sm:bg-white sticky bottom-0">
			<div className="relative w-full bg-[#5a0616] bg-opacity-30 h-[4px] block sm:hidden">
				<span className="absolute bg-[#5a0616] top-0 left-0 h-full z-10 ease-in-out duration-300" style={{ width: `${progress}%` }}></span>
			</div>
			<div className="py-4 px-9 sm:px-0 md:pb-16 flex justify-between items-center gap-4">
				{
					progress > 0 &&
					<button
					onClick={() => setProgressBar("decrement")}
						className={`border border-[#5a0616] text-[#5a0616] rounded-full capitalize font-medium
							${currentStep === 9 ? 'p-4' : 'py-4 px-16'}
						`}
					>
						{
							currentStep === 9 ?
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
								</svg>
								: 'back'
						}

					</button>
				}
				{
					currentStep === 9 ?
						<button
							disabled={isNextDisabled}
							onClick={handleAddToCart}
							className="w-full border border-[#5a0616] bg-[#5a0616] text-[#f9dbb8] rounded-full py-4 px-16 capitalize font-medium ms-auto"
						>
							Add To Cart
						</button> :

						<button
							disabled={isNextDisabled}
							onClick={() => setProgressBar("increment")}
							className="border border-[#5a0616] bg-[#5a0616] text-[#f9dbb8] rounded-full py-4 px-16 capitalize font-medium ms-auto"
						>
							next
						</button>
				}
			</div>
		</nav>
	)
}

export default BottomNav
