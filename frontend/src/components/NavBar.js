import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';

// takes props:
// user
class NavBar extends Component {
    render() {
        return (
            <Navbar color="light" light expand="md">
            <NavbarBrand href="/">NVOLV</NavbarBrand>
            </Navbar>
        );
    }
}

export default NavBar;
