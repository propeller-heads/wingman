export const threshold: string = "Threshold Order Privacy"

const config = {
    threshold: 2,
    shares: 3,
    porterUri: 'https://porter-tapir.nucypher.community',
};


export function createPriceCondition(
    nucypher: any,
    oracleAddress: string,
    triggerPrice: number, // TODO: Update this type once we have ethereum libs
    comparator: string,
    chainId: number = 1,
): any {
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
    return new nucypher.Conditions.Condition(conditionConfig);
}


export async function encrypt(nucypher: any): Promise<void> {
    const cohort = await nucypher.Cohort.create(config);
    console.log(cohort);
    console.log("Hello from the threshold privacy module!");
}
