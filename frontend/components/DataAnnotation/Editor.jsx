import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { updateModel, createModel } from '../../utilities/object.api';
import { useEffect, useContext, useState, forwardRef } from 'react';
import GlobalStateContext from '../../utilities/context';
import Slide from '@mui/material/Slide';
const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
  });
export default Editor = () => {
	const { globalState, setGlobalState } = useContext(GlobalStateContext);
	const [model, setModel] = useState({
		objectFilename: 'Test',
		classLabel: 'chair',
		modelDescriptions: {
			baseText: 'blue chair with no arms',
			generatedText: '',
		},
		textureDescriptions: {
			baseText: '',
			generatedText: '',
		},
	});
	useEffect(() => {
		if (globalState.selectedModel) {
			setModel(globalState.selectedModel);
		}
	}, [globalState.openEditor]);

	const handleModelChange = (event) => {
		const { name, value } = event.target;
		console.log(name, value)
		setModel({ ...model, [name]: value });
	}

	const handleSave = () => {
		if (model._id) {
			updateModel(model).then((res) => {
				console.log(res);
				globalState.models[globalState.models.findIndex((m) => m._id === model._id)] = res;
			});
		} else {
			createModel(model).then((res) => {
				console.log(res);
				globalState.models.unshift(res);
			});
		}
	}

	return (
		<Dialog
			open={globalState.openEditor}
			onClose={() => setGlobalState({ ...globalState, openEditor: false })}
			sx={{
				'& .MuiDialog-paper': {
					width: '100%',
					maxWidth: '800px',
					height: '100%',
					maxHeight: '500px',
				},
			}}
			TransitionComponent={Transition}
			keepMounted
		>
			<DialogTitle>Edit Model</DialogTitle>
			<DialogContent 
				sx={{ width: 300 }}>
				<TextField
					name="objectFilename"
					value={model?.objectFilename || ''}
					onChange={handleModelChange}
					label="Object File"
					fullWidth
					required
				/>
				<Autocomplete
					name="classLabel"
					value={model?.classLabel || 'chair'}
					onChange={handleModelChange}
					options={['chair', 'table', 'bed', 'sofa', 'desk', 'dresser', 'nightstand', 'bookshelf', 'bathtub', 'toilet']}
					renderInput={(params) => <TextField {...params} label="Class Label" />}
					fullWidth
				/>
				{/* <TextField
					name='modelDescriptions.baseText'
					value={model?.modelDescriptions.baseText}
					onChange={handleModelChange}
					label="Model Description (Base Text)"
					fullWidth
				/> */}
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setGlobalState({ ...globalState, openEditor: false })}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</DialogActions>
		</Dialog>
)}