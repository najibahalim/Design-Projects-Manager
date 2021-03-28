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
  const [selectedTask, selectTask] = useState({});
  const [action, doAction] = useState({isAdd: false, isEdit: false});
  const $nameInputRef = useRef();
  const $checklistInputRef = useRef();
  const $estimatedDaysRef = useRef();
  const { match: { params } } = props;

  const [{ data, error, setLocalData }, fetchProject] = useApi.get(`/tasksMaster`);


  if (!data) return <Loader />;
  if (error) return <PageError />;

  const taskList = data;


  const addNewTask = fields => {
    console.log("addNewTask")
    console.log(fields);
    setLocalData(currentData => {
      console.log(currentData);
      currentData.unshift(fields);
      return currentData;
    });


  }

  const updateOneTask = updatedField => {
    setLocalData(currentData => {
      const currentTask = currentData.find(d => d.id === updatedField.id);
      currentTask.checklist = updatedField.checklist;
      currentTask.name = updatedField.name;
      currentTask.estimatedDays = updatedField.estimatedDays;
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
      id: selectedTask.id
    }
    if(action.isAdd) {
      api.optimisticAdd(`/tasksMaster`, {
        updatedFields,
        currentFields: selectedTask,
        setLocalData: fields => {
          addNewTask(fields);
        },
      });
    } else if(action.isEdit) {
      api.optimisticUpdate(`/tasksMaster`, {
        updatedFields,
        currentFields: taskList,
        setLocalData: fields => {
          updateOneTask(fields);
        },
      });
    }
    doAction({ isAdd: false, isEdit: false });

   

    
  };

  return (
    <ProjectPage>
      <Sidebar/>
      Task Master
      <AddButton variant="primary" onClick={() => {selectTask({}); doAction({ isAdd: true, isEdit: false })}} >
        Add new Task
        </AddButton>
      <Lists>
        <List>
          <Title> Tasks  (Total: {taskList.length})</Title>
          {taskList.map((task, index)=> {
            const isSelected = selectedTask.id === task.id;
            return <TaskItem selected={isSelected} key={index} onClick={()=> selectTask(task)}>
              <TaskTitle>{task.name} </TaskTitle>
              {isSelected ? <StyledIcon type="chevron-right" top={1} /> : <span/> }
            </TaskItem>
          })}
        </List>
        {selectedTask.id ? <List>
          <Title> {selectedTask.name}</Title>
          <Title> Estimated Days: <TaskTitle>  {selectedTask.estimatedDays} </TaskTitle> </Title>
          
          <Title> Checklist:</Title>
          {selectedTask.checklist && selectedTask.checklist.map((listItem, index) => {
            return <TaskTitle style={{ marginLeft: '20px' }} key={index}> <CheckIcon type={"task"} /> {listItem} </TaskTitle>
          })}
          <EditButton variant="primary" onClick={() => doAction({isAdd: false, isEdit: true})}>
            Edit
        </EditButton>
        </List> : <div/>}
       

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
            <ModalSectionTitle>Task Name</ModalSectionTitle>
              <TitleTextarea
              minRows={1}
              placeholder="Task Name"
              defaultValue={selectedTask.name}
              ref={$nameInputRef}
            />
            <ModalSectionTitle>Original Estimate (Days)</ModalSectionTitle>
            <ModalInput
              ref={$estimatedDaysRef}
              defaultValue={selectedTask.estimatedDays}
              placeholder="Days"

            />
            <br/>
            <ModalSectionTitle> <CheckIcon type={"task"} top={3}/> CHECKLIST </ModalSectionTitle>
              <TitleTextarea
                minRows={3}
                placeholder={`Cheklist Item 1
                
Cheklist Item 2

Cheklist Item 3`}
                defaultValue={selectedTask.checklist && selectedTask.checklist.join('\n\n')}
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
     
    
    </ProjectPage>
  );
};

export default TaskMasterPage;
