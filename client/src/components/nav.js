import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import '../style/main.css';

export default class Example extends React.Component {
  render() {
    return (
      <div >
        <Nav tabs>
          <NavItem>
            <NavLink href="#" active>Review</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" active>Search</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" active>Links</NavLink>
          </NavItem>
        </Nav>
      </div>
    );
  }
}