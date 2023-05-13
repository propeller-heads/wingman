import { createPriceCondition } from './threshold';

describe("test conditions", () => {
    test("price below validates", async () => {
        const nucypher = await import('@nucypher/nucypher-ts');
        const stopCondition = createPriceCondition(nucypher, "0x0715A7794a1dc8e42615F059dD6e406A6594651A", 179922000000, "<=", 80001);
        stopCondition.validate();
    });
});