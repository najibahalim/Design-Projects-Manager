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
import {cloneDeep} from "lodash";
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
  AccordianBody,
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


const ProjectDetailsPage = (props) => {
  const [selectedItem, selectItem] = useState({});
  const [addingNewTask, addNewTask] = useState(false);
  const [selectedTask, selectNewTask] = useState({});

  //for adding a new Task
  const [selectedGroup, selectGroup] = useState({});
  const [selectedTMGroup, selectTMGroup] = useState({});
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
  const taskHistoryCall = useApi.get(`/taskHistory/${params.projectId}`);


  if (!data || !taskApiCallData[0].data) return <Loader />;
  if (error) return <PageError />;

  const project = data;
  const taskList = taskApiCallData[0].data;
  const users = userApiCall[0].data;
  const taskHistory = taskHistoryCall[0].data;

  const updateLocalIssueDetails = fields =>
    setLocalData(currentData => ({ project: { ...currentData.projects, ...fields } }));

  const updateFunction = async (arg1, arg2) => {
    console.log(arg1, arg2);
    const updatedSubTask = cloneDeep(selectedTask);
    updatedSubTask[arg2] = Number(arg1);
    updatedSubTask.action = `Changed ${arg2.toUpperCase()} to ${arg1}`;
    api.optimisticUpdate(`/tasks`, {
      updatedFields: updatedSubTask,
      currentFields: selectedTask,
      setLocalData: fields => {
        setLocalData(currentData => {
          const item = currentData.items.find((item) => item.id === fields.itemId);
          const grp = item.taskGroups.find((group) => group.id === fields.groupID);
          const task = grp.tasks.find((task) => task.id === fields.id);
          Object.assign(task, fields);
          return currentData;
        });
      },
    });
    await taskHistoryCall[1]();
  }
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
    selectTMGroup(newGroup);
  }

  const handleCheckboxChange = (event, arg2) => {
    console.log("Check box change ", event.target.checked);
    console.log("Check box change ", arg2);
  }

  const updateTaskPriority = async (newPriority) => {
    const updatedSubTask = cloneDeep(selectedTask);
    updatedSubTask.priority = newPriority;
    updatedSubTask.action = "";
    switch (newPriority) {
      case "1":
        updatedSubTask.action = "Ranked Lowest";
      case "2":
        updatedSubTask.action = "Ranked Low";
      case "3":
        updatedSubTask.action = "Ranked Medium";
      case "4":
        updatedSubTask.action = "Ranked High";
      case "5":
        updatedSubTask.action = "Ranked Highest";
    };
    api.optimisticUpdate(`/tasks`, {
      updatedFields: updatedSubTask,
      currentFields: selectedTask,
      setLocalData: fields => {
        setLocalData(currentData => {
          const item = currentData.items.find((item) => item.id === fields.itemId);
          const grp = item.taskGroups.find((group) => group.id === fields.groupID);
          const task = grp.tasks.find((task) => task.id === fields.id);
          Object.assign(task, fields);
          return currentData;
        });
      },
    });
    await taskHistoryCall[1]();


  }
  const updateTaskStatus = async (newStatus) => {
    const updatedSubTask = cloneDeep(selectedTask);
    updatedSubTask.status = newStatus;
    console.log(newStatus);
    switch (newStatus) {
      case "1":
        updatedSubTask.action = "Started";
      case "2":
        updatedSubTask.action = "Marked as Done";
      case "3":
        updatedSubTask.action = "Put on Hold";
    };
    api.optimisticUpdate(`/tasks`, {
      updatedFields: updatedSubTask,
      currentFields: selectedTask,
      setLocalData: fields => {
        setLocalData(currentData => {
          const item = currentData.items.find((item) => item.id === fields.itemId);
          const grp = item.taskGroups.find((group) => group.id === fields.groupID);
          const task = grp.tasks.find((task) => task.id === fields.id);
          Object.assign(task, fields);
          return currentData;
        });
      },
    });
    await taskHistoryCall[1]();

  }
  const updateTaskUser = async (newUserId) => {
    const updatedSubTask = cloneDeep(selectedTask);
    updatedSubTask.userId = newUserId;
    updatedSubTask.action = "Assigned";
    await api.optimisticUpdate(`/tasks`, {
      updatedFields: updatedSubTask,
      currentFields: selectedTask,
      setLocalData: fields => {
        setLocalData(currentData => {
          const item = currentData.items.find((item) => item.id === fields.itemId);
          const grp = item.taskGroups.find((group) => group.id === fields.groupID);
          const task = grp.tasks.find((task)=>task.id === fields.id);
          Object.assign(task, fields);
          return currentData;
        });
      },
    });
    await userApiCall[1]();
    await taskHistoryCall[1]();

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
        selectedTMGroup.subtasks[index][type] = Number(value);
        break;
      case 'name':
        selectedTMGroup.subtasks[index][type] = value;
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
        updatedFields: selectedTMGroup.subtasks,
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
              <ItemInfo>{item.taskGroups.length} Task Groups/(s)</ItemInfo>
              <ItemInfo align={'right'} color={'yellowgreen'}>5 Done</ItemInfo>
            </TaskItem> 
          })}
          
          

          </List>

        <List>
          {/* Item Details */}
          {selectedItem.id ? <Fragment>
            <TaskHeading>{selectedItem.itemName}</TaskHeading>
            <SectionTitle style={{ marginLeft: '24px' }}>Task Groups:    <Button style={{ float: 'right' }} icon="plus" variant="secondary" onClick={() => { groupSelectedWhileAdding(taskList[0].id); addNewTask(true) }}>Add</Button></SectionTitle>
            {selectedItem.taskGroups.map((group, index) => {
              const isGrpSelected = selectedGroup.id === group.id;
              const iconDir = isGrpSelected ? "down" : "up";
              return <TaskItem group={true} key={index} onClick={() => selectGroup(group)}>
                <TaskTitle>{group.name}</TaskTitle>
                <StyledIcon type={`chevron-${iconDir}`} top={1} size={30}/>
                <AccordianBody>
                  {isGrpSelected && group.tasks.map((task, index) => {
                    const isSelected = selectedTask.id === task.id;
                    return <TaskItem selected={isSelected} key={index} onClick={() => selectNewTask(task)} >
                      <TaskLine>

                        <Priority task={task} index={index} width={200} updateTaskPriority={updateTaskPriority} />
                        <TaskTitle>{task.name}</TaskTitle>
                        <EstimationBox>3/3/2020 - 3 days left</EstimationBox>
                      </TaskLine>

                      <TaskLine direction={'row'}>

                        <Assignee task={task} updateTaskUser={updateTaskUser} projectUsers={users} />

                        <Status task={task} width={150} updateTaskStatus={updateTaskStatus} />

                      </TaskLine>
                    </TaskItem>
                  })}
                </AccordianBody>
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
            <Input key={selectedTask.id + 'estimatedDays'} identifier={"estimatedDays"} value={selectedTask.estimatedDays} updateValue={updateFunction}/>
            <br /> <br />
            <SectionTitle>Actual Days:</SectionTitle>
            <Input key={selectedTask.id + 'actualDays'} identifier={"actualDays"}  value={selectedTask.actualDays || 0} updateValue={updateFunction}></Input>
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
            {taskHistory.map((item)=> {
              if(item.taskId === selectedTask.id) {
                return <HistoryItem>{users.find(user=> user.id === item.userId).name} : {item.action} </HistoryItem>
              }
            })}
            
            <br /> <br />
            <SectionTitle>Group History:</SectionTitle>
            {taskHistory.map((item) => {
              if (item.groupId === selectedGroup.id) {
                return <HistoryItem> {(selectedGroup.tasks.find((st)=> st.id === item.taskId) || {}).name} -&gt; {users.find(user => user.id === item.userId).name} : {item.action} </HistoryItem>
              }
            })}
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
            <TaskSelect taskList={taskList} selectTask={groupSelectedWhileAdding} selectedTask={selectedTMGroup}/>
            <Icon type="chevron-down" top={1} />
            <br/> <br/>
            <SectionTitle>Subtasks:</SectionTitle>
            <br /> <br/>
            {
              selectedTMGroup.subtasks.map((subtask, index)=> {
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
