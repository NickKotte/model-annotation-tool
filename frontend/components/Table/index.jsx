import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import GlobalStateContext from "../../utilities/context";
import Row from './AnnotationRow'
import RenderImages from "./RenderImages";
import TextGeneration from "./TextGeneration";
import ModelDisplay from "./ModelDisplay";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import { getInterrogation } from "../../utilities/api/Renders.api";

const TableContainer = styled.div`
  width: 100%;
`;

const TableBody = styled.div`
  background-color: #ffffffde;
  width: 100%;
  height: 100%;
`;

// A table for the data of 3D models
export default _ => {
	const { globalState, API } = useContext(GlobalStateContext);
	// editor is an object with the following properties:
	// 	- model: Object 
	//  - type: String (either 'model' or 'texture')
	const [isModified, setIsModified] = useState(false);
	const [warning, setWarning] = useState(null);
	const [editor, setEditor] = useState(null);
	const { models } = globalState;
	useEffect(() => {
		API.fetchModels();
	}, []);

	useEffect(() => {
		console.log('updated: ', models);
	}, [models]);

	const changeDialog = (type, override) => {
		if (isModified && !override) {
			setWarning(type);
		} else {
			if (warning) setWarning(null);

			if (type === 'close') {
				setEditor(null)
				return;
			}
			setEditor({ ...editor, type });
		}
	}
	
	const handleInterrogate = () => {
		// send baseText clip-interrogator
		// append result to baseText
		console.log('interrogate')
		getInterrogation()
		.then(res => {
			setEditor({ ...editor, baseText: editor.baseText + 'interrogated description' });
		})
	}

	return (
		<>
		<TableContainer>
			<TableBody>
				{models?.map((row, index) => (
					<Row updateModel={API.updateModel} key={index} index={index} model={row} setEditor={setEditor} />
				))}
			</TableBody>
		</TableContainer>
		<Dialog maxWidth={false} open={!!editor} onClose={() => changeDialog('close')}>
			<DialogTitle>
				{editor?.type === 'model' ? 'Renderer - take a selfie' : `${editor?.type} Editor - Powered By AI`}
			</DialogTitle>
			<DialogContent>
				{editor?.type === 'model' ? 'Model' : 'Texture'}: {models[editor?.modelIndex]?.objectFilename}.obj
				<div style={{display: 'flex'}}>
					{editor?.type === 'model' ? 
					<div style={{width: '80vw', height: '80vh'}}>
						<ModelDisplay addImage={API.addImage} photomode model={models[editor?.modelIndex]} /> 
					</div>
					: <TextGeneration model={models[editor?.modelIndex]} type={editor?.type} updateModel={API.updateModel} modified={{isModified, setIsModified}} />}
					<div style={{margin: 10}}></div>
						<RenderImages interrogate={editor?.type === 'textureDescriptions' && handleInterrogate} deleteImage={(image) => API.deleteImage(models[editor?.modelIndex]._id, image)} photomode={editor?.type === 'model'} images={models[editor?.modelIndex]?.renderImages} />
				</div>
			</DialogContent>
			<DialogActions>
				{editor?.type !== 'model' && <Button onClick={() => changeDialog('model')} color="primary" startIcon={<AccessibilityIcon />}>
					Model Viewer
				</Button>}
				{editor?.type !== 'modelDescriptions' && <Button onClick={() => changeDialog('modelDescriptions')} color="primary" startIcon={<DescriptionIcon />}>
					Text Description
				</Button>}
				{editor?.type !== 'textureDescriptions' && <Button onClick={() => changeDialog('textureDescriptions')} color="primary" startIcon={<ImageIcon />}>
					Visual Description
				</Button>}
				<Button onClick={() => changeDialog('close')} color="primary" variant="contained" >
					Close
				</Button>
				
			</DialogActions>
		</Dialog>
		<Dialog open={!!warning} onClose={() => setWarning(null)}>
			<DialogTitle>Warning</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You have unsaved changes. Are you sure you want to leave?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setWarning(null)} color="primary">
					Cancel
				</Button>
				<Button onClick={() => changeDialog(warning, true)} color="primary" variant="contained" >
					Leave
				</Button>
			</DialogActions>
		</Dialog>
	</>
)}