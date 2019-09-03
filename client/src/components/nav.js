import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import '../style/main.scss';

export default class Example extends React.Component {
  render() {
    return (
      <div >
        <Nav tabs>
          <NavItem>
            <NavLink href="#main" active>&nbsp;&nbsp;</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#"></NavLink>
          </NavItem>
          
        </Nav>
      </div>
    );
  }
}