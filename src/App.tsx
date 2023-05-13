import * as React from 'react';
import './App.css';
import MainForm from './components/stopLoss';
import { Box } from '@chakra-ui/react';
import styles from './App.module.css';
import { buildFusionOrder } from './fusion/fusion_order'
import { createPriceCondition } from './privacy/threshold';
import { ethers } from 'ethers';


interface MainFormProps {
    onSubmit: (data: any) => void;
}

type NucypherType = {
};

declare global {
    interface Window {
        ethereum: any;
    }
}


const App: React.FC = () => {

    const [nucypher, setNucypher] = React.useState<NucypherType | undefined>(undefined);
    const [provider, setProvider] = React.useState<any | undefined>(undefined);

    const loadNucypher = async () => {
        const nucypherModule = await import('@nucypher/nucypher-ts');
        setNucypher(nucypherModule);
        console.log("nucypher loaded");
        loadWeb3Provider();
    };

    const loadWeb3Provider = async () => {
        if (!window.ethereum) {
            console.error('You need to connect to the MetaMask extension');
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        const { chainId } = await provider.getNetwork();
        if (![137, 80001].includes(chainId)) {
            console.error('You need to connect to the Mumbai or Polygon network');
        }

        await provider.send('eth_requestAccounts', []);
        setProvider(provider);
    };

    React.useEffect(() => {
        loadNucypher();
        loadWeb3Provider();
    }, []);


    const encrypt = async (nucypher: any) => {
        const cohort = await nucypher.Cohort.create({
            threshold: 2,
            shares: 3,
            porterUri: 'https://porter-tapir.nucypher.community'
        })
        const condition = createPriceCondition(nucypher, "0x0715A7794a1dc8e42615F059dD6e406A6594651A", 179922000000, "<=", 80001);
        console.log(condition);
        const conditionSet = new nucypher.ConditionSet([condition]);
        const strategy = nucypher.Strategy.create(cohort, conditionSet);
        const deployedStrategy = await strategy.deploy("test", provider);
        console.log(deployedStrategy);
    }

    const handleFormSubmit: MainFormProps['onSubmit'] = (data) => {
        // Handle form submission here
        console.log(data);
        const limit: number = +data["limit"];
        const amount: number = +data["amount"];
        const order = buildFusionOrder(
            data["sellToken"],
            data["buyToken"],
            data["amount"],
            (limit * amount).toString(),
            "fake_wallet",
        )
        console.log(order);
        console.log(nucypher);
        encrypt(nucypher);
    };

    return (
        nucypher ? (
            <div className={`App ${styles.backgroundImage}`}>
                <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
                    {/* <h1 className={styles.appName}>wingman</h1> */}
                    <MainForm onSubmit={handleFormSubmit} isConnected={provider} />
                </Box>
            </div>
        ) : (
            <div>Loading nucypher, please wait...</div>
        )
    );
}

export default App;
