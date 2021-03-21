import React, { Fragment, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { ProjectPage } from '../Projects/Styles';
import api from 'shared/utils/api';
import useApi from 'shared/hooks/api';
import { PageError, CopyLinkButton, Button, AboutTooltip } from 'shared/components';
import { List, Title,IssuesCount, Issues } from '../Projects/Lists/List/Styles';
import { Lists } from '../Projects/Lists/Styles';
import Loader from './Loader';
import Type from './Type';
import Delete from './Delete';
import Description from './Description';
import Input from './Input';
import Comments from './Comments';
import TaskSelect from './TaskSelect';
import Status from './Status';



import Assignee from './Assignee';
import Priority from './Priority';
import EstimateTracking from './EstimateTracking';
import Dates from './Dates';
import { TopActions, TopActionsRight, Content, Left, Right, SectionTitle } from './Styles';
import { CheckIcon, TitleTextarea } from './Styles';
import { Icon, Modal } from 'shared/components';

import {
  FormElement,
  SelectItem,
  SelectItemLabel,
  Divider,
  TaskTitle,
  FormHeading,
  ItemInfo,
  TaskItem,
  StyledIcon,
  TitleText,
  Actions,
  AddButton,
  EditButton,
  ModalButton,
  ModalInput
} from './Styles';

const updateFunction = (arg1, arg2) => {
  console.log("Update called");
  console.log(arg1, arg2);
}

const ProjectDetailsPage = (props) => {
  const [selectedItem, selectItem] = useState({});
  const [addingNewTask, addNewTask] = useState(false);
  const [selectedTask, selectNewTask] = useState({});
  const $nameInputRef = useRef();
  const $checklistInputRef = useRef();
  const $estimatedDaysRef = useRef();
  const { match: { params } } = props;

  const [{ data, error, setLocalData }, fetchProject] = useApi.get(`/projects/${params.projectId}`);
  const taskApiCallData = useApi.get(`/tasksMaster`);
  const userApiCall = useApi.get(`/users`);


  if (!data || !taskApiCallData[0].data) return <Loader />;
  if (error) return <PageError />;

  const project = data;
  const taskList = taskApiCallData[0].data;
  const users = userApiCall[0].data;

  const updateLocalIssueDetails = fields =>
    setLocalData(currentData => ({ project: { ...currentData.projects, ...fields } }));

  const updateIssue = updatedFields => {
    api.optimisticUpdate(`/projects/${params.projectId}`, {
      updatedFields,
      currentFields: project,
      setLocalData: fields => {
        updateLocalIssueDetails(fields);
        updateLocalProjectIssues(project.id, fields);
      },
    });
  };

  const taskSelectedWhileAdding = (taskId) => {
    const newTask = taskList.find(task => task.id === taskId);
    console.log("New Task Selected" , newTask);
    selectNewTask(newTask);

  }

  const updateTaskPriority = (newPriority) => {
    console.log("New Priority", newPriority);
    selectedTask.priority = newPriority;
  }
  const updateTaskStatus = (newStatus) => {
    selectedTask.status = newStatus;
    console.log("New Status", newStatus);
  }
  const updateTaskUser = (newUserId) => {
    selectedTask.userId = newUserId;
    console.log("New USer id", newUserId);
  }

  return (
      <ProjectPage>
      <FormHeading>PROJECT: {project.name}</FormHeading>

        <Lists>
          {/* Project details */}
          <List>
          <SectionTitle>Status: <TitleText>{project.status}</TitleText></SectionTitle> 
          <SectionTitle>Description: </SectionTitle>
          <Input value= {project.description} updateValue = {updateFunction}></Input>
         
          <SectionTitle>Committed Date: <TitleText> {project.committedDate ? new Date(project.committedDate).toLocaleDateString("en-GB", { month: 'long', year: "numeric", day: "numeric" }) : "None"} </TitleText></SectionTitle>

          <SectionTitle>Items: </SectionTitle>
          {project.items.map((item, index) => {
            const isSelected = selectedItem.id === item.id;
            return <TaskItem selected={isSelected} key={index} onClick={() => selectItem(item)} >
              <TaskTitle>{item.itemName} </TaskTitle>
              <StyledIcon type="chevron-right" top={1} />
              <ItemInfo>{item.tasks.length} Task/(s)</ItemInfo>
              <ItemInfo align={'right'} color={'yellowgreen'}>5 Done</ItemInfo>
            </TaskItem> 
          })}
          
          

          </List>

        <List>
          {/* Item Details */}
          {selectedItem.id ? <Fragment>
            <SectionTitle>{selectedItem.itemName}</SectionTitle>
          
            <SectionTitle>Tasks:    <Button style={{ marginLeft: '20%' }} icon="plus" variant="primary" onClick={() => { selectNewTask(taskList[0]); addNewTask(true) }}>Add New Task </Button></SectionTitle>

            {selectedItem.tasks.map((task, index) => {
              const isSelected = selectedTask.id === task.id;
              return <TaskItem selected={isSelected} key={index} onClick={() => selectTask(task)} >
                <TaskTitle>{task.name} </TaskTitle>
                <StyledIcon type="chevron-right" top={1} />
                <ItemInfo>STATUS: {task.status}</ItemInfo>
                <ItemInfo align={'right'} color={'yellowgreen'}>Estimated Days: {task.estimatedDays}</ItemInfo>
              </TaskItem>
            })}
           
          </Fragment>: <TitleText>Select an ITEM to view Tasks</TitleText>}


        </List>
        <List>
          {/* Task details */}
            {JSON.stringify(users)}
        </List>
        </Lists>
        {/* Add task for Item */}
      <Modal
        isOpen={addingNewTask}
        testid="modal:new-task"
        width={520}
        withCloseIcon={false}
        renderContent={modal => (
          <Fragment>
            <TopActions>
              <TaskTitle><CheckIcon type={"story"} /> NEW TASK</TaskTitle>
              <TopActionsRight>
        
               
                <Button icon="close" iconSize={24} variant="empty" onClick={() => addNewTask(false)} />
              </TopActionsRight>
            </TopActions>

           
            <SectionTitle>Select Task from Task Master</SectionTitle>
            <br/>
            <TaskSelect taskList={taskList} selectTask={taskSelectedWhileAdding} selectedTask={selectedTask}/>
            <Icon type="chevron-down" top={1} />
            <br/>
            <Assignee task={selectedTask} updateTaskUser={updateTaskUser} projectUsers={users}/>
            <br />
            <Priority task={selectedTask} updateTaskPriority={updateTaskPriority} />
            <br />
            <Status task={selectedTask} updateTaskStatus={updateTaskStatus}/>
            <br/>
            <SectionTitle>Original Estimate (Days)</SectionTitle>
            <ModalInput
              ref={$estimatedDaysRef}
              defaultValue={selectedTask.estimatedDays}
              placeholder="Days"

            />
            <br/>
      
            <ModalButton variant="primary">
              Done
            </ModalButton>

          </Fragment>

        )}
      />
      </ProjectPage>
  
  );
};

export default ProjectDetailsPage;
