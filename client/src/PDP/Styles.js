import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Icon } from 'shared/components';
import { color, font, mixin } from 'shared/utils/styles';
import { Avatar } from 'shared/components';
import { Button, Form } from 'shared/components';
import { Textarea, Input } from 'shared/components';
import TaskSelect from './TaskSelect/index';
export const FormElement = styled(Form.Element)
`
  padding: 25px 40px 35px;
`;

export const FormHeading = styled.div `
  padding: 15px;
  ${font.size(24)}
`;

export const TaskHeading = styled.div `
  padding: 15px;
  ${font.size(15)}
  font-weight: bold;
  opacity: 0.75;
  border-bottom: 1px dotted black;
  margin-bottom: 20px;
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
  width: ${props => props.width || '90%' }
`;
export const TitleText = styled.span`
  padding: 13px 10px 17px;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(12.5)};
  ${font.regular}
  ${mixin.truncateText}
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
  margin: 18px 0 0 18px;
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
  padding: 5px;
  margin: 10px 10px;
  border-radius: 5px;
  background: ${props => props.selected ? "lightgray" : "white"};
  box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
  box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
  transition: background 0.1s;
  ${props => !props.group && mixin.clickable};
  @media (max-width: 1100px) {
    padding: 10px 8px;
  }
  &:hover {
    background:  ${props => !props.group ? "lightgray" : "white"};
  }
`;

export const TaskLine = styled.div`
 display: flex;
 align-items: baseline;
 flex-direction: ${props => props.direction || 'row'};
 margin-bottom: 3px;
 justify-content: flex-start;

`;


export const AccordianBody = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px;
  min-height: 1px;
  width: 100%;
  border-radius: 3px;
  ${mixin.scrollableY}
  ${mixin.customScrollbar()}

`;

export const EstimationBox = styled.div`
 display: inline-block;
 max-width: 70%;
 padding: 5px;
 margin: 5px;
  ${font.size(12.5)}
  ${font.medium}

`;

export const TaskTitle = styled.div`
  padding: 11px 0px;
  display: inline-block;
  ${font.size(14)}
  @media (max-width: 1100px) {
    ${font.size(13.5)}
  }
`;

export const HistoryItem = styled(TaskTitle)`
  margin: 10px;
  padding: 0px !important;
  margin-left: 20px;
  display: block;
  
`;

export const ItemInfo = styled.div`
  padding: 3px;
  padding-top: 10px;
  width: 45%;
  display: inline-block;
  text-align: ${props => props.align || 'left'};
  color: ${props => props.color || 'royalblue'};
  text-transform: ${props => props.uppercase ? 'uppercase' :'none'};
  ${font.size(15)}
  ${font.regular}
  @media (max-width: 1100px) {
    ${font.size(14.5)}
  }
`;

export const TaskInfo = styled.div`
  padding: 3px;
  width: 100%;
  display: inline-block;
`;


export const StyledIcon = styled(Icon)`
 float: right;
`;

export const CheckIcon = styled(Icon)`
 color: ${props => props.color || 'deepskyblue'};
 padding: 5px;
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

export const Left = styled.div`
  width: 65%;
  padding-right: 50px;
`;

export const Right = styled.div`
  width: 35%;
  padding-top: 5px;
`;

export const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 21px 18px 0;
`;

export const TopActionsRight = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-left: 4px;
  }
`;

export const SectionTitle = styled.span`
  margin-right: 24px;
  margin-left: 10px;
  margin-top: 24px;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(12.5)}
  ${font.bold}
`;


export const ScrollableDiv = styled.div`
  ${mixin.scrollableY}
  ${mixin.customScrollbar()}
`
export const BlockLabel = styled.label`
  display: block;
`