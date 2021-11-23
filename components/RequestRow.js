// Renders rows of a request in a Campaign
import React, { Component } from "react";
// UI Component
import { Table, Button, Message } from "semantic-ui-react";
// Web 3 functions
import web3 from "../etherium/web3";
// get the object
import Campaign from '../etherium/campaign';

// Import Router to refresh the page
import { Router } from '../routes';


class RequestRow extends Component {

  // Initiate state variables
  state = {
    loading: false,
    errorMessage: '',
  };

  // On clicking approve
  onApprove = async () => {
    this.setState ({ loading: true });
    try {
      // Get the Contract
      const campaign = Campaign(this.props.address);
      // Get accounts
      const accounts = await web3.eth.getAccounts();
      // Approve the campaign
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0]
      });
      // Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err)  {
      // Set error message
      this.setState({ errorMessage: err.message});
    }
    this.setState ({ loading: false });

  };
  // On clicking finalize
  onFinalize = async () => {
    this.setState ({ loading: true });
    try {
      // Get the Contract
      const campaign = Campaign(this.props.address);
      // Get accounts
      const accounts = await web3.eth.getAccounts();
      // Finalize
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0]
      });
      // Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      // Set error message
      this.setState({ errorMessage: err.message});
    }
    this.setState ({ loading: false });
  }

  render() {
    // Get rows and cells from table
    const { Row, Cell } = Table;
    // get id and request so we don't have to repeat props
    const { id, request, approversCount } = this.props;
    // Flag to indicate request can be finalized
    const readyToFinalize = request.approvalCount > approversCount/2;

    // Return the cells in the table
    // expression {request.complete ? true : false}
    // disabled and positive are props tied to semantic-ui
    return (
      <Row disabled = {request.complete} positive = {readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? "Completed" : (
            <Button color="green" basic onClick={this.onApprove} loading = {this.state.loading}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? "Completed" : (
            <Button color="red" basic onClick={this.onFinalize} loading = {this.state.loading}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
