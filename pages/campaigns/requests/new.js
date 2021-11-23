// Create a new request
// React and component
import React, { Component } from "react";
// UI Components
import { Form, Button, Message, Input } from "semantic-ui-react";
// Campaign object initiated from the address
import Campaign from "../../../etherium/campaign";
// web3 for utils
import web3 from "../../../etherium/web3";
// Navigation components
import { Link, Router } from "../../../routes";
// Page layout
import Layout from "../../../components/Layout";

class RequestNew extends Component {
  // Initiate state variables
  state = {
    value: "",
    description: "",
    recipient: "",
    loading: false,
    errorMessage: "",
  };
  // Get the address in the URL
  static async getInitialProps(props) {
    // Gets the :address property from Routes
    const { address } = props.query;
    // Embed in this
    return { address };
  }
  // On submit of the form
  onSubmit = async (event) => {
    event.preventDefault();
    // Get the campaign object from address
    const campaign = Campaign(this.props.address);
    // Get form input fields from this object
    const { description, value, recipient } = this.state;

    this.setState({ loading: true, errorMessage: "" });
    try {
      // Get the accounts (from Metamask)
      const accounts = await web3.eth.getAccounts();
      // Create a request (don't forget to convert value to "wei")
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };
  /*
  For fields to enter request Description, value in ether, and address
  */
  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={(event) =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
