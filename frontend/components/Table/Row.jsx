import React from 'react';
import styled from 'styled-components';
import { updateModel } from '../../utilities/object.api';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const TableBodyRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableBodyCell = styled.td`
  padding: 10px 15px;
  text-align: left;
`;

const FileInput = styled.input`
	display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #fff;
  background-color: #337ab7;
  border-color: #2e6da4;
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

	return (
		<TableBodyRow>
			<TableBodyCell>
				<FileInput
					accept=".obj"
					id="object-file-input"
					type="file"
				/>
				<FileInputLabel htmlFor="object-file-input">
					Upload
				</FileInputLabel>
			</TableBodyCell>
			<TableBodyCell>
				<TextField
					name="objectFilename"
					value={modifiedModel.objectFilename}
					onChange={handleModelChange}
				/>
			</TableBodyCell>
			<TableBodyCell>
				<Autocomplete
					name="classLabel"
					value={modifiedModel.classLabel}
					onChange={handleModelChange}
					options={['chair', 'table', 'bed', 'sofa', 'desk', 'dresser', 'nightstand', 'bookshelf', 'bathtub', 'toilet']}
				/>
			</TableBodyCell>
			<TableBodyCell>
				<TextField
					name="modelDescriptions.baseText"
					value={modifiedModel.modelDescriptions.baseText}
					onChange={handleModelChange}
				/>
			</TableBodyCell>
			<TableBodyCell>
				<TextField
					name="modelDescriptions.generatedText"
					value={modifiedModel.modelDescriptions.generatedText}
					onChange={handleModelChange}
					multiline
				/>
			</TableBodyCell>
			<TableBodyCell>
				<TextField
					name="renderImageFilename"
					value={modifiedModel.renderImageFilename}
					onChange={handleModelChange}
				/>
			</TableBodyCell>
			<TableBodyCell>
				<TextField
					name="textureDescriptions.baseText"
					value={modifiedModel.textureDescriptions.baseText}
					onChange={handleModelChange}
				/>
			</TableBodyCell>
			<TableBodyCell>
				<TextField
					name="textureDescriptions.generatedText"
					value={modifiedModel.textureDescriptions.generatedText}
					onChange={handleModelChange}
					multiline
				/>
			</TableBodyCell>
			<TableBodyCell>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSave}
					disabled={!isModified}
				>
					Save
				</Button>
			</TableBodyCell>
		</TableBodyRow>
	);
}