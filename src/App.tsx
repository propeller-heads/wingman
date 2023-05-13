import * as React from 'react';
import './App.css';
import MainForm from './components/stopLoss';
import { Box } from '@chakra-ui/react';
import styles from './App.module.css';
import { buildFusionOrder } from './fusion/fusion_order'
import { createPriceCondition } from './privacy/threshold';
import { ethers } from 'ethers';

import dotenv from 'dotenv';
const ipfsClient = require('ipfs-http-client');

dotenv.config();

interface MainFormProps {
    onSubmit: (data: any) => void;
}

type NucypherType = {};

declare global {
    interface Window {
        ethereum: any;
    }
}


const App: React.FC = () => {

    const [nucypher, setNucypher] = React.useState<NucypherType | undefined>(undefined);
    const [provider, setProvider] = React.useState<any | undefined>(undefined);
    const [IPFSClient, setIPFSClient] = React.useState<any | undefined>(undefined);

    const getIPFSClient = () => {
        const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;
        const INFURA_SECRET = process.env.REACT_APP_INFURA_SECRET;

        const client = ipfsClient.create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: `Basic ${Buffer.from(`${INFURA_PROJECT_ID}:${INFURA_SECRET}`).toString('base64')}`,
            },
        });
        setIPFSClient(client);
    }

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
        getIPFSClient();
    }, []);

    const handleFormSubmit: MainFormProps['onSubmit'] = async (data) => {
        // Handle form submission here
        console.log(data);
        const limit: number = +data["limit"];
        const amount: number = +data["amount"];
        const order = await buildFusionOrder(
            data["sellToken"],
            data["buyToken"],
            data["amount"],
            provider.provider.selectedAddress,
            provider,
        )
        console.log(order);
        console.log(nucypher);
        const condition = createPriceCondition(nucypher, "0x0715A7794a1dc8e42615F059dD6e406A6594651A", 179922000000, "<=", 80001);
        console.log(condition);
        try {
            // Add JSON data to IPFS
            const jsonData = JSON.stringify(data);
            const result = await IPFSClient.add(jsonData);

            // Log the resulting IPFS hash
            console.log('IPFS hash:', result.path);
        } catch (error) {
            console.error('Error uploading data to IPFS:', error);
        }
    };

    return (
        nucypher ? (
            <div className={`App ${styles.backgroundImage}`}>
                <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
                    <h1 style={{ position: 'absolute', top: '15px', left: '30px', fontSize: '36px', fontWeight: 'bold' }} className={styles.appName}>wingman</h1>
                    <MainForm onSubmit={handleFormSubmit} isConnected={provider} />
                </Box>
            </div>
        ) : (
            <div>Loading nucypher, please wait...</div>
        )
    );
}

export default App;
