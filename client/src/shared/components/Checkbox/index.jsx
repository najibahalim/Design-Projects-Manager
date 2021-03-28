import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { CheckboxContainer, HiddenCheckbox, StyledCheckbox, Icon } from './Styles';

const propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  itemId: PropTypes.number,
};

const defaultProps = {
  className: undefined,
  checked: false,
  onChange: () => { },
  itemId:-1,
};

const Checkbox = ({ className, checked, onChange, itemId }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} onChange={value => onChange(value, itemId)} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
)

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
