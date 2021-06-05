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

  let project = data;
  const taskList = taskApiCallData[0].data;
  const users = userApiCall[0].data;
  const taskHistory = taskHistoryCall[0].data;

  const updateCommentDisplay = async () => {
    const projectC = await api.get(`/projects/${params.projectId}`);
    project = projectC;
    const s_item = projectC.items.find(i => i.id === selectedItem.id);
    const s_group = (s_item.taskGroups.find(grp => grp.id === selectedGroup.id));
    const s_Task = (s_group.tasks.find(grp => grp.id === selectedTask.id));
    selectedItem.taskGroups = s_item.taskGroups;
    selectedGroup.tasks = s_group.tasks;
    selectedTask.comments = s_Task.comments;
    const cTask = selectedTask;
    selectNewTask({});
    selectNewTask(selectedTask);
  }
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

  const groupSelectedWhileAdding = (grpId) => {
    const newGroup = cloneDeep(taskList.find(task => task.id === grpId));
    const subTaskList = [];
    newGroup.subtasks.forEach(task=>{
      if(!task.id) {
        console.log("NOOOO00");
        console.log(task);
      }
      subTaskList.push({
        name: task.name,
        estimatedDays: task.estimatedDays,
        checklist: task.checklist.map((listItem) => {
          return {
            label: listItem,
            isChecked: false
          }
        }),
        taskMasterId: task.id,
        groupID: grpId,
        itemId: selectedItem.id,
        projectId: project.id
      });
    });
    newGroup.subtasks = subTaskList;
    selectTMGroup(newGroup);
    console.log(newGroup);
  }

  const handleCheckboxChange = async (event, arg2) => {
    const updatedSelectedTask = cloneDeep(selectedTask);
    updatedSelectedTask.checklist[arg2].isChecked = event.target.checked;
    updatedSelectedTask.action = "Checked " + updatedSelectedTask.checklist[arg2].label;
    api.optimisticUpdate(`/tasks`, {
      updatedFields: updatedSelectedTask,
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
    const isAllChecked = updatedSubTask.checklist.every(item => item.isChecked);
    if(!isAllChecked ) {
      alert("All the checklist Items must be completed");
      return;
    }
    switch (newStatus) {
      case "In Progress":
        updatedSubTask.action = "Started";
        break;
      case "Done":
        updatedSubTask.action = "Marked as Done";
        break;
      case "On Hold":
        updatedSubTask.action = "Put on Hold";
        break;
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
    updatedSubTask.action = "Assigned to " + (users.find(u => u.id === newUserId) || {}).name;
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
  const addNewTaskLocally = (fields, grp) => {
    setLocalData(currentData => {
      if (fields.tasks && fields.tasks[0] && fields.tasks[0].item) {
        const itemOfTaskAdded = currentData.items.find((item) => item.id === fields.tasks[0].item.id);
        fields.tasks.forEach(t => {
          t.projectId = params.projectId;
            t.itemId = t.item.id;
            t.userId = t.assigneeId;
            t.priority = t.priority.toString()
        })
        itemOfTaskAdded.taskGroups.push({
          id: grp.id,
          name: grp.name,
          tasks: fields.tasks
        });
      }
      return currentData;
    });
  }
  
  // Add new Task calls

  const handleTaskCreationInput = (value, event, index, type) => {
    console.log(type, index);
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
    console.log(selectedTMGroup);
  }
  const validateTasks = (taskArray) => {
    let messages = [];
    if(taskArray && taskArray.length > 0){
      taskArray.forEach((item, index) => {
        if(!item.name || !item.name.trim()) {
          messages.push("Name cannot be empty for TASK " + index + 1);
        }
        if(!item.priority) {
          messages.push("Priority not defined for TASK " + index + 1);
        }
        if (!item.estimatedDays) {
          messages.push("Estimated Days must be greater than 1 for TASK " + index + 1);
        }
        if(!item.taskMasterId) {
          messages.push("No Task Master reference found for" + index + 1);
        }
      });
    }
    return messages;
    
  }
   const addNewTaskCall = async () => {
     console.log(selectedTMGroup);
     const validationMessages = validateTasks(selectedTMGroup.subtasks);
     if(validationMessages.length > 0) {
       alert(validationMessages.join("\n"));
       return;
     }
    try {
      addNewTask('working');
      await api.optimisticAdd(`/tasks`, {
        updatedFields: selectedTMGroup.subtasks,
        currentFields: {},
        setLocalData: fields => {
          addNewTaskLocally(fields, selectedTMGroup);
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
                    let daysLeft = task.estimatedDays - task.actualDays - Math.round((new Date().getTime() - new Date(task.startedOn).getTime()) / (1000 * 60 * 60 * 24));
                    if(daysLeft < 0) {
                      daysLeft = 0;
                    }
                    return <TaskItem selected={isSelected} key={index} onClick={() => selectNewTask(task)} >
                      <TaskLine>

                        <Priority task={task} index={index} width={200} updateTaskPriority={updateTaskPriority} />
                        <TaskTitle>{task.name}</TaskTitle>
                        <EstimationBox>{daysLeft} day/(s) left</EstimationBox>
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
            <TaskHeading>{selectedTask.name}<TitleText>{selectedTask.status}</TitleText></TaskHeading>

            <SectionTitle>Started On: {new Date(selectedTask.startedOn).toLocaleDateString("en-GB", { month: 'long', year: "numeric", day: "numeric", hour12: true, hour: "2-digit", minute: "2-digit" })} </SectionTitle>
            <br /> <br />
            <SectionTitle>Estimated Days:</SectionTitle>
            <Input key={selectedTask.id + 'estimatedDays'} identifier={"estimatedDays"} value={selectedTask.estimatedDays} updateValue={updateFunction}/>
            <br /> <br />
            <SectionTitle>Actual Days:</SectionTitle>
            <Input key={selectedTask.id + 'actualDays'} identifier={"actualDays"}  value={selectedTask.actualDays || 0} updateValue={updateFunction}></Input>
            <br /> <br />
            <SectionTitle>Variance: <TitleText>{selectedTask.variance}</TitleText></SectionTitle>
            <br /> <br />
            <SectionTitle>Check List:  &nbsp;&nbsp;<Button icon="task" disabled={selectedTask.status === "Done" || !selectedTask.checklist.every(task => task.isChecked)} iconSize={24} variant="success" onClick={() => updateTaskStatus("Done")} >Mark as Done </Button> </SectionTitle> <br /> <br />
            {selectedTask.checklist && selectedTask.checklist.map((listItem, index) => {
              return <BlockLabel key={index}>
                <Checkbox
                  checked={listItem.isChecked}
                  itemId={index}
                  onChange={handleCheckboxChange}
                />
                <span>{listItem.label}</span>
              </BlockLabel>

            })}
  
            <Comments task={selectedTask}
              fetchTask={updateCommentDisplay}></Comments>
            
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
                  <Priority task={{}} index={index} updateTaskPriority={handleTaskCreationInput} />
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
