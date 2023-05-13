import { FusionSDK, NetworkEnum, getLimitOrderV3Domain } from '@1inch/fusion-sdk'
import {Web3ProviderConnector} from './provider'

export async function getFusionQuote(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    provider: Web3ProviderConnector,
): Promise<any> {
    const blockchainProvider = new Web3ProviderConnector(provider)
    const sdk = new FusionSDK({
        url: 'https://fusion.1inch.io',
        network: NetworkEnum.POLYGON,
        blockchainProvider: blockchainProvider,
    });

    const params = {
        fromTokenAddress: sellToken,
        toTokenAddress: buyToken,
        amount: sellAmount,
    };
    const quote = await sdk.getQuote(params);

    return quote;
}

  export {};


