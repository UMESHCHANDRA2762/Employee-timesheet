export const membersData = [
  {
    id: 1,
    name: "Byron Jett",
    avatarInitials: "BJ",
    title: "Lead Developer",
    managerName: "Elon Musk",
    hourlyRate: 50,
    overtimeRate: 75,
    totalTime: "7h 30m",
    totalIdleTime: "0h 30m",
    timeEntries: [
      { id: 101, project: 'Falcon Heavy', task: 'Auditing Information Architecture', startTime: '09:00', endTime: '13:00', total: '4h 0m', colorClass: 'project-blue', idleTimes: [{ id: 1001, startTime: '11:20', endTime: '11:50', total: '0h 30m' }] },
      { id: 102, project: 'Grasshopper', task: 'Planning on Falcon-9 Launch', startTime: '14:00', endTime: '17:30', total: '3h 30m', colorClass: 'project-green', idleTimes: [] }
    ]
  },
  {
    id: 2,
    name: "Jane Doe",
    avatarInitials: "JD",
    title: "UI/UX Designer",
    managerName: "Elon Musk",
    hourlyRate: 45,
    overtimeRate: 65,
    totalTime: "6h 0m",
    totalIdleTime: "1h 15m",
    timeEntries: [
      { id: 201, project: 'Starship', task: 'UI/UX Mockups', startTime: '10:00', endTime: '12:30', total: '2h 30m', colorClass: 'project-green', idleTimes: [{ id: 2001, startTime: '11:00', endTime: '11:30', total: '0h 30m' }] },
      { id: 202, project: 'Internal', task: 'Team Sync Meeting', startTime: '13:30', endTime: '14:15', total: '0h 45m', colorClass: 'project-blue', idleTimes: [] },
      { id: 203, project: 'Starship', task: 'Component Development', startTime: '14:15', endTime: '17:00', total: '2h 45m', colorClass: 'project-green', idleTimes: [{ id: 2002, startTime: '15:30', endTime: '16:15', total: '0h 45m' }] }
    ]
  },
  {
    id: 3,
    name: "Sam Wilson",
    avatarInitials: "SW",
    title: "Backend Engineer",
    managerName: "Elon Musk",
    hourlyRate: 55,
    overtimeRate: 80,
    totalTime: "8h 0m",
    totalIdleTime: "0h 0m",
    timeEntries: [
      { id: 301, project: 'Grasshopper', task: 'Backend API Refactor', startTime: '09:00', endTime: '17:00', total: '8h 0m', colorClass: 'project-blue', idleTimes: [] }
    ]
  },
  {
    id: 4,
    name: "Laura Palmer",
    avatarInitials: "LP",
    title: "QA Engineer",
    managerName: "Elon Musk",
    hourlyRate: 40,
    overtimeRate: 60,
    totalTime: "7h 30m",
    totalIdleTime: "0h 45m",
    timeEntries: [
        { id: 401, project: 'Starship', task: 'Testing new heat shield materials', startTime: '09:00', endTime: '13:00', total: '4h 0m', colorClass: 'project-green', idleTimes: [{ id: 4001, startTime: '10:30', endTime: '11:15', total: '0h 45m' }] },
        { id: 402, project: 'Dragon Capsule', task: 'Regression testing', startTime: '14:00', endTime: '17:30', total: '3h 30m', colorClass: 'project-blue', idleTimes: [] }
    ]
  },
  {
    id: 5,
    name: "Dale Cooper",
    avatarInitials: "DC",
    title: "DevOps Specialist",
    managerName: "Elon Musk",
    hourlyRate: 60,
    overtimeRate: 90,
    totalTime: "8h 0m",
    totalIdleTime: "0h 0m",
    timeEntries: [
        { id: 501, project: 'Internal', task: 'CI/CD Pipeline Maintenance', startTime: '09:30', endTime: '17:30', total: '8h 0m', colorClass: 'project-blue', idleTimes: [] }
    ]
  },
  {
    id: 6,
    name: "Audrey Horne",
    avatarInitials: "AH",
    title: "Project Manager",
    managerName: "Elon Musk",
    hourlyRate: 65,
    overtimeRate: 95,
    totalTime: "7h 15m",
    totalIdleTime: "0h 15m",
    timeEntries: [
        { id: 601, project: 'Falcon Heavy', task: 'Planning meeting', startTime: '09:30', endTime: '11:30', total: '2h 0m', colorClass: 'project-green', idleTimes: [] },
        { id: 602, project: 'Grasshopper', task: 'Resource allocation', startTime: '11:30', endTime: '14:30', total: '3h 0m', colorClass: 'project-blue', idleTimes: [] },
        { id: 603, project: 'Internal', task: 'Budget review', startTime: '15:00', endTime: '17:15', total: '2h 15m', colorClass: 'project-green', idleTimes: [{ id: 6001, startTime: '16:00', endTime: '16:15', total: '0h 15m' }] }
    ]
  }
];


export const projectsData = [
  { id: "proj-1", name: "Falcon Heavy" },
  { id: "proj-2", name: "Starship" },
  { id: "proj-3", name: "Grasshopper" },
  { id: "proj-4", name: "Internal" },
  { id: "proj-5", name: "Dragon Capsule" },
];

export const tasksData = [
  { id: "task-1", name: "Development" },
  { id: "task-2", name: "Planning" },
  { id: "task-3", name: "Auditing" },
  { id: "task-4", name: "Team Meeting" },
  { id: "task-5", name: "UI/UX Mockups" },
  { id: "task-6", name: "Backend API Refactor" },
];

// Mock data for organizations (used in timezone filter).
export const organizationsData = [
    { id: 'org-1', name: 'Organization' },
    { id: 'org-2', name: 'Tesla' },
    { id: 'org-3', name: 'The Boring Company' },
];