import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-around;
	align-items: center;
	padding: 1rem;
	width: 40vw;

	${({ isModified }) => isModified && `
		background-color: #e3fbdb;
		box-shadow: 0 0 5px #70ff02;
	`}
`;
const Row = styled.div`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-around;
	align-items: center;
	width: 100%;
`;

export default TextGeneration = ({ model, type, updateModel, modified, handleInterrogate }) => {
	const { isModified, setIsModified } = modified || { isModified: false, setIsModified: () => {} };
	const [baseText, setBaseText] = useState('');
	const [generatedText, setGeneratedText] = useState('');
	const [loading, setLoading] = useState(false);
	const [warning, setWarning] = useState(false);
	
	useEffect(() => {
		if (model && type) {
			setBaseText(model[type].baseText);
			setGeneratedText(model[type].generatedText);
		}
	}, [model, type])

	useEffect(() => {
		if (model && type) {
			if (baseText !== model[type].baseText || generatedText !== model[type].generatedText) {
				setIsModified(true);
			} else {
				setIsModified(false);
			}
		}
	}, [baseText, generatedText])

	const handleGPTgenerate = (override) => {
		if (override) {
			setWarning(false);
		} else if (generatedText) {
			setWarning(true);
			return;
		}
		console.log('generated text', generatedText, override)
		setLoading(true);
		if (type === 'textureDescriptions') {
			// send generatedText from modelDescriptions + baseText (interrogation) to GPT
			// setGeneratedText to output of GPT
		} else {
			// send baseText to GPT
			// setGeneratedText to output of GPT
		}
	}

	// on enter button press, save
	const handleKeyDown = e => {
		if (e.key === 'Enter' && isModified) {
			handleSave();
		}
	}

	const handleSave = () => {
		updateModel(model._id, {...model, [type]: {baseText, generatedText}});
		setIsModified(false);
	}

	return (model && type) ? <Wrapper isModified={isModified}>
			<Row>
				<TextField disabled={loading} multiline helperText="This text will be used by GPT to create a more thorough description" fullWidth variant='standard' label='Base Text' value={baseText} onChange={e => setBaseText(e.target.value)} onKeyDown={handleKeyDown} />
				{type === 'textureDescriptions' && 
					<Button onClick={() => handleInterrogate()}
					disabled={!model.renderImages.length || loading || isModified} color='success' variant='contained'>Intorrogate</Button>}
			</Row>
			<br />
			<Row>
				<Button onClick={() => handleGPTgenerate()} disabled={!baseText || isModified || loading} color='success' variant='contained'>Generate</Button>
			</Row>
			<Row>
				<TextField disabled={loading} helperText="The output of GPT. Can be modified" fullWidth multiline rows={4} label='Generated Text' 
					value={generatedText} onChange={e => setGeneratedText(e.target.value)}
				/>
			</Row>
			<Row>
				<Button onClick={handleSave} disabled={!isModified || loading} color='primary' variant='contained'>Save</Button>
			</Row>
			<Dialog open={warning} onClose={() => setWarning(false)}>
				<DialogTitle>Overwrite the previously generated text?</DialogTitle>
				<DialogContentText style={{padding: '1rem'}}>
					{generatedText} - will be overwritten
				</DialogContentText>
				<DialogActions>
					<Button onClick={() => setWarning(false)} color='primary' variant='contained'>No</Button>
					<Button onClick={() => handleGPTgenerate(override=true)} color='primary' variant='contained'>Yes</Button>
				</DialogActions>
			</Dialog>
		</Wrapper> : null
}