export type Identifier = string | number;

export type PathStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";

export interface TaskPayload {
  title: string;
  description?: string;
  type?: TaskStatus;
  status?: TaskStatus;
  estimatedMinutes?: number;
}

export interface TaskResponse extends TaskPayload {
  id: Identifier;
}

export interface SectionPayload {
  title: string;
  description?: string;
  orderIndex?: number;
  estimatedDays?: number;
}

export interface SectionResponse extends SectionPayload {
  id: Identifier;
  status?: PathStatus;
  tasks?: TaskResponse[];
}

export interface PathPayload {
  title: string;
  description?: string;
  startDate?: string;
  targetEndDate?: string;
}

export interface PathResponse extends PathPayload {
  id?: Identifier;
  status: PathStatus;
  sections?: SectionResponse[];
}

export interface LearningPathDashboard {
  totalPaths?: string;
  pathsInProgress?: string;
  completedPaths?: string;
  averageProgress?: string;
  learningPaths?: PathResponse[];
}
