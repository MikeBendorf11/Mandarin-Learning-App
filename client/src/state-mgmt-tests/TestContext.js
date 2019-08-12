import React from 'react';
const Amount = React.createContext(1);

//one consumer one provider only allowed 
//provider passes amount and counter uses aamount to set it's own state. Child/Consumer is not modifiying parent/provider state

class Counter extends React.Component {
  state = { count: 0 };
  increment = amount => { this.setState({ count: this.state.count + amount }); };
  decrement = amount => { this.setState({ count: this.state.count - amount }); };
  render() {
    return (
      <Amount.Consumer>
        {amount => (
          <div>
            <span>{this.state.count}</span>
            <button onClick={() => this.decrement(amount)}>-</button>
            <button onClick={() => this.increment(amount)}>+</button>
          </div>
        )}
      </Amount.Consumer>
    );
  }
}

class AmountAdjuster extends React.Component {
  state = { amount: 0 };
  handleChange = event => {
    this.setState({
      amount: parseInt(event.currentTarget.value, 10)
    });
  };
  render() {
    return (
      <Amount.Provider value={this.state.amount}>
        <div>
          {this.props.children}
          <input type="number" value={this.state.amount} onChange={this.handleChange}/>
        </div>
      </Amount.Provider>
    );
  }
}


export default function test(){
  return(
    <AmountAdjuster>
      <Counter/>
    </AmountAdjuster>
  );
} 