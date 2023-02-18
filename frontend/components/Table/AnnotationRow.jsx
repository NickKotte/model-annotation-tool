import React, { useEffect } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import ModelDisplay from './ModelDisplay';
import RenderImages from './RenderImages';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

const Wrapper = styled.div`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	padding: 0.5rem;
	transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
	max-height: 210px;

	${({ isModified }) => isModified && `
		background-color: #e3fbdb;
		box-shadow: 0 0 5px #70ff02;
	`}
	${({ isErrored }) => isErrored && `
		background-color: #fbdbe3;
		box-shadow: 0 0 5px #ff0202;
	`}
`;
const Column = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
	padding: 1rem;
	width: 100%;
`;
const Row = styled.div`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	max-height: inherit;
`;
const OverlayButton = styled(Button)`
	position: absolute !important;
	bottom:0;
	transition: opacity 0.2s ease-in-out !important;
	opacity: 0;
`;
const Model = styled.div`
	width: 300px;
	position: relative;
	// on hover set OverlayButton to visible
	&:hover ${OverlayButton} {
		opacity: 1;
	}
`

/**
 * A model has the following properties:
 * 	- objectFilename: String (required) (mui textfield)
 * 	- classLabel: String (required) (mui autocomplete)
 * 	- modelDescriptions: Object (show baseText and generatedText in separate textfields)
 * 		-> modelDescriptions.baseText: String (required) (mui textfield)
 * 		-> modelDescriptions.generatedText: String (mui multiline textfield)
 *  - renderImages: Array (Images Comoponent)
 * 	- textureDescriptions: Object (show baseText and generatedText in separate textfields)
 * 		-> textureDescriptions.baseText: String (required) (mui textfield)
 * 		-> textureDescriptions.generatedText: String (mui multiline textfield)
 * 	- numTokens: Number (mui chip)
 *  - fileSize: Number (mui textfield)
 *  - isComplex: Boolean (mui chip)
 * 	- createdAt: Date
 * 	- updatedAt: Date
 * 	- id: String
 */
export default AnnotationRow = ({model, setEditor, index, updateModel}) => {
	const [isModified, setIsModified] = React.useState(false);
	const [isErrored, setIsErrored] = React.useState(false);
	const [modifiedModel, setModifiedModel] = React.useState({...model});
	const [loading, setLoading] = React.useState(false);
	const options = [
		{ label: 'Animal' },
		{ label: 'Architecture' },
		{ label: 'Art' },
		{ label: 'Vehicle' },
		{ label: 'Character' },
		{ label: 'Creature' },
		{ label: 'Electronic' },
		{ label: 'Fashion' },
		{ label: 'Food' },
		{ label: 'Furniture' },
		{ label: 'Music' },
		{ label: 'Nature' },
		{ label: 'Sport' },
		{ label: 'Weapon' },
	]

	const updateProperty = (property, value) => {
		if (property === 'classLabel') {
			const label = options.find(option => option.label === value);
			setIsErrored(!label);
			if (!label) return;
		}
		setModifiedModel({ ...modifiedModel, [property]: value });
	}
	const handleModelChange = (event) => {
		const { name, value } = event.target;
		setModifiedModel({ ...modifiedModel, [name]: value });
		setIsModified(true);
	}

	const handleSave = () => {
		setLoading(true);
		updateModel(modifiedModel._id, modifiedModel)
		.then((res) => {
			setLoading(false)
			setIsModified(false);
		});
	}

	// watch for changes in the model and mark the row as modified
	useEffect(() => {
		console.log('modifiedModel', modifiedModel);
		if (JSON.stringify(model) !== JSON.stringify(modifiedModel)) {
			setIsModified(true);
			if (!isErrored) {
				handleSave();
			}
		} else {
			setIsModified(false);
		}
	}, [modifiedModel]);

	useEffect(() => {
		if (!isModified) {
			setModifiedModel({...model});
		} 
	}, [model]);

	return (
		<Wrapper isModified={isModified} isErrored={isErrored}>
			<Model>
				<ModelDisplay model={modifiedModel} />
				<OverlayButton
					disabled={loading}
					fullWidth
					variant="contained"
					color="primary"
					onClick={() => setEditor({modelIndex: index, type: 'model'})}
					startIcon={<OpenInFullIcon />}
				>
					Photomode
				</OverlayButton>
			</Model>
			<Column>
				<Row style={{display: 'flex', justifyContent: 'space-around'}} >
					<Chip label={modifiedModel.fileSize/1000 + ' MB'} variant="outlined" />
					<div>
						<Chip disabled={loading} label='Simple' variant={modifiedModel.isComplex ? 'outlined' : 'filled'} color={!modifiedModel.isComplex ? 'success' : 'primary'}
							onClick={() => updateProperty('isComplex', !modifiedModel.isComplex)} />
						<Chip disabled={loading} label='Complex'  variant={!modifiedModel.isComplex ? 'outlined' : 'filled'} color={modifiedModel.isComplex ? 'success' : 'primary'}
							onClick={() => updateProperty('isComplex', !modifiedModel.isComplex)} />
					</div>
					<Chip label={modifiedModel.renderImages.length + ' renders'} variant="outlined" />
				</Row>
				<Row style={{height: 150}}>
					<Column>
						<TextField disabled label="Object Filename" name="objectFilename" value={modifiedModel.objectFilename} onChange={handleModelChange} variant='standard' />
						<br />
						<Autocomplete
							disabled={loading} 
							renderInput={(params) => <TextField {...params} label="Class Label" />}
							options={options}
							value={modifiedModel.classLabel}
							onChange={(event, newValue) => {
								updateProperty('classLabel', newValue?.label);
							}}
							isOptionEqualToValue={(option, value) => option.label === value}
							blurOnSelect
						/>
					</Column>
				</Row>
			</Column>
			<Row>

				<RenderImages images={modifiedModel.renderImages} />
			</Row>
				<Column>
					<Row style={{display: 'flex', justifyContent: 'space-between'}}>
						<Chip label={'Added ' + moment(modifiedModel.createdAt).fromNow()} variant="outlined" />
						<Chip label={`${modifiedModel.numTokens} tokens`} variant="outlined"/>
					</Row>
					<Row>
						<Column>
							<TextField disabled={loading} label="Model Geometry" name="modelDescriptions" value={modifiedModel.modelDescriptions.generatedText || modifiedModel.modelDescriptions.baseText} onClick={e => !loading && setEditor({modelIndex: index, type: 'modelDescriptions'})} />
							<TextField disabled={loading} label="Texture" name="textureDescriptions" value={modifiedModel.textureDescriptions.generatedText || modifiedModel.textureDescriptions.baseText} onClick={e => !loading && setEditor({modelIndex: index, type: 'textureDescriptions'})} />
						</Column>
					</Row>
				</Column>
		</Wrapper>
	);
}