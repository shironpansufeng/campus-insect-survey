export type UserRole = "student" | "teacher";

export type RecordStatus = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  name: string | null;
  role: UserRole;
  created_at: string;
};

export type InsectRecord = {
  id: string;
  user_id: string;
  insect_name: string;
  location: string;
  habitat: string;
  count: number;
  observed_at: string;
  note: string | null;
  image_url: string | null;
  status: RecordStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  uploader?: {
    name: string | null;
  } | null;
};
