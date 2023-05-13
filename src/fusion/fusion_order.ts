import { AuctionSalt, AuctionSuffix, FusionOrder, LimitOrderV3Struct } from '@1inch/fusion-sdk'


export function buildFusionOrder(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    minBuyAmount: string,
    wallet: string
): LimitOrderV3Struct {

    const salt = new AuctionSalt({
        duration: 604800*4, // one month
        auctionStartTime: Math.floor(Date.now() / 1000),
        initialRateBump: 50000,
        bankFee: '0'
    })

    const suffix = new AuctionSuffix({
        points: [
            {
                coefficient: 20000,
                delay: 12
            }
        ],
        whitelist: [
            {
                address: wallet,
                allowance: 0
            }
        ]
    })

    const order = new FusionOrder(
        {
            makerAsset: sellToken,
            takerAsset: buyToken,
            makingAmount: sellAmount,
            takingAmount: minBuyAmount,
            maker: wallet
        },
        salt,
        suffix
    )

    return order.build()
    /* #=> {
                allowedSender: '0x0000000000000000000000000000000000000000',
                interactions:
                    '0x000c004e200000000000000000219ab540356cbb839cbe05303d7705faf486570009',
                maker: '0x00000000219ab540356cbb839cbe05303d7705fa',
                makerAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                makingAmount: '1000000000000000000',
                offsets: '0',
                receiver: '0x0000000000000000000000000000000000000000',
                salt: '45118768841948961586167738353692277076075522015101619148498725069326976558864',
                takerAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                takingAmount: '1420000000'
            }
    */
}


