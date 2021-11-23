import React from "react";

// Header component
import { Menu } from "semantic-ui-react";

// Link tag to help users navigate
import { Link } from '../routes';

// Double curly braces indicate we're passing something javascript related
const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route = "/">
        <a className = "item">
          CrowdCoin
        </a>
      </Link>

      <Menu.Menu position="right">
        <Link route = "/">
          <a className = "item">
            Campaigns
          </a>
        </Link>
        <Link route = "/campaigns/new">
          <a className = "item">
            +
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
