// Libs
import React from 'react';

// Utils

// Components
import {
  Dropdown,
  NavBarLayout,
  NutanixLogoIcon
} from '@nutanix-ui/prism-reactjs';

function Header() {

  const accountInfo = (
    <Dropdown style={{ color: 'white' }}>
      Admin
    </Dropdown>
  );

  const menuItems = [
    {
      key: 'tests',
      label: <a href="/">TESTS</a>
    },
    {
      key: 'datasets',
      label: <a href="/datasets">DATASETS</a>
    },
    {
      key: 'community',
      label: <a href="/docs">COMMUNITY</a>
    }
  ];

  return (
    <NavBarLayout
      layout={ NavBarLayout.NavBarLayoutTypes.LEFT }
      htmlTag="header"
      accountInfo={ accountInfo }
      logoIcon={ <NutanixLogoIcon style={{ color: 'white' }} /> }
      title="LLM Insecurity"
      menuItems={ menuItems }
    />
  );
}

export default Header;
