export interface EventType {
  id: number;
  title: string;
  description: string;
  createdId: number;
  intraId: string;
  isMatching: number;
}

export interface userData {
  id: string;
  isLogin: boolean;
  isAdmin: boolean;
  profileUrl: string;
}

export interface EvnetListType {
  statusCode: number;
  EventList: Event[];
}

export interface teamMemInfo {
  intraId: string;
  url: string;
  teamId: number;
}

export interface PostingType {
  boardId: number;
  eventId: number;
  teamId: number;
  title: string;
  writer: string; // createBy
  contents: string;
  createAt: Date;
  updateAt: Date;
  image: string[];
  attendMembers: { intraId: string; url: string }[];
  comments: { intraId: string; content: string; time: Date }[];
}

export interface ReviewModalShowType {
  mode: string;
  show: boolean;
}

export interface ReviewSelectedTeamType {
  [x: string]: teamMemInfo[];
}

export interface ReviewSelectedEventType extends EventType {
  teamList: ReviewSelectedTeamType;
}
