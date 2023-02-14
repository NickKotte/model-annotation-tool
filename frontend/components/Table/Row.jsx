import React, { useEffect } from 'react';
import styled from 'styled-components';
import { updateModel } from '../../utilities/object.api';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { ButtonGroup, Chip } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Images from '../DataAnnotation/Images';

const Wrapper = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
	padding: 0.5rem;
	transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

	${({ isModified }) => isModified && `
		background-color: #e3fbdb;
		box-shadow: 0 0 5px #70ff02;
	`}
`;
const Column = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
`;
const Container = styled.div`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding: 10px;
`;
const File = styled.div`
	position: relative;
`
const FileInput = styled.input`
	position: absolute;
	z-index: 1;
	opacity: 0;
	transition: opacity 0.2s ease-in-out;

	&:hover {
		opacity: 1;
	}
`;
/**
 * A model has the following properties:
 * 	- objectFilename: String (required) (mui textfield)
 * 	- classLabel: String (required) (mui autocomplete)
 * 	- modelDescriptions: Object (show baseText and generatedText in separate textfields)
 * 		-> modelDescriptions.baseText: String (required) (mui textfield)
 * 		-> modelDescriptions.generatedText: String (mui multiline textfield)
 * 	- renderImageFilename: String (not required) (mui textfield)
 * 	- textureDescriptions: Object (show baseText and generatedText in separate textfields)
 * 		-> textureDescriptions.baseText: String (required) (mui textfield)
 * 		-> textureDescriptions.generatedText: String (mui multiline textfield)
 * 	- numTokens: Number (required) (mui textfield)
 * 	- createdAt: Date
 * 	- updatedAt: Date
 * 	- id: String
 */
export default Row = ({model}) => {
	const [isModified, setIsModified] = React.useState(false);
	const [modifiedModel, setModifiedModel] = React.useState(model);

	const handleModelChange = (event) => {
		const { name, value } = event.target;
		setModifiedModel({ ...modifiedModel, [name]: value });
		setIsModified(true);
	}

	const handleSave = () => {
		updateModel(modifiedModel).then((res) => {
			console.log(res);
			setIsModified(false);
		});
	}

	// watch for changes in the model and mark the row as modified
	useEffect(() => {
		if (JSON.stringify(model) !== JSON.stringify(modifiedModel)) {
			setIsModified(true);
		} else {
			setIsModified(false);
		}
	}, [modifiedModel]);

	console.log(modifiedModel)
	return (
		<Wrapper isModified={isModified}>
			<Container>
				<Chip label={`${modifiedModel.numTokens} tokens`} icon={<MonetizationOnIcon />} />
			</Container>
			<Container>
				<Column>
					<File>
						<FileInput
							type="file"
							name="objectFile"
							id="objectFile"
							onChange={e => setModifiedModel({ ...modifiedModel, objectFilename: e.target.files[0].name })}
						/>
						<TextField
							label="Object Filename"
							name="objectFilename"
							value={modifiedModel.objectFilename}
							onChange={handleModelChange}
							variant='standard'
						/>
					</File>
					<br />
					<Autocomplete
						id="class-label"
						options={['chair', 'table', 'lamp']}
						renderInput={(params) => <TextField {...params} label="Class Label" />}
						value={modifiedModel.classLabel}
						onChange={(event, newValue) => setModifiedModel({ ...modifiedModel, classLabel: newValue })}
					/>
				</Column>
				<Column>
					{!modifiedModel.modelDescriptions.generatedText ? (<>
						<TextField
							key='Model Base Description'
							label="Model Base Description"
							value={modifiedModel.modelDescriptions.baseText}
							onChange={e => setModifiedModel({ ...modifiedModel, modelDescriptions: { baseText: e.target.value } })}
						/>
						<Button
							variant="contained"
							onClick={() => {
								// generate model description
								setModifiedModel({ ...modifiedModel, modelDescriptions: { ...modifiedModel.modelDescriptions, generatedText: 'generated model description' } });
							}}
						>Convert</Button>
					</>) : <>
						<TextField
							key='Model Generated Description'
							label="Model Generated Description"
							name="modelDescriptions.generatedText"
							value={modifiedModel.modelDescriptions.generatedText}
							onChange={e => setModifiedModel({ ...modifiedModel, modelDescriptions: { generatedText: e.target.value } })}
						/>
						<ButtonGroup>
							<Button variant='contained' color='error' onClick={() => {
								setModifiedModel({ ...modifiedModel, modelDescriptions: { ...modifiedModel.modelDescriptions, generatedText: '' } });
							}}>Clear</Button>
							<Button variant='contained' color='success' onClick={() => {
								// generate model description
							}}>Regenerate</Button>
						</ButtonGroup>
					</>}
				</Column>
				<Column>
					<Images images={modifiedModel.renderImages} />
				</Column>
				<Column>
					<br />
					{!modifiedModel.textureDescriptions.generatedText ? (<>
						<TextField
							key='Texture Base Description'
							label="Texture Base Description"
							value={modifiedModel.textureDescriptions.baseText}
							onChange={e => setModifiedModel({ ...modifiedModel, textureDescriptions: { baseText: e.target.value } })}
						/>
						<Button
							variant="contained"
							onClick={() => {
								// generate texture description
								setModifiedModel({ ...modifiedModel, textureDescriptions: { ...modifiedModel.textureDescriptions, generatedText: 'generated texture description' } });
							}}
						>Convert</Button>
					</>) : <>
						<TextField
							key='Texture Generated Description'
							label="Texture Generated Description"
							name="textureDescriptions.generatedText"
							value={modifiedModel.textureDescriptions.generatedText}
							onChange={e => setModifiedModel({ ...modifiedModel, textureDescriptions: { generatedText: e.target.value } })}
						/>
						<ButtonGroup>
							<Button variant='contained' color='error' onClick={() => {
								setModifiedModel({ ...modifiedModel, textureDescriptions: { ...modifiedModel.textureDescriptions, generatedText: '' } });
							}}>Clear</Button>
							<Button variant='contained' color='success' onClick={() => {
								// generate texture description
							}}>Regenerate</Button>
						</ButtonGroup>
					</>}
				</Column>
			</Container>
		</Wrapper>
	);
}