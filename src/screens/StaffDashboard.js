import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import MyAccountPage from './MyAccountPage';
import OrderManagement from './OrderManagement';
import ProductsCatalog from './ProductsCatalog';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const StaffDashboard = () => {

  const [selectedTab, setSelectedTab] = useState("Products Catalog");
  const { user,role } = useAuth();

  if (!user || role !== 'staff') {
   
    return <Navigate to="/signin" />;
  }
  
  const tabs = [
    {
      label: 'Products Catalog',
      content: <ProductsCatalog />,
    },
    {
      label: 'My Account',
      content: <MyAccountPage />,
    },
    {
      label: 'Orders Management',
      content: <OrderManagement />,
    },
  ];

  const handleTabChange = (label) => {
    setSelectedTab(label);
  };

  return (
    <DashboardLayout dashboardTitle="Staff Dashboard">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          fontFamily: 'Merriweather',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: '15%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #3498db',
            height: '100%',
            position: 'fixed',
            backgroundColor: '#3498db',
            marginLeft: '0px',
            boxShadow: '0px 0px 0px 1px lightgrey',
            paddingTop: '90px',
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.label}
              style={{
                padding: '10px',
                cursor: 'pointer',
                border: selectedTab === tab.label ? '1px solid white' : 'none',
                color: 'white',
              }}
              onClick={() => handleTabChange(tab.label)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div style={{ marginLeft: '15%', width: '85%' ,  paddingTop: '90px',}}>
          {/* Render the content of the selected tab */}
          {tabs.find((tab) => tab.label === selectedTab)?.content}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
