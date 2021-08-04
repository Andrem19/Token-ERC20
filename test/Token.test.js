//ERC-20 Token Standard
import { tokens, INVALID_ADDRESS, VM_EXCEPTION } from './helpers'
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

	let deployer = accounts[0]
	let receiver = accounts[1]
	let exchange = accounts[2]

	beforeEach(async () => {
		token = await Token.new();
	})
	describe('deployment', () => {
		it('traks the name', async () => {
			const name = await token.name()
			name.should.equal(myName)
		})

		it('tracks the symbol', async () => {
			const res = await token.symbol()
			res.should.equal(symb) //res?
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
	    let amount, result

	    describe('success', () => {
	        beforeEach(async () => {
                amount = tokens(100)
                result = await token.transfer(receiver, amount, { from: deployer})
            })

            it('transfers token balances', async () => {
                let balanceOf


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
                const event = log.args
                event.from.toString().should.equal(deployer, 'from is correct')
                event.to.toString().should.equal(receiver, 'to is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
            })
	    })

	    describe('failure', () => {
	        it('rejects invalid recipients', async () => {
                amount = tokens(100)
                let invalidRecipient = 0x0//in hexadecimals
                await token.transfer(invalidRecipient, amount, { from: deployer}).should.be.rejectedWith(INVALID_ADDRESS)
	        })
	        it('deployers balance to low', async () => {
	            amount = tokens(10000000)
	            await token.transfer(receiver, amount, { from: deployer}).should.be.rejectedWith(VM_EXCEPTION)

                //Attempt to transfer tokens, when you have none
                amount = tokens(10)//receiver has no tokens
                await token.transfer(deployer, amount, { from: receiver}).should.be.rejectedWith(VM_EXCEPTION)
	        })

	    })


	})
	describe('approving tokens', () => {
	    let result, amount

	    beforeEach(async () => {
	        amount = tokens(100)
	        result = await token.approve(exchange, amount, {from: deployer})
	    })

	    describe('success', () => {
	        it('allocates an allowance for delegated token spending on exchange', async () => {
	            const allowance = await token.allowance(deployer, exchange)
	            allowance.toString().should.equal(amount.toString())
	        })
	        it('emits an approval event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Approval')
                const event = log.args
                event.owner.toString().should.equal(deployer, 'owner is correct')
                event.spender.toString().should.equal(exchange, 'spender is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
	        })
	    })
	    describe('failure', () => {
            it('rejects invalid spender', async () => {
                await token.approve(0x0, amount, {from: deployer}).should.be.rejected

            })
	    })

	})

	describe('delegated token transfers', () => {
	    let amount, result

	    beforeEach(async () => {
	        amount = tokens(100)
	        await token.approve(exchange, amount, { from: deployer })
	    })

	    describe('success', () => {
            beforeEach(async () => {
               result = await token.transferFrom(deployer, receiver, amount, {from: exchange})

            })

            it('transfers token balances', async () => {

                let balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900).toString())
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString())
            })

            it('resets the allowance', async () => {
                const allowance = await token.allowance(deployer, exchange)
                allowance.toString().should.equal('0')
            })

            it('emits a transfer event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Transfer')
                const event = log.args
                event.from.toString().should.equal(deployer, 'from is correct')
                event.to.toString().should.equal(receiver, 'to is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
            })

	    })

	    describe('failure', () => {
            it('rejects insufficient amount', async () => {
                amount = tokens(200)
                token.transferFrom(deployer, receiver, amount, {from: exchange}).should.be.rejectedWith(VM_EXCEPTION)
            })
            it('rejects invalid recipients', async () => {
               await token.transferFrom(deployer, 0x0, amount, {from: exchange}).should.be.rejected
            })
	    })
	})
})