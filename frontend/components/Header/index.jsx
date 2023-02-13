import styled from "styled-components";
import AddItem from "./AddItem";

// A header for the data annotation page
// sticky: the header is always visible
// z-index: the header is always on top of other elements
// background-color: the header has a background color
// padding: the header has some padding
// display: the header is a flex container
// justify-content: the header's children are aligned horizontally
// align-items: the header's children are aligned vertically
// box-shadow: the header has a shadow
const Header = styled.header`
	position: sticky;
	top: 0;
	z-index: 1;
	background-color: #fff;
	padding: 0 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
`;

export default _ => {
	
	return (
		<Header>
			<h1>3D Model Data Annotation</h1>
			<AddItem />
		</Header>
	)
}