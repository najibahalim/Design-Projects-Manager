import React, { Fragment, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { ProjectPage } from '../Projects/Styles';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import Sidebar from '../Projects/Sidebar';
import useApi from 'shared/hooks/api';
import { PageError, CopyLinkButton, Button, AboutTooltip, IssuePriorityIcon, Checkbox } from 'shared/components';
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
// import {Divider} from '../Projects/Sidebar/Styles';


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
  HistoryItem,
  BlockLabel,
  TaskTitle,
  FormHeading,
  ItemInfo,
  TaskItem,
  TaskLine,
  StyledIcon,
  TitleText,
  Actions,
  TaskHeading,
  AddButton,
  EditButton,
  ModalButton,
  ModalInput,
  TaskInfo,
  EstimationBox
} from './Styles';

const updateFunction = (arg1, arg2) => {
  console.log("Update called");
  console.log(arg1, arg2);
}

const ProjectDetailsPage = (props) => {
  const [selectedItem, selectItem] = useState({});
  const [addingNewTask, addNewTask] = useState(false);
  const [selectedTask, selectNewTask] = useState({});

  //for adding a new Task
  const [selectedGroup, selectGroup] = useState({});
  const [newTaskList, setTaskList] = useState([]);
  const [groupCounter, decementGroupCounter] = useState(9999);
  const [taskCounter, decrementTaskCounter] = useState(9999);

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

  const groupSelectedWhileAdding = (grpId) => {
    const newGroup = taskList.find(task => task.id === grpId);
    const subTaskList = [];
    newGroup.subtasks.forEach(task=>{
      subTaskList.push({
        name: task.name,
        priority: "1",
        estimatedDays: task.estimatedDays,
        checklist: task.checklist,
        taskMasterId: task.id,
        groupID: grpId,
        itemId: selectedItem.id,
        projectId: project.id
      });
    });
    newGroup.subtasks = subTaskList;
    selectGroup(newGroup);
  }

  const handleCheckboxChange = (event, arg2) => {
    console.log("Check box change ", event.target.checked);
    console.log("Check box change ", arg2);
  }

  const updateTaskPriority = (newPriority) => {
    const newTask = selectedTask;
    newTask.priority = newPriority;
    selectNewTask(newTask);

  }
  const updateTaskStatus = (newStatus) => {
    const newTask = selectedTask;
    newTask.status = newStatus;
    selectNewTask(newTask);
  }
  const updateTaskUser = (newUserId) => {
    const newTask = selectedTask;
    newTask.userId = newUserId;
    selectNewTask(newTask);
  }
  const addNewTaskLocally = fields => {
    setLocalData(currentData => {
      if(fields.task && fields.task.item) {
        const itemOfTaskAdded = currentData.items.find((item) => item.id === fields.task.item.id);
        itemOfTaskAdded.tasks.push(fields.task);
      }
      return currentData;
    });
  }
  
  // Add new Task calls

  const handleTaskCreationInput = (value, event, index, type) => {
    switch(type) {
      case 'priority':
      case 'estimatedDays':
      case 'userId':
        selectedGroup.subtasks[index][type] = Number(value);
        break;
      case 'name':
        selectedGroup.subtasks[index][type] = value;
        break;
      default:
        console.log(type);
    }
  }
   const addNewTaskCall = async () => {
     console.log(selectedGroup);
    try {
      addNewTask('working');
      await api.optimisticAdd(`/tasks`, {
        updatedFields: selectedGroup.subtasks,
        currentFields: selectedTask,
        setLocalData: fields => {
          addNewTaskLocally(fields);
        },
      });
      await userApiCall[1]();
      addNewTask(false);
    } catch(err) {
      toast.error(err);
    }
    
  };

  return (
      <ProjectPage>
      <Sidebar />
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
              <br/>
              <ItemInfo>{item.tasks.length} Task/(s)</ItemInfo>
              <ItemInfo align={'right'} color={'yellowgreen'}>5 Done</ItemInfo>
            </TaskItem> 
          })}
          
          

          </List>

        <List>
          {/* Item Details */}
          {selectedItem.id ? <Fragment>
            <TaskHeading>{selectedItem.itemName}</TaskHeading>
            <SectionTitle style={{ marginLeft: '24px' }}>Task Groups:    <Button style={{ float: 'right' }} icon="plus" variant="secondary" onClick={() => { groupSelectedWhileAdding(taskList[0].id); addNewTask(true) }}>Add</Button></SectionTitle>

            {selectedItem.tasks.map((task, index) => {
              const isSelected = selectedTask.id === task.id;
              return <TaskItem selected={isSelected} key={index} onClick={() => selectNewTask(task)} >
                <TaskLine>
                  
                  <TaskTitle>{task.name}  [G-{task.taskMasterId}]</TaskTitle>
                  <EstimationBox>3/3/2020 - <br /> 3 days left</EstimationBox>
                  <Priority task={task} index = {index} width={120} updateTaskPriority={updateTaskPriority} />

                </TaskLine>

                <TaskLine direction = {'row'}>

                  <Assignee task={task} width={120} updateTaskUser={updateTaskUser} projectUsers={users} />
                  <Status task={task} width={140} updateTaskStatus={updateTaskStatus} />
                
                </TaskLine>
               
                {/* <TaskTitle>{task.name} </TaskTitle>
                <StyledIcon type="chevron-right" top={1} />
                <ItemInfo uppercase={true}>{task.status} </ItemInfo>
                <ItemInfo align={'right'} color={'yellowgreen'}> <IssuePriorityIcon top={3} priority={task.priority.toString()} />  3 Days Remaining</ItemInfo> */}
              </TaskItem>
            })}
           
          </Fragment>: <TitleText>Select an ITEM to view Tasks</TitleText>}


        </List>
        <List>
          {/* Task details */}
          {selectedTask.id ? <TaskInfo>
            <TaskHeading>{selectedTask.name}</TaskHeading>

            <SectionTitle>Duration: </SectionTitle>
            <br /> <br />
            <SectionTitle>Estimated Days:</SectionTitle>
            <Input value={selectedTask.estimatedDays.toString()} updateValue={updateFunction}></Input>
            <br /> <br />
            <SectionTitle>Actual Days:</SectionTitle>
            <Input value={selectedTask.actualDays ? selectedTask.actualDays.toString(): '0'} updateValue={updateFunction}></Input>
            <br /> <br />
            <SectionTitle>Variance: <TitleText>{selectedTask.variance}</TitleText></SectionTitle>
            <br /> <br />
            <SectionTitle>Check List:</SectionTitle> <br /> <br />
            {selectedTask.checklist && selectedTask.checklist.map((listItem, index) => {
              return <BlockLabel key={index}>
                <Checkbox
                  checked={index%2 === 0}
                  itemId={23}
                  onChange={handleCheckboxChange}
                />
                <span>{listItem}</span>
              </BlockLabel>

            })}
  
            <Comments task={{ id:1,comments: [{ updatedAt: new Date().toString(), createdAt: new Date().toString(), id: 1, body: 'This is a comment', user: { name: 'Najiba' } }, { updatedAt: new Date().toString(), createdAt: new Date().toString(), id: 2, body: 'This is a comment 2', user: { name: 'Najiba' } }]}} 
            fetchTask={taskApiCallData[1]}></Comments>
            <br /> <br />
            <SectionTitle>Task History:</SectionTitle>
            <HistoryItem>Charlotte: 3/3/2020 - 2/4/2020</HistoryItem>
            <br /> <br />
            <SectionTitle>Group History:</SectionTitle>
            <HistoryItem>Design Task : 3/3/2020 - Current</HistoryItem>
            <br /> <br />
          </TaskInfo> : <></>}
        </List>
        </Lists>
        {/* Add task for Item */}
      <Modal
        isOpen={addingNewTask === true}
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

           
            <SectionTitle>Select Task Group</SectionTitle>
            <br/>
            <TaskSelect taskList={taskList} selectTask={groupSelectedWhileAdding} selectedTask={selectedGroup}/>
            <Icon type="chevron-down" top={1} />
            <br/> <br/>
            <SectionTitle>Subtasks:</SectionTitle>
            <br /> <br/>
            {
              selectedGroup.subtasks.map((subtask, index)=> {
                return <Fragment key={index}> 
                  <ModalInput
                    defaultValue={subtask.name}
                    index={index}
                    accessor={'name'}
                    placeholder="Name"
                    onChange = {handleTaskCreationInput}
                  />
                  <TaskTitle style={{ marginLeft: '20px' }}>Priority:</TaskTitle>
                  <Priority task={subtask} index={index} updateTaskPriority={handleTaskCreationInput} />
                  <TaskTitle style={{ marginLeft: '20px' }}>Assignee:</TaskTitle>
                  <Assignee task={subtask} index={index} updateTaskUser={handleTaskCreationInput} projectUsers={users} />
                  <br/>
                  <TaskTitle style={{ marginLeft: '20px' }}>Estimated Days:</TaskTitle>
                  <ModalInput
                    defaultValue={subtask.estimatedDays}
                    placeholder="Estimated Days"
                    width={'30%'}
                    accessor={'estimatedDays'}
                    type={'number'}
                    index={index}
                    onChange={handleTaskCreationInput}
                  />

                  <Divider/>
                  <br/>
                </Fragment>
              })
            }
            <br/>
            <br/>
      
            <ModalButton variant="primary" isWorking={addingNewTask === "working"} onClick={addNewTaskCall}>
              Done
            </ModalButton>

          </Fragment>

        )}
      />
      </ProjectPage>
  
  );
};

export default ProjectDetailsPage;
