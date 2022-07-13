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
  profile: string;
  teamId: number;
}

export interface imageType {
  imageId: number;
  boardId: number;
  filePath: string;
  fileType: string;
}

export interface PostingType {
  boardId: number;
  eventId?: number;
  title: string;
  intraId: string; // createBy
  contents: string;
  createdAt: string;
  updatedAt?: string;
  commentNum: number;
  profile: string;
  images: imageType[];
}

export interface CommentType {
  id: number;
  intraId: string;
  comments: string;
}

// Type for review

export interface ReviewBoardType {
  boardId: number;
  eventId: number;
  title: string;
  intraId: string; // createBy
  contents: string;
  createdAt: string;
  updatedAt: string;
  images: imageType[];
  profile: string;
  attendMembers: { intraId: string; profile: string }[];
  comments: CommentType[];
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

export interface ReviewPostingFileType {
  id: number;
  file: Blob;
  type: string;
}

export interface ReviewPostingUrlType {
  id: number;
  url: string;
  type: string;
}
