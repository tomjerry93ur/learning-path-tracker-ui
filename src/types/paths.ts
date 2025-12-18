export type PathStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface PathResponse {
  id?: string | number;
  title: string;
  description: string;
  startDate: string;
  targetEndDate: string;
  status: PathStatus;
}

export interface PathPayload {
  title: string;
  description: string;
  startDate: string;
  targetEndDate: string;
}
