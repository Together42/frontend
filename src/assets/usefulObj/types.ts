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
  loginId: string;
  url: string;
  teamId: number;
}

export interface PostingType {
  eventId: number;
  teamName: string;
  location: string;
  memList: { intraId: string; url: string }[];
  posting: string;
  commentList: { intraId: string; content: string; time: string }[];
  date: string;
  picture: string;
}

export interface ReviewModalShowType {
  mode: string;
  show: boolean;
}
