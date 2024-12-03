import { ProductData } from "../types/steps.types";

export const fetchProductData = async (productHandle: string): Promise<ProductData> => {
	const response = await fetch(`/api/products/${productHandle}`);
	if (!response.ok) {
		throw new Error("Failed to fetch product data");
	}
	return response.json();
};
