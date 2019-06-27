import React from 'react';
import {Dropdown, DropdownItem, DropdownToggle, DropdownMenu} from 'reactstrap';
import IosListBox from 'react-ionicons/lib/IosList';

export default class Example extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dropdownOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  render(){
    return(
      <div>
         <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav>
              <IosListBox fontSize={'35px'} />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Review</DropdownItem>
              <DropdownItem>&nbsp;Pronuntiation</DropdownItem>
              <DropdownItem>&nbsp;Sentences</DropdownItem>
              <DropdownItem divider />
              <DropdownItem header>Level</DropdownItem>
               {/* Create rLevel componente */}
            </DropdownMenu>
          </Dropdown>
      </div>
    )
  }
}