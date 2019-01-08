import React, { Component } from 'react';
import { Box, Text, Heading, Image, Button } from 'gestalt';
import { NavLink, withRouter } from 'react-router-dom';
import { getToken, clearToken, clearCart } from '../utils';

class Navbar extends Component {
  handleSignout = () => {
    clearToken();
    clearCart();
    this.props.history.push('/');
  };

  render() {
    return getToken() !== null ? (
      <AuthNav handleSignout={this.handleSignout} />
    ) : (
      <UnAtuhNav />
    );
  }
}

const AuthNav = ({ handleSignout }) => (
  <Box
    display="flex"
    alignItems="center"
    height={100}
    padding={1}
    shape="square"
    color="navy"
    justifyContent="around"
  >
    {/* Checkout link */}
    <NavLink activeClassName="active" to="/checkout">
      <Text size="xl" color="white">
        Checkout
      </Text>
    </NavLink>
    <NavLink activeClassName="active" exact to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} height={40} width={40}>
          <Image
            naturalHeight={1}
            naturalWidth={1}
            alt="Big Brewther"
            src="./icons/brewther-logo.png"
          />
        </Box>

        <Heading size="xs" color="white" className="brand-name">
          Big Brewther
        </Heading>
      </Box>
    </NavLink>
    {/* SIGNOUT BUTTON */}
    <Button
      onClick={handleSignout}
      color="transparent"
      text="Sign Out"
      inline
      size="md"
    />
  </Box>
);

const UnAtuhNav = () => (
  <Box
    display="flex"
    alignItems="center"
    height={100}
    padding={1}
    shape="roundedBottom"
    color="navy"
    justifyContent="around"
  >
    {/* Sign in link */}
    <NavLink activeClassName="active" to="/signin">
      <Text size="xl" color="white">
        Sign In
      </Text>
    </NavLink>
    <NavLink activeClassName="active" exact to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} height={40} width={40}>
          <Image
            naturalHeight={1}
            naturalWidth={1}
            alt="Big Brewther"
            src="./icons/brewther-logo.png"
          />
        </Box>

        <Heading size="xs" color="white" className="brand-name">
          Big Brewther
        </Heading>
      </Box>
    </NavLink>
    <NavLink activeClassName="active" to="/signup">
      <Text size="xl" color="white">
        Sign Up
      </Text>
    </NavLink>
  </Box>
);

export default withRouter(Navbar);
