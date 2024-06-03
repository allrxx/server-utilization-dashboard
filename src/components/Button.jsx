// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'; // Import the CSS file

const Button = ({ onClick, disabled, children }) => {
  return (
    <button onClick={onClick} disabled={disabled} className="btn">
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  disabled: false,
};

export default Button;