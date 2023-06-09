import * as React from 'react';
import './App.css';
import MainForm from './components/stopLoss';
import { Box } from '@chakra-ui/react';
import styles from './App.module.css';
import { buildFusionOrder } from './fusion/fusion_order'
import { createIsWhitelistedCondition } from './privacy/threshold';
import { ethers } from 'ethers';

import dotenv from 'dotenv';
import { getTokenDecimals } from './web3';
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

type StrategyStore = {
    strategyPayload?: string
};


const App: React.FC = () => {

    const [nucypher, setNucypher] = React.useState<NucypherType | undefined>(undefined);
    const [provider, setProvider] = React.useState<any | undefined>(undefined);
    const [IPFSClient, setIPFSClient] = React.useState<any | undefined>(undefined);
    const [items, setItems] = React.useState<StrategyStore>({});

    React.useEffect(() => {
        if (items.strategyPayload !== undefined) {
            localStorage.setItem('items', JSON.stringify(items));
            console.log("updated local storage", items.strategyPayload);
        }
    }, [items]);

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
        const storageData = localStorage.getItem('items');
        console.log("retrieved storage: ", storageData);
        if (storageData != null) {
            const items = JSON.parse(storageData);
            if (items) {
                setItems(items);
            }
        }
    }, []);


    const encrypt = async (nucypher: any, data: string, provider: any): Promise<string> => {
        let deployedStrategy;
        if (!items.strategyPayload || true) {
            console.log("Deploying new strategy!");
            const cohort = await nucypher.Cohort.create({
                threshold: 2,
                shares: 3,
                porterUri: 'https://porter-tapir.nucypher.community'
            })
            const condition = createIsWhitelistedCondition(nucypher);
            const conditionSet = new nucypher.ConditionSet([condition]);
            const strategy = nucypher.Strategy.create(cohort, conditionSet);
            deployedStrategy = await strategy.deploy("test", provider);
            setItems({ strategyPayload: deployedStrategy.toJSON() });
        } else {
            // This currently fails due to missing toWASMConditions on loaded condition set
            console.log("loading strategy")
            deployedStrategy = nucypher.DeployedStrategy.fromJSON(items.strategyPayload);
        }

        const encrypter = deployedStrategy.encrypter;
        const messageKit = encrypter.encryptMessage(data, null);
        const encryptedOrderHexStr = ethers.utils.hexlify(messageKit.toBytes());
        console.log("Message encrypted: ", encryptedOrderHexStr.slice(0, 20));

        console.log("========= Showcasing decryption ==========")
        const decrypter = deployedStrategy.decrypter;
        try {
            const start = performance.now();
            const decryptedMessageBytes = await decrypter.retrieveAndDecrypt(
                [messageKit],
                provider
            );
            const decoder = new TextDecoder();
            const decryptedMessage = decoder.decode(decryptedMessageBytes[0]);
            console.log(`Decryption successful!! Duration: ${performance.now() - start}ms`);
            console.log(JSON.parse(decryptedMessage));
        } catch (error) {
            console.log("failed to decrypt: ", error);
        }

        return encryptedOrderHexStr;
    }


    const handleFormSubmit: MainFormProps['onSubmit'] = async (data) => {
        // Handle form submission here
        console.log(data);
        const sellAmount = +data["sellAmount"] * 10 ** await getTokenDecimals(data["sellToken"]);
        const buyAmount = +data["buyAmount"] * 10 ** await getTokenDecimals(data["buyToken"]);
        const order = await buildFusionOrder(
            data["sellToken"],
            data["buyToken"],
            sellAmount.toString(),
            provider.provider.selectedAddress,
            provider,
        )
        const encryptedOrderHexStr = await encrypt(nucypher, JSON.stringify(order), provider);
        try {
            const result = await IPFSClient.add(encryptedOrderHexStr);
            // Log the resulting IPFS hash
            console.log("Uploaded encrypted order to IPFS!");
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
                    <MainForm onSubmit={handleFormSubmit} provider={provider} />
                </Box>
            </div>
        ) : (
            <div>Loading nucypher, please wait...</div>
        )
    );
}

export default App;
