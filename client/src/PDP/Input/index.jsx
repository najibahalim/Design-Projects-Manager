import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { KeyCodes } from 'shared/constants/keyCodes';
import { is, generateErrors } from 'shared/utils/validation';

import { TitleTextarea, ErrorText } from './Styles';

const propTypes = {
  value: PropTypes.string.isRequired,
  updateValue: PropTypes.func.isRequired,
};

const InputComponent = ({ value, updateValue }) => {
  const $titleInputRef = useRef();
  const [error, setError] = useState(null);

  const handleTitleChange = () => {
    setError(null);

    const title = $titleInputRef.current.value;
    if (title === value) return;

    const errors = generateErrors({ value }, { value: [is.required(), is.maxLength(200)] });

    if (errors.title) {
      setError(errors.title);
    } else {
      updateValue({ title });
    }
  };

  return (
    <Fragment>
      <TitleTextarea
        minRows={1}
        placeholder="Short summary"
        defaultValue={value}
        ref={$titleInputRef}
        onBlur={handleTitleChange}
        onKeyDown={event => {
          if (event.keyCode === KeyCodes.ENTER) {
            event.target.blur();
          }
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Fragment>
  );
};

InputComponent.propTypes = propTypes;

export default InputComponent;
