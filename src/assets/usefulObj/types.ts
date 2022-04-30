export interface EventType {
  id: number;
  title: string;
  description: string;
  createdBy: number;
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
