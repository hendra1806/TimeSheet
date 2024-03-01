// components/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './navbar';
import colors from '@/styles/colors';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{backgroundColor:colors.backgroundPage, height:'100vh'}}>
      <Navbar />
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
