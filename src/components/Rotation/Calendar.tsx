import React from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createEventId, getRotationArr } from './event_utils';
import axios from 'axios';
import getAddress from '@globalObj/function/getAddress';
import { getToken } from '@cert/TokenStorage';
import errorAlert from '@globalObj/function/errorAlert';
import '@css/Rotation/Calendar.scss';
import { getDecodedToken } from '@cert/TokenStorage';
import { DAY_OF_SUNDAY } from './rotation_utils';
import apiClient from '@service/apiClient';

const COLOR = {
  me: '#e79f5a',
  others: '#4992ce',
};

export default class Calendar extends React.Component {
  state = {
    auth: getDecodedToken(),
    weekendsVisible: true,
    currentEvents: [],
  };

  render() {
    return (
      <div className="demo-app">
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'today',
            }}
            initialView="dayGridMonth"
            editable={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            initialEvents={getRotationArr} // alternatively, use the `events` setting to fetch from a feed
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            dateClick={this.handleDateClick}
            eventDrop={this.handleEventDrop}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            eventAdd={this.requestAdd}
            eventRemove={this.requestRemove}
            // eventChange={this.requestChange} // 드래그앤롭에서 revert() 해도 진행되어, 해당 훅을 활용하기 어려움을 확인

            eventAllow={this.dropEventAllowHandler}

            // 해당 기간외에 회색처리 되며 디스플레이도 되지 않음 => 하나의 달만을 가지고 핸들링시 활용도 존재.
            // validRange = {{
            //   start: '2023-02-01',
            //   end: '2023-03-01'
            // }}
          />
        </div>
      </div>
    );
  }

  /*
    동일 달 여부 => 기본적으로 같은 달안에서 이루어진다.
    주말 여부 => 0인 일요일과 6인 토요일은 6으로 나누면 0
    => 2024.09.29: 일요일 여부로 수정
    중복 여부(해당일자에 이미 사서 추가된 상태) => 날짜 & title(인트라id)를 비교
    공휴일 여부 => 하고 싶다면 공휴일 정보는 미리 가져와서 추가 해야됨
  */
  dropEventAllowHandler = (dropInfo, draggedEvent) => {
    const { currentEvents } = this.state;
    const isSameMonth = draggedEvent.start.getMonth() === dropInfo.start.getMonth();
    const isSunday = dropInfo.start.getDay() === DAY_OF_SUNDAY;
    const isDuplicated = currentEvents.some((e) => e.startStr === dropInfo.startStr && e.title === draggedEvent.title);
    return isSameMonth && !isSunday && !isDuplicated;
  };

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };

  handleDateClick = (info) => {
    const isSunday = info.date.getDay() === DAY_OF_SUNDAY;
    if (isSunday) {
      return;
    }
    
    const { currentEvents, auth } = this.state;
    const title = auth?.id;

    if (!title) {
      window.alert('로그인을 먼저 해주세요!');
      return;
    }

    const isAlreadyIncluded = currentEvents.some((e) => e.title === title && e.startStr === info.dateStr);

    if (isAlreadyIncluded) {
      window.alert(`해당 날짜 '${info.dateStr}'에 본인의 일정이 이미 존재합니다.`);
      return;
    }

    const calendarApi = info.view.calendar;

    if (window.confirm(`'${info.dateStr}'에 일정을 추가합니다.`)) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: info.dateStr,
        allDay: info.allDay,
        color: COLOR.me,
      });
    }
  };

  handleEventDrop = (info) => {
    const { auth } = this.state;
    const title = auth?.id;

    if (!title) {
      window.alert('로그인을 먼저 해주세요!');
      info.revert();
      return;
    }

    if (title !== info.event.title) {
      if (!window.confirm(`본인의 일정이 아닌 ${info.event.title}의 일정을 수정하는 것이 맞습니까?`)) {
        info.revert();
        return;
      }
    }

    /* revert를 사용하더라도 eventChange 훅이 동작한다. 따라서 훅을 이용하지 않고 직접 this.requestChange 함수를 호출하여 사용한다. */
    if (!window.confirm(`'${info.oldEvent.startStr}'을 '${info.event.startStr}'으로 일정을 변경합니다.`)) {
      info.revert();
      return;
    }
    this.requestChange(info);
  };

  handleEventClick = (clickInfo) => {
    const { auth } = this.state;
    const title = auth?.id;

    if (!title) {
      window.alert('로그인을 먼저 해주세요!');
      return;
    }

    const isOwner = title === clickInfo.event.title;

    if (!isOwner) {
      window.alert('본인 일정만 삭제가 가능합니다.');
      return;
    }

    if (window.confirm(`'${clickInfo.event.startStr}' 일정을 삭제합니다`)) {
      clickInfo.event.remove();
    }
  };

  /*
  todo
  1. use apiClient
  2. 인자를 들어오는 데이터들을 간소화
  */
  requestRotationUpdate = async (info, config, successMsg, errorMsg) => {
    try {
      const res = await axios(config);
      window.alert(successMsg);
    } catch (err) {
      window.alert(errorMsg);
      info.revert();
      console.error(err);
    }
  };

  requestAdd = async (info) => {
    const dateString: string = info.event.startStr;
    const dateParts: string[] = dateString.split('-');
    const year: number = parseInt(dateParts[0]);
    const month: number = parseInt(dateParts[1]);
    const day: number = parseInt(dateParts[2]);

    await this.requestRotationUpdate(
      info,
      {
        method: 'post',
        url: `${getAddress()}/rotations/`,
        data: { attendDate: [day], year: year, month: month },
        headers: { Authorization: `Bearer ${getToken()}` },
      },
      `사서 로테이션 일정<${info.event.startStr}>이 성공적으로 추가되었습니다.`,
      `사서 로테이션 일정<${info.event.startStr}>추가에 실패했습니다.`,
    );
  };

  requestRemove = async (info) => {
    const dateString: string = info.event.startStr;
    const dateParts: string[] = dateString.split('-');
    const year: number = parseInt(dateParts[0]);
    const month: number = parseInt(dateParts[1]);
    const day: number = parseInt(dateParts[2]);

    await this.requestRotationUpdate(
      info,
      {
        method: 'delete',
        url: `${getAddress()}/rotations/`,
        data: { day: day, year: year, month: month },
        headers: { Authorization: `Bearer ${getToken()}` },
      },
      `사서 로테이션 일정<${info.event.startStr}>이 성공적으로 제거되었습니다.`,
      `사서 로테이션 일정<${info.event.startStr}>제거에 실패했습니다.`,
    );
  };

  requestChange = async (info) => {
    const oldDateString: string = info.oldEvent.startStr;
    const oldDateParts: string[] = oldDateString.split('-');
    const oldYear: number = parseInt(oldDateParts[0]);
    const oldMonth: number = parseInt(oldDateParts[1]);
    const oldDay: number = parseInt(oldDateParts[2]);

    const newDateString: string = info.event.startStr;
    const newDateParts: string[] = newDateString.split('-');
    const newYear: number = parseInt(newDateParts[0]);
    const newMonth: number = parseInt(newDateParts[1]);
    const newDay: number = parseInt(newDateParts[2]);

    await this.requestRotationUpdate(
      info,
      {
        method: 'patch',
        url: `${getAddress()}/rotations/${info.event.title}`,
        data: { attendDate: [oldDay], updateDate: newDay, year: newYear, month: newMonth },
        headers: { Authorization: `Bearer ${getToken()}` },
      },
      `${info.oldEvent.title}의 사서 로테이션 일정<${info.oldEvent.startStr}>이 <${info.event.startStr}>으로 성공적으로 변경되었습니다.`,
      `${info.oldEvent.title}의 사서 로테이션 일정<${info.oldEvent.startStr}>을 <${info.event.startStr}>로 변경에 실패했습니다.`,
    );
  };
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
