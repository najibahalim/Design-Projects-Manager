import styled, { css } from 'styled-components';
import { Select } from 'shared/components';

import { color, font } from 'shared/utils/styles';

export const Priority = styled.div`
  display: flex;
  align-items: center;
  ${props =>
    props.isValue &&
    css`
      padding: 3px 4px 3px 0px;
      border-radius: 4px;
      &:hover,
      &:focus {
        background: ${color.backgroundLight};
      }
    `}
`;

export const Label = styled.div`
  padding: 0 3px 0 8px;
  margin: 10px 20px;
  ${font.size(14.5)}
`;