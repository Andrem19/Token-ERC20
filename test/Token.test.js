//ERC-20 Token Standard

const Token = artifacts.require('./Token')
require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', (acc) => {
	let token

	const myName = 'My Name'
	const symb = 'DTOK'
	const decim = '18'
	const totalSup = '1000000000000000000000000'

	beforeEach(async () => {
		token = await Token.new()
	})
	describe('deployment', () => {
		it('traks the name', async () => {
			const name = await token.name()
			name.should.equal(myName)
		})

		it('tracks the symbol', async () => {
			const res = await token.symbol()
			res.should.equal(symb)
		})

		it('tracks the decimals', async () => {
			const res = await token.decimals()
			res.toString().should.equal(decim)
		})

		it('tracks the total supply', async () => {
			const res = await token.totalSupply()
			res.toString().should.equal(totalSup)
		})
	})
})