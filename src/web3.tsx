import { ethers } from 'ethers';

const INFURA_POLYGON_MUMBAI_ENDPOINT = 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78';
const provider = new ethers.providers.JsonRpcProvider(INFURA_POLYGON_MUMBAI_ENDPOINT);


export async function getTokenDecimals(contractAddress: string) {
    const erc20AbiFragment = [
        {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [
                {
                    name: '',
                    type: 'uint8',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ];

    const tokenContract = new ethers.Contract(contractAddress, erc20AbiFragment, provider);
    const decimals = await tokenContract.decimals();
    return decimals;
}
