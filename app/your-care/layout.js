import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../_components/Footer';


const Layout = ({ children, backgroundColor = 'white' }) => {
    console.log("Background Color: ", backgroundColor);
    return (
      <div style={{ backgroundColor: backgroundColor, minHeight: '100vh', position: 'relative' }}>
        {children}
        {/* <Footer backgroundColor={backgroundColor} />  */}
      </div>
    );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
};

export default Layout;
