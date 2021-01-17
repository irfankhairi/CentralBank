import React, { Component } from 'react';

class Main extends Component {
  render() {
    return (

      <div id="content" style={{width:"100%"}}>


        <table style={{backgroundColor:'aquamarine', width:"100%", boxShadow:" 2px 2px 2px #999"}}>
          <thead>
            <tr style={{height:"100px"}}>
              <th scope="col"><h1>Deposit</h1></th>
              <th scope="col"><h1>Withdraw</h1></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{height:"150px"}}>
              <td>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const amount = window.web3.utils.toWei(this.amountDeposit.value.toString(), 'Ether')
                  console.log("AMOUNT = " + amount)
                  this.props.depositEth(amount)

                }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="depositFunction"
                      type="number"
                      ref={(input) => { this.amountDeposit = input }}
                      className="form-control"
                      placeholder="Enter Amount"
                      required />
                  </div>

                  <button type="submit" className="btn btn-primary">Deposit</button>
                </form>
              </td>
              <td>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const amount = window.web3.utils.toWei(this.amountWithdraw.value.toString(), 'Ether')
                  console.log("AMOUNT = " + amount)
                  this.props.withdrawEth(amount)

                }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="withdrawFunction"
                      type="number"
                      ref={(input) => { this.amountWithdraw = input }}
                      className="form-control"
                      placeholder="Enter Amount"
                      required />
                  </div>
                  <button type="submit" className="btn btn-primary">Withdraw</button>
                </form>
              </td>
            </tr>
            <tr style={{height:"100px"}}>
              <th scope="col" style={{textAlign:"right"}}>
                <h3>Balance in Account </h3>
              </th>

              <th scope="col" style={{textAlign:"left"}}>
                <h3> : {this.props.balance} Wei</h3>
              </th>
            </tr>
          </tbody>
        </table>

      </div>

    );
  }
}

export default Main;
