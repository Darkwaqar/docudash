import { StampPreview } from './stampPreview';

//stamp api
export interface StampListAPI {
  status: boolean;
  message: string;
  data: {
    data: StampPreview[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: null;
    to: number;
    total: number;
  };
}
