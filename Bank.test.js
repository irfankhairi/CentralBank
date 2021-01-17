const Bank = artifacts.require("./Bank.sol")

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract ("Bank", ([deployer, user1, user2]) => {
  let bank

  before(async () => {
    bank = await Bank.deployed()
  })

  describe("deployment" , async => {

    it ("deploys successfully", async () => {
      const address = await bank.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, "")
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe("transaction", async () => {
    let deposit, counterDeposit, withdraw, counterWithdraw, balance, total

    before(async () => {
      total = await bank.totalAmount()
      console.log(total)
      deposit = await bank.deposit(web3.utils.toWei("5", "Ether"), { from: user1 })
      counterDeposit = await bank.counterDeposit()

//      withdraw = await bank.withdraw(web3.utils.toWei("2", "Ether"))
      counterWithdraw = await bank.counterWithdraw()

      balance = await bank.getBalance({from: user1})
      const event = deposit.logs[0].args
    })

    it("deposit", async () => {
      // SUCCESS
      assert.equal(counterDeposit, 1)
      const event = deposit.logs[0].args
      console.log(event)
      assert.equal(event.transactionID.toNumber(), counterDeposit.toNumber(), "Counter / ID is correct")
      assert.equal(event.account, user1, "User matched")
      assert.equal(event.amount, "5000000000000000000", "Amount is correct")
      assert.equal(balance, "5000000000000000000", "Balance is correct")
      console.log(balance)
      withdraw = await bank.withdraw(web3.utils.toWei("2", "Ether"))
      console.log("WITHDRAW")
      // FAILURE:Product must have AMOUNT
      await bank.deposit(0, { from: user1 }).should.be.rejected;
    })

//     it("withdraw", async () => {
//       // SUCCESS
//       assert.equal(counterWithdraw, 1)
//       const event = withdraw.logs[0].args
//       console.log(event)
//       assert.equal(event.transactionID.toNumber(), counterWithdraw.toNumber(), "Counter / ID is correct")
//       assert.notEqual(event.account, user1, "User matched")
//       assert.equal(event.amount, "2000000000000000000", "Amount is correct")
//
//       // FAILURE:Product must have AMOUNT
// //      await bank.withdraw(0).should.be.rejected;
//     })


  })

  // describe("transaction : withdraw", async () => {
  //   let withdraw, counterWithdraw
  //
  //   before(async () => {
  //     bank.balance[user1] += web3.utils.toWei("5", "Ether")
  //     withdraw = await bank.withdraw(web3.utils.toWei("2", "Ether"), { from: user1, value: web3.utils.toWei("2", "Ether")})
  //     counterWithdraw = await bank.counterWithdraw()
  //   })
  //
  //   it("withdraw", async () => {
  //     // SUCCESS
  //     assert.equal(counterWithdraw, 1)
  //     const event = withdraw.logs[0].args
  //     assert.equal(event.transaction_id.toNumber(), counterWithdraw.toNumber(), "Counter / ID is correct")
  //     assert.equal(event.account, user1, "User matched")
  //     assert.equal(event.amount, "2000000000000000000", "Amount is correct")
  //
  //     // FAILURE:Product must have AMOUNT
  //     await bank.withdraw(0, { from: user1 }).should.be.rejected;
  //
  //   })
  // })

})
