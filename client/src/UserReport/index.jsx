import React, { Fragment, useState, useRef } from 'react';
import * as XLSX from "xlsx";
import Assignee from '../PDP/Assignee';

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


const UserReportPage = (props) => {
  const [fromDate, setFromDate] = useState({});
  const [toDate, setToDate] = useState({});
  const [user, setUser] = useState({});
  const { match: { params } } = props;

  const [{ data, error, setLocalData }, fetchGroupsWithTasks] = useApi.get(`/users`);


  if (!data) return <Loader />;
  if (error) return <PageError />;
  // setUser({
  //   name: data[0].name,
  //   id: data[0].id
  // })
  const downloadReport = async () => {
    const url = "/reports/assignee?id=" + user.id;
    const report = await api.get(url);
    const worksheet = XLSX.utils.json_to_sheet(report);
    const wb = XLSX.utils.book_new();
    const naam = `${user.name}_user_report`;
    wb.Props = {
      Title: "REPORT",
      Subject: "UserReport".toUpperCase(),
      Author: "DiMan",
      CreatedDate: new Date()
    };
    wb.SheetNames.push(naam);
    wb.Sheets[naam] = worksheet;
    XLSX.writeFile(wb, naam + ".xlsx");
  }

  const newUserSelected = (par1) => {
    setUser({
      id: par1,
      name: data.find(u => u.id === par1).name
    });
  }
  const dateSelected = (par1, par2) => {
    if(par2 === "from") {
      setFromDate(par1.target.value);
    } else if(par2 === "to") {
      setFromDate(par1.target.value);
    }
  }
  return (
    <ProjectPage>
      <Sidebar/>
      User Performance Report
      <Divider/>
      <Content>

      <ModalSectionTitle>Select User: </ModalSectionTitle>
      <Assignee task={{ userId: user.id }} updateTaskUser={newUserSelected} projectUsers={data} />

      <ModalSectionTitle>Date Range: </ModalSectionTitle>
      From: &nbsp; <input type="date" onChange={(event)=> dateSelected(event, "from")}></input>
      &nbsp; To: &nbsp; <input type="date" onChange={(event) => dateSelected(event, "to")}></input>

      {/* Space b/w input and download btn */}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <Button onClick = {()=> downloadReport()}><Icon type="arrow-down" top={2}> </Icon>Download</Button>
      </Content>


    </ProjectPage>
  );
};
export default UserReportPage;

