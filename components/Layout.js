import React from "react";

// Container for the content, need the CSS
import { Container } from 'semantic-ui-react';

// Component to be used inside any other React Component
// Any thing in Head is autmatically placed in the <Head> of HTML file
// Here we're using it to place the CSS to style semantic-ui-react  
import Head from 'next/head';

// Import the header
import Header from "./Header";

const Layout = (props) => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
      </Head>

      <Header />

      {props.children}

    </Container>
  );
};
export default Layout;
