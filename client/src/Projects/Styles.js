import styled from 'styled-components';

import { sizes, mixin } from 'shared/utils/styles';

const paddingLeft = sizes.secondarySideBarWidth + 40;

export const ProjectPage = styled.div`
  padding: 25px 32px 50px ${paddingLeft}px;
  @media (max-width: 1100px) {
    padding: 25px 20px 50px ${paddingLeft - 20}px;
  }
  @media (max-width: 999px) {
    padding-left: ${paddingLeft - 20 - sizes.secondarySideBarWidth}px;
  }
    ${mixin.scrollableY}
  ${mixin.customScrollbar()}
`;

export const Issues = styled.div`
  height: 100%;
  padding: 0 5px;
`;

