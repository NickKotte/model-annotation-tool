import React, { useState } from 'react';
import GlobalStateContext from './context';

const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    openEditor: false,
    selectedModel: null,
    models: [],
  });

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;