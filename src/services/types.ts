export interface Shift {
  id: string;
  facility_id: string;
  worker_id?: string;
  start_time: string;
  end_time: string;
  profession: "CNA" | "LVN" | "RN";
  is_deleted: boolean;
}

export interface ShiftResponse {
  data: Shift[];
  pagination: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}