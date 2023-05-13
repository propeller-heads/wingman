import Web3Modal from "web3modal";
import { InjectedConnector } from "@web3-react/injected-connector";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

export function getWeb3Modal() {
    return new Web3Modal({
        network: "mainnet", // Change this to the desired network
        cacheProvider: true, // Enable cache to remember the connected wallet
        providerOptions: {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: "YOUR_INFURA_ID", // Replace with your own Infura Project ID
                },
            },
        },
    });
}
