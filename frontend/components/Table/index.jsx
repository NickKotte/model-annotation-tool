import React from "react";
import { getObjects } from "../../utilities/object.api";
export default Table = () => {
	const [data, setData] = React.useState([]);
	React.useEffect(() => {
		getObjects()
		.then((res) => {
			console.log(res)
			setData(res);
		});
	}, []);

	return <div>
		
	</div>;
}