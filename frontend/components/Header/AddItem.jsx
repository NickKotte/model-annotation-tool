import AddItemIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import GlobalStateContext from '../../utilities/context';

export default AddItem = () => {
	const { globalState, setGlobalState } = useContext(GlobalStateContext);
	return (
		<Button 
			variant="contained"
			onClick={() => setGlobalState({ ...globalState, openEditor: true })}>
			<AddItemIcon />
		</Button>
	);
}