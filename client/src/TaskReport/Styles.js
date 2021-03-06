import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Icon } from 'shared/components';
import { color, font, mixin } from 'shared/utils/styles';
import { Avatar } from 'shared/components';
// import { List, IssuesCount, Issues } from '../Projects/Lists/List/Styles';
import { Button, Form } from 'shared/components';
import { Textarea, Input } from 'shared/components';
import { SectionTitle } from 'PDP/Styles';
export const FormElement = styled(Form.Element)
`
  padding: 25px 40px 35px;
`;

export const FormHeading = styled.div `
  padding-bottom: 15px;
  ${font.size(21)}
`;

export const SelectItem = styled.div `
  display: flex;
  align-items: center;
  margin-right: 15px;
  ${props => props.withBottomMargin && `margin-bottom: 5px;`}
`;

export const SelectItemLabel = styled.div`
  padding: 0 3px 0 6px;
`;

export const ModalInput = styled(Input)`
  margin-left: 20px;
  margin-bottom: 20px;
  margin-top: 10px;
  width: 90%;
`;
export const ModalSectionTitle = styled(SectionTitle)`
  margin-left: 20px;
`;

export const Divider = styled.div`
  margin-top: 22px;
  border-top: 1px solid ${color.borderLightest};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 30px;
`;

export const AddButton = styled(Button)`
  margin-left: 190px;
  
`;
export const ModalButton = styled(Button)`
  margin-right: 25px;
  margin-bottom: 25px;
  float: right;
  
`;
export const EditButton = styled(Button)`
    align-self: center;
    margin-top: 25px;
    margin-bottom: 25px;
}
`;

export const TitleTextarea = styled(Textarea)`
  margin: 10px 0 20px 18px;
  height: 25px;
  width: 90%;



  textarea {
    padding: 7px 7px 8px;
    line-height: 1.28;
    border-radius: 3px;
    border: 1px solid grey;
    resize: none;
    background: #fff;
    border: 1px solid transparent;
    box-shadow: 0 0 0 1px transparent;
    transition: background 0.1s;
    background: ${color.backgroundLight};
    ${font.size(12.5)}
    ${font.medium}
    &:hover:not(:focus) {
      background: ${color.backgroundLight};
    }
  }
`;



export const Content = styled.div`
  display: flex;
  padding: 0 30px 60px;
`;

export const IssueLink = styled(Link)`
  display: block;
  margin-bottom: 5px;
`;

export const TaskItem = styled.div`
  padding: 10px;
  border-radius: 3px;
  background: ${props => props.selected ? "lightgray": "white"};
  margin: 5px;
  box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
  transition: background 0.1s;
  ${mixin.clickable}
  @media (max-width: 1100px) {
    padding: 10px 8px;
  }
  &:hover {
    background: lightgray;
  }
`;

export const TaskTitle = styled.span`
  padding-bottom: 11px;
  ${font.size(15)}
  @media (max-width: 1100px) {
    ${font.size(14.5)}
  }
`;

export const StyledIcon = styled(Icon)`
 float: right;
`;
export const StyledButton = styled(Button)`
 float: right;
`;

export const CheckIcon = styled(Icon)`
 color: ${props => props.color || 'deepskyblue'};
`;

export const Description = styled.p`
  padding-left: 5px;
  padding-bottom: 7px;
  ${font.size(12)}
  @media (max-width: 1100px) {
    ${font.size(12.5)}
  }
`;

export const CommittedDate = styled.p`
  padding-left: 5px;
  ${font.size(12)}
  @media (max-width: 1100px) {
    ${font.size(12.5)}
  }
`;


export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Assignees = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-left: 2px;
`;

export const AssigneeAvatar = styled(Avatar)`
  margin-left: -2px;
  box-shadow: 0 0 0 2px #fff;
`;