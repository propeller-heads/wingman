import * as React from 'react';
import './App.css';
import MainForm from './components/stopLoss';
import { Box } from '@chakra-ui/react';
import styles from './App.module.css';
import { createPriceCondition } from './privacy/threshold';

interface MainFormProps {
    onSubmit: (data: any) => void;
}

type NucypherType = {
};

const App: React.FC = () => {

    const [nucypher, setNucypher] = React.useState<NucypherType | undefined>(undefined);

    const loadNucypher = async () => {
        const nucypherModule = await import('@nucypher/nucypher-ts');
        setNucypher(nucypherModule);
        console.log("nucypher loaded");
    };

    React.useEffect(() => {
        loadNucypher();
    }, []);

    const handleFormSubmit: MainFormProps['onSubmit'] = (data) => {
        // Handle form submission here
        console.log(data);
        console.log(nucypher);
        const condition = createPriceCondition(nucypher, "0x0715A7794a1dc8e42615F059dD6e406A6594651A", 179922000000, "<=", 80001);
        console.log(condition);
    };

    return (
        nucypher ? (
            <div className={`App ${styles.backgroundImage}`}>
                <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
                    {/* <h1 className={styles.appName}>wingman</h1> */}
                    <MainForm onSubmit={handleFormSubmit} />
                </Box>
            </div>
        ) : (
            <div>Loading nucypher, please wait...</div>
        )
    );
}

export default App;
