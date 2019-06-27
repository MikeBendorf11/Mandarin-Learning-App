import React from 'react';
import { Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink } from 'reactstrap';
import IosListBox from 'react-ionicons/lib/IosList';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <div>
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
          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav caret>
              <IosListBox />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Options</DropdownItem>
              <DropdownItem>Pronuntiation</DropdownItem>
              {/* <DropdownItem divider /> */}
              <DropdownItem>Sentences</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </div>
    );
  }
}