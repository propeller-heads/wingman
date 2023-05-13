import * as React from 'react';
import './App.css';
import MainForm from './components/stopLoss';
import { Box } from '@chakra-ui/react';
import styles from './App.module.css';

interface MainFormProps {
    onSubmit: (data: any) => void;
}

const App: React.FC = () => {
    const handleFormSubmit: MainFormProps['onSubmit'] = (data) => {
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
