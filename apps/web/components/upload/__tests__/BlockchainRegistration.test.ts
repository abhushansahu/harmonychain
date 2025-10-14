import { BlockchainRegistration } from '../BlockchainRegistration'

describe('BlockchainRegistration', () => {
  const reg = new BlockchainRegistration('0xContract', {}, '0xAccount')

  it('validates registration data', () => {
    const result = reg.validateRegistrationData('', { title: '', artist: '', genre: '', tags: [], explicit: false }, {
      type: 'free', price: 0, currency: 'ETH', royaltyPercentage: 10, commercialUse: true, derivativeWorks: true,
      distribution: true, performance: true, synchronization: true, attribution: true, shareAlike: false,
      nonCommercial: false, noDerivatives: false, territories: ['Worldwide'], platforms: ['Streaming Services']
    } as any)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('estimates gas', async () => {
    const estimate = await reg.estimateGasCost()
    expect(estimate.gasLimit).toBeGreaterThan(0)
  })
})


