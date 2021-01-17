import React, { Component } from 'react';

class Record extends Component {
  render() {
    return (

      <div style={{width:"100%", backgroundColor:"#F1DABF"}}>
      <h4 style={{backgroundColor:"#a88863", marginBottom:"0px"}}> Alert ({this.props.transaction}) </h4>
        <table style={{width:"100%", boxShadow:" 2px 2px 2px #999"}}>
          <thead>
            <tr>
            <th>ID (by {this.props.transaction})</th>
            <th>Address</th>
            <th>Amount (ETH)</th>
            <th>Time (UNIX)</th>
            </tr>
          </thead>
          <tbody>
          { this.props.list.map((list, key) => {
              return(
                <tr key={key}>
                  <td>{list.transaction_id.toString()}</td>
                  <td>{list.account}</td>
                  <td>{list.amount.toString()}</td>
                  <td>{list.time.toString()}</td>
                  <td> </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </div>

    );
  }
}

export default Record;
