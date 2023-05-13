export const threshold: string = "Threshold Order Privacy"

import { Cohort, Conditions, Condition } from '@nucypher/nucypher-ts';

const config = {
    threshold: 2,
    shares: 3,
    porterUri: 'https://porter-tapir.nucypher.community',
};


export function createPriceCondition(
    oracleAddress: string,
    triggerPrice: number, // TODO: Update this type once we have ethereum libs
    comparator: string,
    chainId: number = 1,
): Condition {
    const conditionConfig = {
        contractAddress: oracleAddress,
        method: "latestAnswer",
        parameters: [],
        functionAbi: {
            inputs: [],
            name: "latestAnswer",
            outputs: [
                {
                    internalType: "int256",
                    name: "",
                    type: "int256"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        chain: chainId,
        retrurnValueTest: {
            comparator: comparator,
            value: triggerPrice
        }
    };
    return new Conditions.Condition(conditionConfig);
}


export async function encrypt(): Promise<void> {
    const cohort = await Cohort.create(config);
    console.log("Hello from the threshold privacy module!");
}
