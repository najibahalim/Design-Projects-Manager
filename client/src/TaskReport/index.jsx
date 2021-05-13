import React, { Fragment, useState, useRef } from 'react';
import * as XLSX from "xlsx";
import SplitPane from "react-split-pane";
import api from 'shared/utils/api';
import useApi from 'shared/hooks/api';
import { PageError, CopyLinkButton, Button, AboutTooltip } from 'shared/components';
import { List, Title, IssuesCount, Issues } from '../Projects/Lists/List/Styles';
import { Lists } from '../Projects/Lists/Styles';
import { TaskItem, TaskTitle, StyledIcon, CheckIcon, StyledButton, TitleTextarea, Content } from './Styles';
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


const TaskReportPage = (props) => {
  const [selectedProject, selectProject] = useState({});
  const [selectedItem, selectItem] = useState({});
  const [seltectedGroup, selectGroup] = useState({});
  const { match: { params } } = props;

  const [{ data, error, setLocalData }, fetchGroupsWithTasks] = useApi.get(`/reports/list`);


  if (!data) return <Loader />;
  if (error) return <PageError />;

  const downloadReport = async (type, id, name) => {
    console.log(type, id);
    let url = "/reports/";
    debugger;

    switch(type) {
      case "project":
        url = "/reports/project?id=" + id;
        break;
      case "item":
        url = "/reports/item?id=" + id;
        break;
      case "group":
        url = "/reports/group?id=" + id;
        break;
      case "task":
        url = "/reports/task?id=" + id;
    }
    const report = await api.get(url);
    const worksheet = XLSX.utils.json_to_sheet(report);
    const wb = XLSX.utils.book_new();
    const naam = `${name}_${type}_report`;
    wb.Props = {
      Title: "REPORT",
      Subject: type.toUpperCase(),
      Author: "DiMan",
      CreatedDate: new Date()
    };
    wb.SheetNames.push(naam);
    wb.Sheets[naam] = worksheet;
    XLSX.writeFile(wb, naam + ".xlsx");
  }
  return (
    <ProjectPage>
      <Sidebar/>
      Task Report
      <Lists>
        {/* List 1 */}
        <List>
          {data.map((project) => {
            const isSelected = selectedProject.id === project.id;
            return <TaskItem selected={isSelected} key={project.id} onClick={() => selectProject(project)}>
              {project.name} <br /> ({project.items.length}) Items
              <StyledButton icon="arrow-down" top={1} onClick={() => downloadReport("project", project.id, project.name)} />
            </TaskItem>
          })}
        </List>

        {/* List 2 */}
        <List>
          {selectedProject.items && selectedProject.items.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return <TaskItem selected={isSelected} key={item.id} onClick={() => selectItem(item)}>
              {item.name} <br/> ({item.taskGroups.length}) Task Groups
              <StyledButton icon="arrow-down" top={1} onClick={() => downloadReport("item", item.id, item.name)} />
            </TaskItem>
          })}
        </List>

        {/* List 3 */}
        <List>
          {selectedItem.taskGroups && selectedItem.taskGroups.map((taskGroup) => {
            const isSelected = seltectedGroup.id === taskGroup.id;
            return <TaskItem selected={isSelected} key={taskGroup.id} onClick={() => selectGroup(taskGroup)}>
              {taskGroup.name} <br /> ({taskGroup.tasks.length}) Tasks
              <StyledButton icon="arrow-down" top={1} onClick={() => downloadReport("group", taskGroup.id, taskGroup.name)} />
            </TaskItem>
          })}
        </List>

        {/* List 4 */}
        <List>
            {seltectedGroup.tasks && seltectedGroup.tasks.map((task) => {
              return <TaskItem key={task.id}>
                {task.name}
                <StyledButton icon="arrow-down" top={1} onClick={() => downloadReport("task", task.id, task.name)} />
              </TaskItem>
            })}
        </List>
      </Lists>

     
    
    </ProjectPage>
  );
};
export default TaskReportPage;

