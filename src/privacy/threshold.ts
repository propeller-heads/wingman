export const threshold: string = "Threshold Order Privacy"

const config = {
    threshold: 2,
    shares: 3,
    porterUri: 'https://porter-tapir.nucypher.community',
};


export function createIsWhitelistedCondition(
    nucypher: any,
    whitelistAddress: string = "0x5d61e99FDDB574433F4e2492E8615A2cD00ed3a1",
    chainId: number = 80001,
): any {
    const conditionConfig = {
        contractAddress: whitelistAddress,
        method: "isResolver",
        parameters: [":userAddress"],
        functionAbi: {
            inputs:
                [
                    {
                        internalType: "address",
                        name: "resolver",
                        type: "address"
                    }
                ],
            name: "isResolver",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool"
                }
            ],
            stateMutability: 'view',
            type: 'function',
        },
        chain: chainId,
        returnValueTest: {
            comparator: "==",
            value: true
        }
    };
    return new nucypher.Conditions.Condition(conditionConfig);
}


export async function encrypt(nucypher: any): Promise<void> {
    const cohort = await nucypher.Cohort.create(config);
    console.log("Hello from the threshold privacy module!");
}