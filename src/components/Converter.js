import React from 'react';
import axios from 'axios';

var valid = true;

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: null,
      currencyArray: [],
      error: false,
      errorMessage: '',
      result: null,
      fromCurrency: 'EUR',
      toCurrency: 'INR',
    };
  }

  componentDidMount() {
      axios.get('https:/api.exchangeratesapi.io/latest')
      .then(response => {
        const currencyAr = ['EUR'];
        for (const key in response.data.rates) {
          currencyAr.push(key);
        }
        this.setState({ currencyArray: currencyAr });
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  }

  changeHandler = event => {
    valid = false
    this.setState({ [event.target.id]: event.target.value},()=> {
     valid = true
   })
  };

  resultHandler = () => {
    console.log("this.state.inputValue",this.state.inputValue)
    if (this.state.inputValue > 0 && this.state.fromCurrency !== this.state.toCurrency) {
      axios.get(`https://api.exchangeratesapi.io/latest?base=${
            this.state.fromCurrency
          }&symbols=${this.state.toCurrency}`
        )
        .then(response => {
          const result =
            this.state.inputValue * response.data.rates[this.state.toCurrency];
            this.setState({ result: result.toFixed(2),
                            error: false});
        })
        .catch(error => {
          console.log('Error : ', error.message);
        });
    }
     else {
       if(this.state.inputValue == 0 || this.state.inputValue === null){
           this.setState({ errorMessage: "* Please enter the Amount for Conversion",
           error: true });
         }
         else{
           this.setState({ errorMessage: "* Please choose two different options from the DropDown's, same currency cannot be coverted",
           error: true });
  }
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1 className='title'> Currency Converter </h1>
        <div className='inputContainer'>
        <label for="inputValue">Amount :</label>
          <input
            id='inputValue'
            type='number'
            value={this.state.inputValue}
            onChange={event => this.changeHandler(event)}
            placeholder="eg. 30"
          />
          </div>
          <div className='currencyDropdown'>
          <label>From :</label>
          <select
            id='fromCurrency'
            onChange={event => this.changeHandler(event)}
            value={this.state.fromCurrency}
          >
            {this.state.currencyArray.map(currency => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
          <label>To :</label>
          <select
            id='toCurrency'
            onChange={event => this.changeHandler(event)}
            value={this.state.toCurrency}
          >
            {this.state.currencyArray.map(currency => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
          </div>
          <div className='buttonContainer'>
          <button onClick={this.resultHandler}>Convert</button>
          </div>
          {valid ? !this.state.error && this.state.result ? <div><span className='result'>Converted Currency Value from {this.state.fromCurrency} to {this.state.toCurrency} is <span className='resultValue'> {this.state.result}</span></span>
          </div> : <div className='result error'>{this.state.errorMessage}</div>: null}
      </React.Fragment>
    );
  }
}
export default Converter;
