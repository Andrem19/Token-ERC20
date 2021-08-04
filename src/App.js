import React, { Component } from 'react';
import Web3 from 'web3';
import Token from './abis/Token.json';
import Exchange from './abis/Exchange.json'
import './App.css';

class App extends Component {

async componentWillMount() {
  await this.loadWeb3()
  await this.loadBlockchainData()
}


  async loadBlockchainData() {
      const web3 = window.web3

      const accounts = await web3.eth.getAccounts()
      this.setState({account: accounts[0]})

      const myBalance = await web3.eth.getBalance(this.state.account)
      this.setState({myBalance})
      //Load token
            const networkId = await web3.eth.net.getId()
            const tokenData = Token.networks[networkId]
            if(tokenData) {
              const token = new web3.eth.Contract(Token.abi, tokenData.address)
              this.setState({token})
            let tokenBalance = await token.methods.balanceOf(this.state.account).call()
            this.setState({tokenBalance: tokenBalance.toString()})
            } else {
              window.alert('Token contract not deployed to detected network')
            }
      //Load Exchange
            const exchangeData = Exchange.networks[networkId]
            if(exchangeData) {
              const exchange = new web3.eth.Contract(Exchange.abi, exchangeData.address)
              this.setState({exchange})
            } else {
              window.alert('EthSwap contract not deployed to detected network')
            }
            this.setState({loading: false})
  }

  async loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable()
      }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      myBalance: 0,
      token: {},
      exchange: {},
      loading: true,
    }
}

  render() {
  return (
    <div className="App">
    <p>Exchange</p>
    <p>My address: {this.state.account}</p>
    <p>My balance: {window.web3.utils.fromWei(this.state.myBalance.toString(), 'Ether')}</p>
    </div>
  );
}
}

export default App;
