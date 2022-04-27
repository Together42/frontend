export interface EventType {
  id: number;
  title: string;
  description: string;
  createdBy: number;
}

export interface userData {
  id: number;
  isLogin: boolean;
  isAdmin: boolean;
  profileUrl: string;
}

export interface EvnetListType {
  statusCode: number;
  EventList: Event[];
}
