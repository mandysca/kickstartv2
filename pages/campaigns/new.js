// Next.js components to be executed on the serverside
import React, {Component} from 'react';

// Import for the better styling of the modules
import { Form, Button, Input, Message } from 'semantic-ui-react';

// Import layout
import Layout from '../../components/Layout.js'

// Import the factory object from factory.js
import factory from '../../etherium/factory';

// Import web3 because we need account list
import web3 from '../../etherium/web3';

// Import the Link to create naviagation, and Router to programatically redirect
import { Link, Router } from '../../routes';

class CampaignNew extends Component {

  // State variable that will track the user input
  state = {
    // Title
    title : '',
    // Campaign description
    description : '',
    // contribution from user
    minimumContribution:'',
    // Error message if things didn't work as expected
    errorMessage: '',
    // Loading flag
    loading: false
  };

  // Method to be called on Submit, syntax specific to enable binding of variables
  // passing event, and preventDefault to restrict browser from submitting form
  // When called from <Form> no parenthesis are needed
  onSubmit = async (event) => {
    event.preventDefault();

    // Show a spinner to indicate to the user the transaction is in process
    // and set error message to blank
    this.setState ({
      loading: true,
      errorMessage: ''
    });

    // try to execute the transaction
    try {
      // Get the account
      const accounts = await web3.eth.getAccounts();
      // Create a new campaign
      const campaigns = await factory.methods
      .createCampaign(this.state.minimumContribution, this.state.title, this.state.description)
      .send({
        from: accounts[0]
      });
      // Here we want to redirect user to root requests/index
      Router.pushRoute('/');
    } catch (err) {
      // Set the state varaible with error message
      // Error property needs to be setup in the form for message to show
      this.setState({ errorMessage: err.message});
    }
    this.setState ({ loading: false });
  };

  /*
  Notes: !! (two exclamations convert the string to its equivalent boolean value)
  */
  render () {
    return (
      <Layout>
        <h3>Create a Campaign!</h3>
        <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
          <Form.Field>
            <label>Campaign Title</label>
            <Input
              value = {this.state.title}
              // OnChange the value in the field is captured and state variable
              // initialized as blank string in state function is updated
              // New line matters the => cannot be on next line
              onChange = { (event) =>
                  this.setState ({title: event.target.value})
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Campaign description</label>
            <Input

              value = {this.state.description}
              // OnChange the value in the field is captured and state variable
              // initialized as blank string in state function is updated
              // New line matters the => cannot be on next line
              onChange = { (event) =>
                  this.setState ({description: event.target.value})
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label = "wei"
              labelPosition = "right"
              value = {this.state.minimumContribution}
              // OnChange the value in the field is captured and state variable
              // initialized as blank string in state function is updated
              // New line matters the => cannot be on next line
              onChange = { (event) =>
                  this.setState ({minimumContribution: event.target.value})
              }
            />
          </Form.Field>
          <Message
            // Property error needs to be setup on Form so that error shows up
            error
            header = "Oops!"
            content = {this.state.errorMessage}
          />
          <Button
            loading = {this.state.loading}
            content = "Create!"
            icon="add circle"
            primary
          />
        </Form>

      </Layout>

    );
  }
}

export default CampaignNew;
