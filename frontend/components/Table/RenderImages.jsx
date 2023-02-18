import styled from 'styled-components';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MemoryIcon from '@mui/icons-material/Memory';
import Button from '@mui/material/Button';
import { ImageList, 
	ImageListItem,
} from '@mui/material';
const FloatingDiv = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	transition: opacity 0.2s ease-in-out !important;
	opacity: 0;
	z-index: 1;
`;
const ImageItem = styled(ImageListItem)`
	position: relative;
	&:hover ${FloatingDiv} {
		opacity: 1;
	}
`;
const List = styled(ImageList)`
	background-color: #c3c3c3;
	padding: 1rem;
	box-shadow: 0 0 5px #000;
`;
const FloatingButton = styled(Button)`
	&& {
		color: #fff;
	}
`;

export default renderImages = ({ images, photomode, deleteImage, interrogate }) => {
	const handleDelete = (image) => {
		const filename = image.split('/').pop();
		deleteImage(filename);
	}
	return (
		<List sx={{ width: 300, maxHeight: 500 }} cols={images?.length >= 3 ? 2 : 1} rowHeight={200} gap={2}>
			{images ? images.map((image, i) => (
				<ImageItem key={i}>
					<img src={image} alt={'render image'} loading="lazy" />
					{photomode && <FloatingDiv>
						<FloatingButton
							variant="contained"
							color="error"
							size="small"
							startIcon={<DeleteOutlineIcon />}
							onClick={() => handleDelete(image)}
						>
							Remove
						</FloatingButton>
					</FloatingDiv>}
					{interrogate && <FloatingDiv>
						<FloatingButton
							variant="contained"
							color="success"
							size="small"
							startIcon={<MemoryIcon />}
							onClick={() => interrogate(image)}
						>
							Interrogate
						</FloatingButton>
					</FloatingDiv>}
				</ImageItem>
			)): <div></div>}
		</List>
	)
}