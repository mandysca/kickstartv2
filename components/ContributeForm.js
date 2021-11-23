import React, { Component } from "react";

//Import UI component
import { Form, Input, Message, Button } from 'semantic-ui-react';

// get a handle to the campaign object
import Campaign from '../etherium/campaign.js'

// Import web3 because we need account list
import web3 from '../etherium/web3';

// Import Router to refresh the page
import { Router } from '../routes';

class ContributeForm extends Component {
  // Initialize the state variable
  state = {
    value: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    // Don't allow to submit itself
    event.preventDefault();

    // Get the campaign object at the address passed to the function
    const campaign = Campaign(this.props.address);

    // Set the loading flag spinner
    this.setState({ loading: true, errorMessage: '' });

    try {
      // Get the account
      const accounts = await web3.eth.getAccounts();

      // Send the contributions
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      // Refresh page - point to the current address path ES6/ES2015 format
      Router.replaceRoute(`/campaigns/${this.props.address}`);

    } catch (err) {
      this.setState({ errorMessage: err.message });

    }

    // Reset the form
    this.setState({ loading: false, value: '' });

  }

  // No paranthesis on onSubmit as we don't want to invoke it on load
  render() {
    return(
      <Form onSubmit= {this.onSubmit} error = {!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value = {this.state.value}
            onChange = {event => this.setState({value: event.target.value})}
            label = "ether"
            labelPosition = "right"
          />
        </Form.Field>
        <Message
          // Property error needs to be setup on Form so that error shows up
          error
          header = "Oops!"
          content = {this.state.errorMessage}
        />
        <Button primary loading = {this.state.loading}>
          Contribute!
        </Button>
      </Form>
    );

  }
}

export default ContributeForm;
