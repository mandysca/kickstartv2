// Show users details of a particular campaign
// Next.js components to be executed on the serverside
import React, { Component } from "react";

// Import Layout component
import Layout from '../../components/Layout.js'

// Import contribute form component
import ContributeForm from '../../components/ContributeForm';

// get a handle to the campaign object
import Campaign from '../../etherium/campaign.js'

// Cards layout
import { Card, Grid, Button } from  'semantic-ui-react';

// Import web3 because we need account list
import web3 from '../../etherium/web3';

// Import the Link to navigate
import { Link } from '../../routes';


class CampaignShow extends Component {

  // Executed at the begining of the Server side execution of the call
  // Get the information on the contract
  // props object comes from the routing setup passed with Route
  static async getInitialProps(props) {
    // Get object at actual address of the campaign - passed in the URL
    const campaign = Campaign(props.query.address);

    // get the summary object
    const summary = await campaign.methods.getSummary().call();

    // Add object to the props that gets returned
    return{
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      title: summary[5],
      description: summary[6]
    };
  }

  // Display information
  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
      title,
      description
    } = this.props;

    const items = [
      {
        header: title,
        meta: "Campaign Title",
        description: description,
        style: { overflowWrap: "break-word" },
      },
      
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
      },
    ];

    return <Card.Group items = {items} />;

  }


  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
              <Grid.Column width={10}>
                {this.renderCards()}

              </Grid.Column>
              <Grid.Column width={6}>
                <ContributeForm address = {this.props.address}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Link route = {`/campaigns/${this.props.address}/requests`}>
                  <a>
                    <Button primary>View Requests</Button>
                  </a>
                </Link>
              </Grid.Column>
            </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}

export default CampaignShow;
