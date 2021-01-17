import React, { Component } from 'react';
import Web3 from 'web3';
import Eth from 'web3-eth';

import './App.css';
import Bank from '../abis/Bank.json';

import Navbar from './Navbar.js';
import Main from './Main.js';
import Record from './Record.js';
import AlertRecord from './alertRecord.js';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    window.addEventListener("load", async() => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
        console.log("WINDOW ETHEREUM")
        console.log(window.web3)

      }
      else if (window.web3) {
        window.eth = new Web3(window.web3.currentProvider)
        console.log("WINDOW WEB3")
      }
      else {
        console.log("Non-ethereum browser detected. You should consider trying MetaMask!");
      }
    })
  }

  async loadBlockchainData() {
    const weth = window.web3.currentProvider // window.web3
    const web3 = new Web3(window.ethereum)

    console.log(web3)
    // Load account
    const account_address = await web3.givenProvider.selectedAddress
    this.setState( {account: account_address} )
    console.log(this.state.account)

    // Load network detail
    const networkId = await weth.networkVersion
    const networkData = Bank.networks[networkId]
    if(networkData) {
      //Load contract information
      const bank = new web3.eth.Contract(Bank.abi, networkData.address)
      this.setState( {bank} )
      console.log(bank)
      const depositCount = await bank.methods.counterDeposit().call()
      const withdrawCount = await bank.methods.counterWithdraw().call()

      var num = await this.state.bank.methods.totalAmount().call()
      num = num.toString()
      console.log(num)
      const totalAmount = web3.utils.fromWei(num, "Ether")

      num = await this.state.bank.methods.getBalance().call({from: this.state.account})
      num = num.toString()
      console.log(num)
      const balance = num

      num = await this.state.bank.methods.threshold().call()
      const threshold = num.toString()
      console.log(threshold)

      num = await this.state.bank.methods.upper_threshold().call()
      const upperThreshold = num.toString()
      console.log(upperThreshold)

      const owner = await this.state.bank.methods.owner().call()

      console.log(depositCount.toString())
      this.setState( {depositCount} )
      this.setState( {withdrawCount} )
      this.setState( {totalAmount} )
      this.setState( {balance} )
      this.setState( {threshold} )
      this.setState( {upperThreshold} )
      this.setState( {owner} )
      console.log(this.state.depositCount)

      if(owner.toUpperCase() === this.state.account.toUpperCase()){
        this.setState({ user: false })
        console.log(this.state.user)
      }

      //**********************************************

      for(var i=1; i<=depositCount; i++){
        console.log("Start")
        const list = await bank.methods.depositList(i).call()
        this.setState({
          depositList: [...this.state.depositList, list]
        })
        if(this.state.totalAmount >= upperThreshold) {
            this.state.alertDList.push(list)
        }

        const currentAddress = this.state.depositList[i-1].account
        console.log(currentAddress.toUpperCase() === this.state.account.toUpperCase())
        if(currentAddress.toUpperCase() === this.state.account.toUpperCase()){
          this.state.currentDList.push(list)
        }
      }

      //**********************************************

      for(var i=1; i<=withdrawCount; i++){
        const list = await bank.methods.withdrawList(i).call()
        this.setState({
          withdrawList: [...this.state.withdrawList, list]
        })
        if(this.state.totalAmount >= upperThreshold) {
            this.state.alertWList.push(list)
        }

        const currentAddress = this.state.withdrawList[i-1].account
        if(currentAddress.toUpperCase() === this.state.account.toUpperCase()){
          this.setState({ currentWList: [...this.state.withdrawList] })
        }
      }

      //**********************************************
    }

    else {

      console.log('Contract not deployed to detected network.')
      }
    this.setState({ loading:false })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      depositCount: 0,
      withdrawCount: 0,
      totalAmount: 0,
      depositList: [],
      withdrawList: [],
      alertDList: [],
      alertWList: [],
      currentDList: [],
      currentWList: [],
      balance: '',
      loading: false,
      owner: '',
      user: true
    }

    this.depositEth = this.depositEth.bind(this) //To let react know that render createProduct is same as outer createProduct
    this.withdrawEth = this.withdrawEth.bind(this)

  }

  depositEth(amount) {
    console.log(this.state.account)
    console.log(amount)
    this.state.bank.methods.deposit(amount).send({ from: this.state.account, value: amount })
    .once("receipt", function(error, result){
        if(!error){
          console.log(result)
      }
    })
//    console.log(amount/1000000000000000000)
    console.log(this.state.threshold)
    console.log(amount)

    if(this.state.totalAmount >= this.state.threshold){
      window.alert("Contract has exceed maximum threshold, all transaction will be monitor.")
    }

    else if(this.state.totalAmount >= this.state.threshold || amount/1000000000000000000 >= this.state.threshold){
      window.alert("Contract has exceed minimal threshold. (20 ETH)")
    }
  }

  withdrawEth(amount) {
    console.log(this.state.account)
    this.state.bank.methods.withdraw(amount).send({ from: this.state.account })
    console.log("Withdraw : " + amount)
  }



  render() {
    return (
      <div>
        <Navbar account={this.state.owner}/>
        {this.state.user
          ?
          <div className="container-fluid mt-5">
          <h4 style={{textAlign:"center", backgroundColor:"#F1DABF", boxShadow:" 1px 1px 1px #999"}}> User Address : {this.state.account}</h4>
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading... </p></div>
                : <Main
                    totalAmount={this.state.totalAmount}
                    balance={this.state.balance.toString()}
                    depositEth={this.depositEth}
                    withdrawEth={this.withdrawEth}
                  />
              }
              </main>
            </div>
          </div>
          :
          <div className="container-fluid mt-5">
            <h3 style={{textAlign:"center"}}>Owner Page</h3>
          </div>
        }



        <div className="container-fluid mt-2">
          <h1 style={{textAlign:"center", backgroundColor:"#8EB4E6", boxShadow:" 1px 1px 1px #999"}}>
            Total Amount in Contract : {this.state.totalAmount.toString()} ETH
          </h1>
        </div>
        {this.state.user
          ?
          <div className="container-fluid mt-2" >
          <main role="main" className="col-lg-12 d-flex text-center">
            <div style={{textAlign:"center", boxShadow:" 2px 2px 2px #999", width:"100%"}}>
                  <Record
                  transaction={"Deposit Transaction"}
                  list={this.state.currentDList}
                  />
            </div>
          </main>

          <main role="main" className="col-lg-12 d-flex text-center" style={{marginTop:"10px"}}>
            <div style={{textAlign:"center", boxShadow:" 2px 2px 2px #999", width:"100%", marginBottom:"10px"}}>
                  <Record
                  transaction={"Withdraw Transaction"}
                  list={this.state.currentWList}
                  />
            </div>
          </main>
          </div>

          :
          <div className="container-fluid mt-2" >
          <main role="main" className="col-lg-12 d-flex text-center">
              <div style={{textAlign:"center", backgroundColor:"#F1DABF", boxShadow:" 2px 2px 2px #999", width:"100%"}}>
                <AlertRecord
                transaction={"Deposit"}
                list={this.state.alertDList}
                />
              </div>
          </main>

          <main role="main" className="col-lg-12 d-flex text-center">
              <div style={{textAlign:"center", backgroundColor:"#F1DABF", boxShadow:" 2px 2px 2px #999", width:"100%"}}>
                <AlertRecord
                transaction={"Withdraw"}
                list={this.state.alertWList}
                />
              </div>
          </main>
          </div>
        }

      </div>
    );
  }
}

export default App;
