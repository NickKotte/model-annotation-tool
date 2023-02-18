import React, { useState } from 'react';
import GlobalStateContext from './context';
import { getModelById, getModels, updateModelById } from './api/Object.api';
import { createRender, deleteRenderById } from './api/Renders.api';
import SnackBar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { generateUUID } from 'three/src/math/MathUtils';
import { Alert } from '@mui/material';

const GlobalStateProvider = ({ children }) => {
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [globalState, setGlobalState] = useState({
    openEditor: false,
    selectedModel: null,
    models: [],
  });

  const fetchModels = params => {
    getModels(params).then(models => {
      setGlobalState({ ...globalState, models: models });
    })
    .catch((message) => {
      setSnackbarMessage({ message, severity: 'error', duration: 3000 });
    });
  }
  const hotReload = (id, newModel) => {
    setGlobalState(prevState => ({
      ...prevState,
      models: prevState.models.map(model => {
        if (model._id === id) {
          return newModel;
        }
        return model;
      }),
    }));
  };
  const fetchModelById = id => {
    getModelById(id).then(model => {
      hotReload(id, model);
    })
    .catch((message) => {
      setSnackbarMessage({ message, severity: 'error', duration: 3000 });
    });
  }
  const updateModel = async (id, newModel) => {
    try {
      const updatedModel = await updateModelById(id, newModel);
      hotReload(id, updatedModel);
      setSnackbarMessage({ message: 'Model updated successfully', severity: 'success', duration: 1000 });
    } catch ({message}) {
      setSnackbarMessage({ message, severity: 'error', duration: 3000 });
    }
  }
  const addImage = async (id, image) => {
    try {
      const updatedModel = await createRender(id, image);
      hotReload(id, updatedModel);
      setSnackbarMessage({ message: 'Image added successfully', severity: 'success', duration: 3000 });
    } catch ({message}) {
      setSnackbarMessage({ message, severity: 'error', duration: 3000 });
    }
  }
  const deleteImage = async (id, image) => {
    try {
      const updatedModel = await deleteRenderById(id, image);
      hotReload(id, updatedModel);
    } catch ({message}) {
      setSnackbarMessage({ message, severity: 'error', duration: 3000 });
    }
  }

  const API = {
    fetchModels,
    updateModel,
    fetchModelById,
    addImage,
    deleteImage,
  }

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState, API }}>
      <SnackBar 
        open={!!snackbarMessage}
        autoHideDuration={snackbarMessage?.duration || 3000}
        onClose={() => setSnackbarMessage(null)}
        key={generateUUID()}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}
      >
        <Alert onClose={() => setSnackbarMessage(null)} severity={snackbarMessage?.severity}>
          {snackbarMessage?.message}
        </Alert>
      </SnackBar>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;