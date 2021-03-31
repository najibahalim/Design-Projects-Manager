import React, { Fragment, useState, useRef } from 'react';
import SplitPane from "react-split-pane";
import api from 'shared/utils/api';
import useApi from 'shared/hooks/api';
import { PageError, CopyLinkButton, Button, AboutTooltip } from 'shared/components';
import { List, Title, IssuesCount, Issues } from '../Projects/Lists/List/Styles';
import { Lists } from '../Projects/Lists/Styles';
import { TaskItem, TaskTitle, StyledIcon, CheckIcon, TitleTextarea, Content } from './Styles';
import { ProjectPage } from '../Projects/Styles';
import Loader from '../PDP/Loader';
import { Icon, Modal, Input } from 'shared/components';
import Sidebar from '../Projects/Sidebar';


import {
  FormHeading,
  FormElement,
  SelectItem,
  SelectItemLabel,
  Divider,
  Actions,
  AddButton,
  EditButton,
  ModalButton,
  ModalInput,
  ModalSectionTitle
} from './Styles';


const TaskMasterPage = (props) => {
  const [selectedGroup, selectGroup] = useState({});
  const [selectedSubTask, selectSubTask] = useState({});
  const [action, doAction] = useState({isAdd: false, isEdit: false, isGroupAdd: false});
  const $nameInputRef = useRef();
  const $checklistInputRef = useRef();
  const $estimatedDaysRef = useRef();
  const { match: { params } } = props;

  const [{ data, error, setLocalData }, fetchGroupsWithTasks] = useApi.get(`/tasksMaster`);


  if (!data) return <Loader />;
  if (error) return <PageError />;

  const taskList = data;


  const addNewTask = fields => {
    setLocalData(currentData => {
      if (fields.group && fields.group.id) {
        const currentGrp = currentData.find(grp => grp.id === fields.group.id);
        currentGrp.subtasks.unshift(fields);
        return currentData;
      }
     
    });

  }

  const addNewGroup = fields => {
    setLocalData(currentData => {
      fields.subtasks = [];
      currentData.unshift(fields);
      return currentData;
    });

  }
  const updateOneGroup = updatedField => {
    setLocalData(currentData => {
      const currentGroup = currentData.find(d => d.id === updatedField.id);
      currentGroup.name = updatedField.name;
      return currentData;
    });

  }
  const updateOneTask = updatedField => {
    setLocalData(currentData => {
      const currentGrp = currentData.find(grp => grp.id === updatedField.grpId);
      const currentSubTask = currentGrp.subtasks.find(d => d.id === updatedField.id);
      currentSubTask.name = updatedField.name;
      currentSubTask.estimatedDays = updatedField.estimatedDays;
      currentSubTask.checklist = updatedField.checklist;
      currentSubTask.grpId = updatedField.grpId;
      return currentData;
    });

  }

  const updateTask = () => {
    doAction({...action, isWorking: true});
    const checklist = $checklistInputRef.current.value.split('\n\n').filter(e => e.trim());;
    const updatedFields = {
      name: $nameInputRef.current.value,
      estimatedDays: $estimatedDaysRef.current.value,
      checklist,
      grpId: selectedGroup.id,
      id: selectedSubTask.id
    }
    if(action.isAdd) {
      api.optimisticAdd(`/tasksMaster/subtask`, {
        updatedFields,
        currentFields: selectedSubTask,
        setLocalData: fields => {
          addNewTask(fields);
        },
      });
    } else if(action.isEdit) {
      api.optimisticUpdate(`/tasksMaster/subtask`, {
        updatedFields,
        currentFields: taskList,
        setLocalData: fields => {
          updateOneTask(fields);
        },
      });
    }
    doAction({ isAdd: false, isEdit: false });
    
  };

  const updateGroup = () => {
    doAction({ ...action, isWorking: true });
    const updatedFields = {
      name: $nameInputRef.current.value,
      id: selectedGroup.id
    }
    if (action.isGroupAdd) {
      api.optimisticAdd(`/tasksMaster/task`, {
        updatedFields,
        currentFields: selectedGroup,
        setLocalData: fields => {
          addNewGroup(fields);
        },
      });
    } else if (action.isGroupEdit) {
      api.optimisticUpdate(`/tasksMaster/task`, {
        updatedFields,
        currentFields: taskList,
        setLocalData: fields => {
          updateOneGroup(fields);
        },
      });
    }
    doAction({ isAdd: false, isEdit: false, isGroupAdd: false, isGroupEdit: false });

  };


  return (
    <ProjectPage>
      <Sidebar/>
      Task Master
      <AddButton variant="primary" onClick={() => {selectGroup({}); doAction({isGroupAdd: true, isAdd: false, isEdit: false, isGroupEdit: false })}} >
        Add new Group
        </AddButton>
      <Lists>
        <List>
          <Title> Groups  (Total: {taskList.length})</Title>
          {taskList.map((task, index)=> {
            const isSelected = selectedGroup.id === task.id;
            return <TaskItem selected={isSelected} key={index} onClick={()=> selectGroup(task)}>
              <TaskTitle>{task.name} </TaskTitle>
              {isSelected ? <StyledIcon type="chevron-right" top={1} /> : <span/> }
            </TaskItem>
          })}
        </List>
        {selectedGroup.id ? <List>
          <Title><Icon type="page" top={1} /> <TaskTitle> {selectedGroup.name}</TaskTitle>  
            <Button style={{ textDecoration: 'underline', marginLeft: '7px' }} 
            onClick={() => { doAction({ isGroupAdd: false, isAdd: false, isEdit: false, isGroupEdit: true }) }}
            variant="secondary">Edit</Button></Title>

          <ModalSectionTitle>SubTasks: <Button style={{ marginLeft: '15px' }}
            onClick={() => { selectSubTask({}); doAction({ isGroupAdd: false, isAdd: true, isEdit: false, isGroupEdit: false }) }}
            variant="secondary" icon="plus">Add New Subtask </Button> </ModalSectionTitle>
          <br/><br/>
          {selectedGroup.subtasks.map((subtask, index) => {
            const isSelected = selectedSubTask.id === subtask.id;
            return <TaskItem selected={isSelected} key={index} onClick={() => selectSubTask(subtask)}>
              <TaskTitle>{subtask.name} </TaskTitle>
              {isSelected ? <StyledIcon type="chevron-right" top={1} /> : <span />}
            </TaskItem>
          })}


       
        </List> : <List/>}

        {selectedSubTask.id ? <List>
          <Title><Icon type="page" top={1} /> <TaskTitle> {selectedSubTask.name}</TaskTitle></Title>

          <Title> Estimated Days: <TaskTitle>  {selectedSubTask.estimatedDays} </TaskTitle> </Title>

          <Title> Checklist:</Title>
          
    
            {selectedSubTask.checklist && selectedSubTask.checklist.map((listItem, index) => {
              return <TaskTitle key={index} style={{marginLeft: '24px'}}> <span> &#8226; </span> {listItem} </TaskTitle>
          })}
          
          <EditButton variant="primary" onClick={() => doAction({ isAdd: false, isEdit: true, isGroupEdit: false, isGroupAdd: false })}>
            Edit
        </EditButton>
       </List> : <List/>}
      </Lists>
      <Modal
        isOpen={action.isAdd || action.isEdit}
        testid="modal:issue-details"
        width={520}
        withCloseIcon={false}
        renderContent={modal => (
          <Fragment>
            <br />

            <TaskTitle style={{marginLeft: '20px'}}><CheckIcon type={"story"} /> {action.isAdd ? "Add" : "Edit"} Task Item  </TaskTitle>
            <br />  <br />
              <TitleTextarea
              minRows={1}
              placeholder="Subtask Name"
              defaultValue={selectedSubTask.name}
              ref={$nameInputRef}
            />
            <ModalSectionTitle>Original Estimate (Days)</ModalSectionTitle>
            <ModalInput
              ref={$estimatedDaysRef}
              defaultValue={selectedSubTask.estimatedDays}
              placeholder="Days"

            />
            <br/>
            <ModalSectionTitle> <CheckIcon type={"task"} top={3}/> CHECKLIST </ModalSectionTitle>
              <TitleTextarea
                minRows={3}
                placeholder={`Cheklist Item 1
                
Cheklist Item 2

Cheklist Item 3`}
              defaultValue={selectedSubTask.checklist && selectedSubTask.checklist.join('\n\n')}
                ref={$checklistInputRef}
              />
            
            <ModalButton variant="primary" isWorking={action.isWorking} onClick={updateTask}>
              {action.isAdd ? "Add" : "Edit"}
        </ModalButton>
        <ModalButton variant="primary" onClick={() => doAction({ isAdd: false, isEdit: false })}>
              Cancel
        </ModalButton>
          
           
          </Fragment>

        )}
      />
      <Modal
        isOpen={action.isGroupAdd || action.isGroupEdit}
        testid="modal:group-add"
        width={520}
        withCloseIcon={false}
        renderContent={modal => (
          <Fragment>
            <br />

            <TaskTitle style={{ marginLeft: '20px' }}><CheckIcon type={"story"} /> {action.isGroupAdd ? "Add" : "Edit"} Group Item  </TaskTitle>
            <br />  <br />
            <TitleTextarea
              minRows={1}
              placeholder="Group Name"
              defaultValue={selectedGroup.name}
              ref={$nameInputRef}
            />
            <br />  <br />
            <ModalButton variant="primary" isWorking={action.isWorking} onClick={updateGroup}>
              {action.isGroupAdd ? "Add" : "Edit"}
            </ModalButton>
            <ModalButton variant="primary" onClick={() => doAction({ isAdd: false, isEdit: false, isGroupAdd: false, isGroupEdit: false })}>
              Cancel
        </ModalButton>


          </Fragment>

        )}
      />
     
    
    </ProjectPage>
  );
};

export default TaskMasterPage;
