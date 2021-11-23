// Next.js components to be executed on the serverside
import React, {Component} from 'react';

// Import Card  & Button for the better styling of the modules
import { Card, Button } from 'semantic-ui-react';

// with refactored web3 to run on browser or server-side
import factory from '../etherium/factory';

// Impor layout
import Layout from '../components/Layout.js'

// Import Link helper. Capital "L"
import { Link } from '../routes';

// Run by Next.js on the server side
class CampaignIndex extends Component {

  // Executed at the begining of the Server side execution of the call
  // Get the Contract object and embed in the dom model
  static async getInitialProps() {
    // get the campaigns object
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    // embedd campaigns in the dom model
    return { campaigns };
  }

  // Show a list of campaigns
  renderCampaigns () {
    // maps is called for each item in the object
    // iterate through the campaings array
    // for each item address return the json type mapping
    const items = this.props.campaigns.map((address )  => {

      return {
        header: address,
        description:

        (
          // Dynamically generated route with ES6 syntax
          <Link route = {`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    // Return the card group
    return <Card.Group items={items} />;
  }

  // Render function displays the content
  render() {
    return (
      <Layout>
      <div>
          <h3>Open Campaigns</h3>
          <Link route="/campaigns/new">
            <a>
              <Button
                floated ="right"
                content = "Create Campaign"
                icon="add circle"
                primary
              />
            </a>
          </Link>
          {this.renderCampaigns()}
      </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
