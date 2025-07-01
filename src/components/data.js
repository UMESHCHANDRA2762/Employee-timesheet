// src/data.js
import byronJettImg from '../assets/img1.jpg';
import janeDoeImg from '../assets/img2.jpeg';
import samWilsonImg from '../assets/img3.jpeg';
import lauraPalmerImg from '../assets/img4.jpeg';
import daleCooperImg from '../assets/img5.jpg';
import audreyHorneImg from '../assets/img6.jpeg';


export const membersData = [
  {
    id: 1,
    name: "Byron Jett",
    avatarUrl: byronJettImg,
    title: "Lead Developer",
    managerName: "Elon Musk",
    hourlyRate: 50,
    overtimeRate: 75,
    totalTime: "7h 30m",
    timeEntries: [
      { id: 101, project: 'Falcon Heavy', task: 'Auditing Information Architecture', startTime: '09:00', endTime: '13:00', total: '4h 0m', colorClass: 'project-blue', idleTimes: [{ id: 1001, startTime: '11:20', endTime: '11:50', total: '0h 30m' }] },
      { id: 102, project: 'Grasshopper', task: 'Planning on Falcon-9 Launch', startTime: '14:00', endTime: '17:30', total: '3h 30m', colorClass: 'project-green', idleTimes: [] }
    ],
    biWeeklyTimesheet: {
      totalHours: "113 h 20 m",
      week1: { total: "60 h 51 m", days: [ { date: "Jun 16", hours: "8 h 15 m" }, { date: "Jun 17", hours: "8 h 25 m" }, { date: "Jun 18", hours: "9 h 0 m" }, { date: "Jun 19", hours: "7 h 42 m" }, { date: "Jun 20", hours: "8 h 25 m" }, { date: "Jun 21", hours: "7 h 42 m" }, { date: "Jun 22", hours: "11 h 22 m" } ] },
      week2: { total: "52 h 29 m", days: [ { date: "Jun 23", hours: "9 h 0 m" }, { date: "Jun 24", hours: "10 h 24 m" }, { date: "Jun 25", hours: "8 h 15 m" }, { date: "Jun 26", hours: "8 h 25 m" }, { date: "Jun 27", hours: "8 h 25 m" }, { date: "Jun 28", hours: "8 h 0 m" }, { date: "Jun 29", hours: "-" } ] },
    },
    monthlyTimesheet: {
      "2025-06-02": "7h 42m", "2025-06-03": "8h 25m", "2025-06-04": "9h 0m", "2025-06-05": "8h 15m", "2025-06-06": "10h 24m", "2025-06-09": "7h 42m", "2025-06-10": "8h 25m", "2025-06-11": "9h 0m", "2025-06-12": "8h 15m", "2025-06-13": "10h 24m", "2025-06-16": "7h 42m", "2025-06-17": "8h 25m", "2025-06-18": "9h 0m", "2025-06-19": "8h 15m", "2025-06-20": "10h 24m", "2025-06-23": "7h 42m", "2025-06-24": "8h 25m", "2025-06-25": "9h 0m", "2025-06-26": "8h 15m", "2025-06-27": "10h 24m", "2025-06-30": "7h 42m",
    }
  },
  {
    id: 2,
    name: "Jane Doe",
    avatarUrl: janeDoeImg,
    title: "UI/UX Designer",
    managerName: "Elon Musk",
    hourlyRate: 45,
    overtimeRate: 65,
    totalTime: "6h 0m",
    timeEntries: [
        { id: 201, project: 'Starship', task: 'UI/UX Mockups', startTime: '10:00', endTime: '12:30', total: '2h 30m', colorClass: 'project-green', idleTimes: [{ id: 2001, startTime: '11:00', endTime: '11:30', total: '0h 30m' }] },
        { id: 202, project: 'Internal', task: 'Team Sync Meeting', startTime: '13:30', endTime: '14:15', total: '0h 45m', colorClass: 'project-blue', idleTimes: [] },
    ],
    biWeeklyTimesheet: {
      totalHours: "80 h 0 m",
      week1: { total: "40 h 0 m", days: [ { date: "Jun 16", hours: "8 h 0 m" }, { date: "Jun 17", hours: "8 h 0 m" }, { date: "Jun 18", hours: "8 h 0 m" }, { date: "Jun 19", hours: "8 h 0 m" }, { date: "Jun 20", hours: "8 h 0 m" }, { date: "Jun 21", hours: "-" }, { date: "Jun 22", hours: "-" } ] },
      week2: { total: "40 h 0 m", days: [ { date: "Jun 23", hours: "8 h 0 m" }, { date: "Jun 24", hours: "8 h 0 m" }, { date: "Jun 25", hours: "8 h 0 m" }, { date: "Jun 26", hours: "8 h 0 m" }, { date: "Jun 27", hours: "8 h 0 m" }, { date: "Jun 28", hours: "-" }, { date: "Jun 29", hours: "-" } ] },
    },
    monthlyTimesheet: {
        "2025-06-02": "8h 0m", "2025-06-03": "8h 0m", "2025-06-04": "8h 0m", "2025-06-05": "8h 0m", "2025-06-06": "8h 0m", 
        "2025-06-09": "8h 0m", "2025-06-10": "8h 0m", "2025-06-11": "8h 0m", "2025-06-12": "8h 0m", "2025-06-13": "8h 0m",
        "2025-06-16": "8h 0m", "2025-06-17": "8h 0m", "2025-06-18": "8h 0m", "2025-06-19": "8h 0m", "2025-06-20": "8h 0m",
    }
  },
  {
    id: 3,
    name: "Sam Wilson",
    avatarUrl: samWilsonImg,
    title: "Backend Engineer",
    managerName: "Elon Musk",
    hourlyRate: 55,
    overtimeRate: 80,
    totalTime: "8h 0m",
    timeEntries: [],
    biWeeklyTimesheet: null,
    monthlyTimesheet: {
        "2025-07-01": "9h 15m", "2025-07-02": "9h 0m", "2025-07-03": "8h 45m", "2025-07-04": "9h 30m",
        "2025-07-07": "9h 0m", "2025-07-08": "9h 0m", "2025-07-09": "9h 0m", "2025-07-10": "9h 0m",
    }
  },

  { id: 4, name: "Laura Palmer", avatarUrl: lauraPalmerImg, title: "QA Engineer", managerName: "Elon Musk", hourlyRate: 40, overtimeRate: 60, totalTime: "7h 30m", timeEntries: [], biWeeklyTimesheet: null, monthlyTimesheet: null },
  { id: 5, name: "Dale Cooper", avatarUrl: daleCooperImg, title: "DevOps Specialist", managerName: "Elon Musk", hourlyRate: 60, overtimeRate: 90, totalTime: "8h 0m", timeEntries: [], biWeeklyTimesheet: null, monthlyTimesheet: null },
  { id: 6, name: "Audrey Horne", avatarUrl: audreyHorneImg, title: "Project Manager", managerName: "Elon Musk", hourlyRate: 65, overtimeRate: 95, totalTime: "7h 15m", timeEntries: [], biWeeklyTimesheet: null, monthlyTimesheet: null }
];

export const projectsData = [
  { id: "proj-1", name: "Falcon Heavy" }, { id: "proj-2", name: "Starship" },
  { id: "proj-3", name: "Grasshopper" }, { id: "proj-4", name: "Internal" },
  { id: "proj-5", name: "Dragon Capsule" },
];

export const tasksData = [
  { id: "task-1", name: "Development" }, { id: "task-2", name: "Planning" },
  { id: "task-3", name: "Auditing" }, { id: "task-4", name: "Team Meeting" },
  { id: "task-5", name: "UI/UX Mockups" }, { id: "task-6", name: "Backend API Refactor" },
];

export const organizationsData = [
  { id: 'org_timezone', name: "Organization's Timezone" },
  { id: 'member_timezone', name: "Member's Timezone" }
];