import { buildFusionOrder } from './fusion_order';

describe('buildFusionOrder', () => {
  it('should return a valid LimitOrderV3Struct object', () => {

    const sellToken = 'sellToken';
    const buyToken = 'buyToken';
    const sellAmount = '1000000000000000000';
    const minBuyAmount = '1420000000';
    const wallet = 'walletAddress';
    const privateKey = 'privateKey';

    const result = buildFusionOrder(sellToken, buyToken, sellAmount, minBuyAmount, wallet, privateKey);

    expect(result.maker).toEqual(wallet);
    expect(result.makerAsset).toEqual(sellToken);
    expect(result.makingAmount).toEqual(sellAmount);
    expect(result.takerAsset).toEqual(buyToken);
    expect(result.takingAmount).toEqual(minBuyAmount);

  });
});
