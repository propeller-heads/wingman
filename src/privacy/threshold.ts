export const threshold: string = "Threshold Order Privacy"

import { Cohort } from '@nucypher/nucypher-ts';

const config = {
    threshold: 3,
    shares: 5,
    porterUri: 'https://porter-tapir.nucypher.community',
};

export function encrypt(): void {
    const cohort = Cohort.create(config);
    console.log("Hello from the threshold privacy module!");
}
