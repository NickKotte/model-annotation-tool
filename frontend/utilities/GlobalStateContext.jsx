import React, { useState } from 'react';
import GlobalStateContext from './context';
import { getModels } from './Object.api';

const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    openEditor: false,
    selectedModel: null,
    models: [],
  });

  const fetchModels = params => {
    getModels(params).then(models => {
      setGlobalState({ ...globalState, models: models });
    });
  }

  const API = {
    fetchModels,
  }

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState, API }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;