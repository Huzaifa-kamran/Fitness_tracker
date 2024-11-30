import React from "react";

const Footer = () => {
  return (
    <footer className="bg-card text-textSecondary text-center py-4">
      <p>© {new Date().getFullYear()} Fitness Tracker. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
