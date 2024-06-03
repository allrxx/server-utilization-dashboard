// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  disabled: false,
};

export default Button;
