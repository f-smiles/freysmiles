import React from 'react';
import Link from 'next/link';

const YourCareNavBar = () => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tr>
        <td style={{ borderBottom: '1px solid #C0C0C0', textAlign: 'center', padding: '5px 0' }}>
          <a href="#first-steps" onClick={() => console.log("clicked")}>FIRST STEPS</a>
        </td>
        <td style={{ borderBottom: '1px solid #C0C0C0', textAlign: 'center', padding: '5px 0' }}>
           <Link href="#started">GETTING STARTED</Link> 
            </td>
        <td style={{ borderBottom: '1px solid #C0C0C0', textAlign: 'center', padding: '5px 0' }}>PRICING</td>
        <td style={{ borderBottom: '1px solid #C0C0C0', textAlign: 'center', padding: '5px 0' }}>BOOKING NOW</td>
      </tr>
    </table>
  );
};

export default YourCareNavBar;
