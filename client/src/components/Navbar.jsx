import React from 'react';
import { Box, Text, Heading, Image } from 'gestalt';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
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

        <Heading size="xs" color="watermelon" className="brand-name">
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

export default Navbar;
