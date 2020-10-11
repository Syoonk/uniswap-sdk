import { ChainId, Token, Pair, TokenAmount, WETH, Price } from '../src'

describe('Pair', () => {
  const REP = new Token(ChainId.KOVAN, '0xFDdD3937EC8Af1Fdb6619155D404186c7625E3Ca', 18, 'REP', 'REP Token')
  const KNG = new Token(ChainId.KOVAN, '0x4BEA03F44F02187f8085Aaf8e6E82cAF43148Ef0', 18, 'KNG', 'KNG Token')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(REP, '100'), new TokenAmount(WETH[ChainId.RINKEBY], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(REP, KNG)).toEqual('0x2112728A8b7A48229B5cD074f2BfbcB647F25B26')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '100')).token0).toEqual(KNG)
      expect(new Pair(new TokenAmount(KNG, '100'), new TokenAmount(REP, '100')).token0).toEqual(KNG)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '100')).token1).toEqual(REP)
      expect(new Pair(new TokenAmount(KNG, '100'), new TokenAmount(REP, '100')).token1).toEqual(REP)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '101')).reserve0).toEqual(
        new TokenAmount(KNG, '101')
      )
      expect(new Pair(new TokenAmount(KNG, '101'), new TokenAmount(REP, '100')).reserve0).toEqual(
        new TokenAmount(KNG, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '101')).reserve1).toEqual(
        new TokenAmount(REP, '100')
      )
      expect(new Pair(new TokenAmount(KNG, '101'), new TokenAmount(REP, '100')).reserve1).toEqual(
        new TokenAmount(REP, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(REP, '101'), new TokenAmount(KNG, '100')).token0Price).toEqual(
        new Price(KNG, REP, '100', '101')
      )
      expect(new Pair(new TokenAmount(KNG, '100'), new TokenAmount(REP, '101')).token0Price).toEqual(
        new Price(KNG, REP, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(REP, '101'), new TokenAmount(KNG, '100')).token1Price).toEqual(
        new Price(REP, KNG, '101', '100')
      )
      expect(new Pair(new TokenAmount(KNG, '100'), new TokenAmount(REP, '101')).token1Price).toEqual(
        new Price(REP, KNG, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(REP, '101'), new TokenAmount(KNG, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(KNG)).toEqual(pair.token0Price)
      expect(pair.priceOf(REP)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.KOVAN])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '101')).reserveOf(REP)).toEqual(
        new TokenAmount(REP, '100')
      )
      expect(new Pair(new TokenAmount(KNG, '101'), new TokenAmount(REP, '100')).reserveOf(REP)).toEqual(
        new TokenAmount(REP, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(KNG, '101'), new TokenAmount(REP, '100')).reserveOf(WETH[ChainId.KOVAN])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '100')).chainId).toEqual(ChainId.KOVAN)
      expect(new Pair(new TokenAmount(KNG, '100'), new TokenAmount(REP, '100')).chainId).toEqual(ChainId.KOVAN)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '100')).involvesToken(REP)).toEqual(true)
    expect(new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '100')).involvesToken(KNG)).toEqual(true)
    expect(
      new Pair(new TokenAmount(REP, '100'), new TokenAmount(KNG, '100')).involvesToken(WETH[ChainId.KOVAN])
    ).toEqual(false)
  })
})
