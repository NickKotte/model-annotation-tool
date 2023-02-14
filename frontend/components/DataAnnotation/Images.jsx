import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	display: flex;
	flex-flow: row wrap;
	padding: 0.5rem;
	overflow-y: auto;
	max-height: 100px;
`
const Image = styled.img`
	width: 150px;
	height: auto;
	padding: 5px;
`

export default Images = ({images}) => {
	const [open, setOpen] = useState(false);
	const [images, setImages] = useState(images || []);
	const handleUpload = () => {
		
	return <>
		<Wrapper>
			{images.map(image => <Image src={image} />)}
		</Wrapper>;
		<Button variant="contained">Add Image</Button>
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>Add Image</DialogTitle>
			<DialogContent>
				<input type="file" 
					accept="image/*"
					multiple
					onChange={e => {
						setImages([...images, ...e.target.files]);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpen(false)}>Cancel</Button>
				<Button onClick={handleUpload}>Add</Button>
			</DialogActions>
		</Dialog>
	</>
};