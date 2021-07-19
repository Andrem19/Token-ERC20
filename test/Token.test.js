//ERC-20 Token Standard
import { tokens } from './helpers'
const Token = artifacts.require('./Token')
require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', (accounts) => {
	let token

	const myName = 'My Name'
	const symb = 'DTOK'
	const decim = '18'
	const totalSup = tokens(1000000).toString()//'1000000000000000000000000'

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

		it('assigns the total supply to the deployer', async () => {
			const res = await token.balanceOf(accounts[0])
			res.toString().should.equal(totalSup)
		})
	})

	describe('deployment', () => {
	    it('transfers token balances', async () => {
	        let balanceOf
	        let deployer = accounts[0]
	        let receiver = accounts[1]

	        balanceOf = await token.balanceOf(deployer)
	        console.log("deployer balance before transfer", balanceOf.toString())

	        balanceOf = await token.balanceOf(receiver)
	        console.log("receiver balance before transfer", balanceOf.toString())

            //Transfer
            await token.transfer(receiver, tokens(100), { from: deployer})//function metadata
            //After transfer
            balanceOf = await token.balanceOf(deployer)
	        console.log("deployer balance after transfer", balanceOf.toString())
	        balanceOf.toString().should.equal(tokens(999900).toString())

	        balanceOf = await token.balanceOf(receiver)
	        console.log("receiver balance after transfer", balanceOf.toString())
	        balanceOf.toString().should.equal(tokens(100).toString())


	    })
	})
})