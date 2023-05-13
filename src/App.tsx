import * as React from 'react';
import './App.css';
import MainForm from './components/stopLoss';
import { Box } from '@chakra-ui/react';
import styles from './App.module.css';
import {buildFusionOrder} from './fusion/fusion_order'

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
        const num1: number = +data["limit"];
        const num2: number = +data["amount"];
        const order = buildFusionOrder(
            data["sellToken"], 
            data["buyToken"],
            data["amount"],
            (num1 * num2).toString(),
            "fake_wallet",
        )
        console.log(order);
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
