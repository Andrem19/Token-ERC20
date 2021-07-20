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

	describe('send tokens', () => {
	    let balanceOf, amount, result
	    let deployer = accounts[0]
	    let receiver = accounts[1]

	    beforeEach(async () => {
	        amount = tokens(100)
	        result = await token.transfer(receiver, amount, { from: deployer})
	    })

	    it('transfers token balances', async () => {
	        //After transfer
	        balanceOf = await token.balanceOf(deployer)
	        balanceOf.toString().should.equal(tokens(999900).toString())

	        balanceOf = await token.balanceOf(receiver)
	        balanceOf.toString().should.equal(tokens(100).toString())
	    })

	    it('emits a transfer event', async () => {
            //console.log(result)
	        //console.log(result.logs)

	        const log = result.logs[0]

            log.event.should.equal('Transfer')

            const event = log.args;

            event.from.toString().should.equal(deployer, 'from is correct')
            event.to.toString().should.equal(receiver, 'to is correct')
            event.value.toString().should.equal(amount.toString(), ' value is correct')
	    })


	})

})