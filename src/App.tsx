import { StepsProvider } from "./context/StepContext";

import ContainerView from "./components/ContainerView";
import ContainerOptions from "./components/ContainerOptions";
import { Product } from './types'; // Import the Product type

interface AppProps {
	product: Product;
}

const App: React.FC<AppProps> = ({ product }) => {
	return (
		<StepsProvider
			productHandle={product.handle}
		>
			<main className="page-width p-0 sm:px-8 flex flex-col sm:grid sm:grid-cols-2 sm:gap-9 md:gap-14 lg:gap-16 h-full">
				<ContainerView />
				<ContainerOptions variantAdminGraphqlApiId={product.variants[0].id} />
			</main>
		</StepsProvider>
	);
}

export default App;
