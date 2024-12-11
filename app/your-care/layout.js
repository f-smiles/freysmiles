export default function YourCareLayout({ children }) {
  // console.log("Background Color: ", backgroundColor);
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', position: 'relative' }}>
      {children}
    </div>
  );
};

// import React from 'react';
// import PropTypes from 'prop-types';

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
//   backgroundColor: PropTypes.string,
// };

// export default Layout;
