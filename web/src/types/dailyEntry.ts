export type DailyEntry = {
  id?: string;
  user_id?: string | null;
  entry_date: string; // YYYY-MM-DD
  said_no_count: number;
  asked_help_count: number;
  chose_for_joy_count: number;
  took_rest: boolean;
  did_cook?: boolean;
  did_exercise?: boolean;
  must_do_tasks: string[]; // length 3
  wanted_but_skipped_tasks: string[]; // length 3
  created_at?: string;
  updated_at?: string;
};
