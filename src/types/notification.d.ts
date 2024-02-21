export interface notificationType {
  NotificationsCount: number;
  NotificationsDetailsList: NotificationsDetailsList;
  status: boolean;
}
export interface NotificationsDetailsList {
  current_page?: number;
  data?: Datum[];
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  links?: Link[];
  next_page_url?: null | string;
  path?: string;
  per_page?: number;
  prev_page_url?: null;
  to?: number;
  total?: number;
}
export interface Datum {
  body?: string;
  created_at?: string;
  created_by?: number;
  deleted?: number;
  id?: number;
  link_image?: string;
  link_redirect?: string;
  link_redirect_app?: string;
  read_status?: number;
  status?: number;
  title?: string;
  updated_at?: string;
  updated_by?: number;
  user_id?: string;
}

export interface Link {
  active?: boolean;
  label?: string;
  url?: null | string;
}
