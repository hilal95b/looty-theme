import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Product } from './types'; // Import the Product type

const root = document.getElementById("root");

if (root) {
	const productData = root.dataset.product;

	let product: Product | undefined = undefined;

	try {
		if (productData) {
			product = JSON.parse(productData) as Product;
		}
	} catch (error) {
		console.error('Error parsing product JSON:', error);
	}

	if (product) {
		createRoot(root!).render(
			<StrictMode>
				<App product={product} />
			</StrictMode>
		);
	}
}
