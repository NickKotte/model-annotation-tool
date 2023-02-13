import DataAnnotation from "./components/DataAnnotation";
import Header from "./components/Header";
import GlobalStateProvider from "./utilities/GlobalStateContext";

export default App = () => {
	return <GlobalStateProvider>
		<Header />
		<DataAnnotation />
		
	</GlobalStateProvider>;
};