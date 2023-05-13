import React from 'react';
import './App.css';
import MainForm from './components/stopLoss';
import { Box } from '@chakra-ui/react';
import styles from './App.module.css';


function App() {
  const handleFormSubmit = (data: any) => {
    // Handle form submission here
    console.log(data);
  };

  return (
    <div className={`App ${styles.backgroundImage}`}>
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        {/* <h1 className={styles.appName}>wingman</h1> */}
        <MainForm onSubmit={handleFormSubmit} />
      </Box>
    </div>
  );
}

export default App;

