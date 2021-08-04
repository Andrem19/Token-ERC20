//https://www.freecodecamp.org/news/array-destructuring-in-es6-30e398f21d10/#:~:text=Destructuring%20in%20JavaScript%20is%20a,looks%20similar%20to%20array%20literals.
import { tokens, INVALID_ADDRESS, VM_EXCEPTION } from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
	.use(require('chai-as-promised'))
	.should()

	contract('Exchange', ([deployer, feeAccount, user1]) => {
        let exchange, token
        const feePercent = 10

        before(async () => {
            //Deploy token
            token = await Token.new()
            //Transfer some tokens to user1
            token.transfer(user1, tokens(100), {from: deployer})
            //Deploy exchange
            exchange = await Exchange.new(feeAccount, feePercent)
        })

        describe('deployment', () => {
            it('tracks the fee account', async () => {
               const res = await exchange.feeAccount()
               res.should.equal(feeAccount)
            })

            it('tracks the fee percent', async () => {
                const perc = await exchange.feePrecentage()
                perc.toString().should.equal(feePercent.toString())
            })

        })

        describe('depositing tokens', () => {
            let result
            let amount = tokens(10)



            describe('success', () => {
                beforeEach(async () => {
                    await token.approve(exchange.address, amount, {from: user1})
                    result = await exchange.depositToken(token.address, amount, {from: user1})

                })
                it('tracks the token deposit', async () => {
                //Check exchange token balance:
                    let bal = await token.balanceOf(exchange.address)
                    bal.toString().should.equal(amount.toString())
                    //Check tokens on exchange:
                    bal = await exchange.tokens(token.address, user1)
                    bal.toString().should.equal(amount.toString())
                })
                it('emits a Deposit event', async () => {
                    const log = result.logs[0]
                    log.event.should.eq('Deposit')
                    const event = log.args
                    console.log(event)
                    event.token.toString().should.equal(token.address, 'token address is correct')
                    event.user.should.equal(user1, 'user address is correct')
                    event.amount.toString().should.equal(tokens(10).toString(), 'amount is correct')
                    event.balance.toString().should.equal(tokens(10).toString(), 'balance is correct')
                })
            })
            describe('failure', () => {

                it('failure', async () => {
                    await token.approve(exchange.address, tokens(10), {from: user1})
                    amount = tokens(100)
                    await exchange.depositToken(token.address, amount, {from: user1}).should.be.rejected
                })
            })
        })
    })



