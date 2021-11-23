// Show list of requests to user

// Next.js components to be executed on the serverside
import React, { Component } from "react";

// Layout = Header component and page container
import Layout from '../../../components/Layout';

// UI components
import { Button, Table } from 'semantic-ui-react';

// Routing helper
import { Link } from '../../../routes';

// Import campaign contract
import Campaign from '../../../etherium/campaign'

// Import RequestRow component
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  // Run on page load
  static async getInitialProps(props) {
    // Return the address field, that is embedded in the URL
    // as defined in the Routes.js file
    const {address} = props.query;
    // Campaign implmentation expects address
    const campaign = Campaign(address);

    const requestCount = await campaign.methods.getRequestsCount().call();
    // Count of approvers
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      // Request count is string, parseInt before passing to fill Array
      // Clever java script to iterate index from 0 -> requestCount -1
      // call the mapping with (index), get the value and fill the array
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          // Retrives a given request at index
          return campaign.methods.requestsmap(index).call();
      })
    );
    // Embed in this object
    // same as return { address: address }, this is ES2015 syntax
    return { address, requests, requestCount, approversCount };
  }

  // Helper method render row
  // Takes data from this page and passes on to the component
  renderRows() {
    // Map through the elements of requests array created on page load
    // Call the RequestRow component with data
    // props to indicate what is it rendering
    // rendering "request" - the element at index
    // key = rendering the element at index
    // and finally the address of Campaign
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    // ES2015 syntax to set Table properties
    // This is to avoid repeating Table.Header, Table.Row and so on
    // Two set of {{}} #1 for JSX and #2 to indicate object
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route = {`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated = "left" style = {{ marginBottom:10}}>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
