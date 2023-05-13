import { FusionSDK, NetworkEnum, getLimitOrderV3Domain, BlockchainProviderConnector } from '@1inch/fusion-sdk'
import {Web3ProviderConnector} from './provider'

export async function buildFusionOrder(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    wallet: string,
    provider: Web3ProviderConnector,
): Promise<any>{
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
        walletAddress:wallet
    };

    const {order, quoteId} = await sdk.createOrder(params);

    const orderStruct = order.build();
  
    const { chainId } = await blockchainProvider.getNetwork();
    const domain = getLimitOrderV3Domain(chainId);
    const a  =  order.getTypedData(domain)
    const signature = await blockchainProvider.signTypedData(
        orderStruct.maker,
        order.getTypedData(domain)
    )

    return {
            order: order,
            signature: signature,
            quoteId: quoteId
        }
}


