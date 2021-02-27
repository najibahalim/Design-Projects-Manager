import React from 'react';
import PropTypes from 'prop-types';

import { Image, Letter } from './Styles';

const propTypes = {
  className: PropTypes.string,
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
};

const defaultProps = {
  className: undefined,
  avatarUrl: null,
  name: '',
  size: 32,
};

const Avatar = ({ className, avatarUrl, name, size, ...otherProps }) => {
  const displayChars = name.split(' ');
  const displayChar =
    displayChars.length === 1
      ? displayChars[0].charAt(0)
      : displayChars[0].charAt(0) + displayChars[1].charAt(0);
  const sharedProps = {
    className,
    size,
    'data-testid': name ? `avatar:${name}` : 'avatar',
    ...otherProps,
  };

  if (avatarUrl) {
    return <Image avatarUrl={avatarUrl} {...sharedProps} />;
  }

  return (
    <Letter color={getColorFromName(name)} {...sharedProps}>
      <span>{displayChar}</span>
    </Letter>
  );
};

const colors = [
  '#DA7657',
  '#6ADA57',
  '#5784DA',
  '#AA57DA',
  '#DA5757',
  '#DA5792',
  '#57DACA',
  '#57A5DA',
];

const getColorFromName = name => colors[name.toLocaleLowerCase().charCodeAt(1) % colors.length];

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;

export default Avatar;
