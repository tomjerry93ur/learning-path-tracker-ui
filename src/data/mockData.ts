export type Task = {
  id: string;
  title: string;
  status: "Done" | "In Progress" | "To Do";
  day: number;
  estimatedHours: number;
};

export type Section = {
  id: string;
  title: string;
  targetDays: number;
  plannedHours: number;
  progress: number;
  tasks: Task[];
};

export type Path = {
  id: string;
  name: string;
  description: string;
  overallProgress: number;
  sections: Section[];
};

export type Activity = {
  id: string;
  description: string;
  timeAgo: string;
};

export const mockedPaths: Path[] = [
  {
    id: "path-1",
    name: "Mastering React Hooks",
    description:
      "Deep dive into useState, useEffect, useContext, and custom hooks to build robust experiences.",
    overallProgress: 0.75,
    sections: [
      {
        id: "sec-1",
        title: "React Fundamentals",
        targetDays: 4,
        plannedHours: 8,
        progress: 1,
        tasks: [
          { id: "t1", title: "Setup development environment", status: "Done", day: 1, estimatedHours: 1 },
          { id: "t2", title: "Understand JSX", status: "Done", day: 2, estimatedHours: 2 },
          { id: "t3", title: "Component basics", status: "In Progress", day: 3, estimatedHours: 2 },
          { id: "t4", title: "Handling events", status: "To Do", day: 4, estimatedHours: 1.5 }
        ]
      },
      {
        id: "sec-2",
        title: "Hooks & State",
        targetDays: 6,
        plannedHours: 12,
        progress: 0.45,
        tasks: [
          { id: "t5", title: "useState Hook", status: "Done", day: 5, estimatedHours: 1 },
          { id: "t6", title: "useEffect Hook", status: "In Progress", day: 6, estimatedHours: 2 },
          { id: "t7", title: "Context API", status: "To Do", day: 7, estimatedHours: 2 },
          { id: "t8", title: "Advanced patterns", status: "To Do", day: 8, estimatedHours: 3 }
        ]
      }
    ]
  },
  {
    id: "path-2",
    name: "Cybersecurity Fundamentals",
    description:
      "Understand key cybersecurity concepts, threat modeling, and defense strategies.",
    overallProgress: 0.2,
    sections: [
      {
        id: "sec-3",
        title: "Security Foundations",
        targetDays: 5,
        plannedHours: 10,
        progress: 0.4,
        tasks: [
          { id: "t9", title: "Understanding threats", status: "In Progress", day: 3, estimatedHours: 2.5 },
          { id: "t10", title: "Encryption basics", status: "To Do", day: 4, estimatedHours: 2 }
        ]
      }
    ]
  },
  {
    id: "path-3",
    name: "Data Science with Python",
    description:
      "Learn Python for analytics, machine learning algorithms, and storytelling with data.",
    overallProgress: 0.9,
    sections: [
      {
        id: "sec-4",
        title: "Data Preparation",
        targetDays: 7,
        plannedHours: 14,
        progress: 0.9,
        tasks: [
          { id: "t11", title: "Clean datasets", status: "Done", day: 2, estimatedHours: 3 },
          { id: "t12", title: "Feature engineering", status: "Done", day: 3, estimatedHours: 2.5 }
        ]
      }
    ]
  }
];

export const mockedActivity: Activity[] = [
  { id: "act-1", description: "Started 'Introduction to Cloud Computing with AWS'", timeAgo: "2 hours ago" },
  { id: "act-2", description: "Completed 'Understanding Closures' task in React Hooks", timeAgo: "1 day ago" },
  { id: "act-3", description: "Updated progress on 'Data Science with Python' to 90%", timeAgo: "2 days ago" },
  { id: "act-4", description: "Added new section 'Advanced Styling' to Next.js path", timeAgo: "3 days ago" }
];

export function getOverviewStats() {
  const totalPaths = mockedPaths.length;
  const inProgress = mockedPaths.filter((p) => p.overallProgress < 1).length;
  const completed = mockedPaths.filter((p) => p.overallProgress >= 1).length;
  const averageProgress =
    mockedPaths.reduce((sum, p) => sum + p.overallProgress, 0) / mockedPaths.length;

  return [
    { label: "Total Paths", value: String(totalPaths), note: "+1 new this month" },
    { label: "Paths in Progress", value: String(inProgress), note: "Currently active" },
    { label: "Completed Paths", value: String(completed), note: "Great work!" },
    { label: "Average Progress", value: `${Math.round(averageProgress * 100)}%`, note: "Across all paths" }
  ];
}
