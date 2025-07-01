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
      totalHours: "105 h 5 m",
      week1: { total: "52 h 36 m", days: [ { date: "Jul 1", hours: "8 h 15 m" }, { date: "Jul 2", hours: "8 h 25 m" }, { date: "Jul 3", hours: "9 h 0 m" }, { date: "Jul 4", hours: "7 h 42 m" }, { date: "Jul 5", hours: "8 h 25 m" }, { date: "Jul 6", hours: "10 h 49 m" }, { date: "Jul 7", hours: "-" } ] },
      week2: { total: "52 h 29 m", days: [ { date: "Jul 8", hours: "9 h 0 m" }, { date: "Jul 9", hours: "10 h 24 m" }, { date: "Jul 10", hours: "8 h 15 m" }, { date: "Jul 11", hours: "8 h 25 m" }, { date: "Jul 12", hours: "8 h 25 m" }, { date: "Jul 13", hours: "8 h 0 m" }, { date: "Jul 14", hours: "-" } ] },
    },
    monthlyTimesheet: {
      "2025-07-01": "8h 15m", "2025-07-02": "8h 25m", "2025-07-03": "9h 0m", "2025-07-04": "7h 42m", "2025-07-05": "8h 25m",
      "2025-07-07": "7h 42m", "2025-07-08": "9h 0m", "2025-07-09": "10h 24m", "2025-07-10": "8h 15m", "2025-07-11": "8h 25m",
      "2025-07-14": "7h 42m", "2025-07-15": "8h 25m", "2025-07-16": "9h 0m", "2025-07-17": "8h 15m", "2025-07-18": "10h 24m",
      "2025-07-21": "7h 42m", "2025-07-22": "8h 25m", "2025-07-23": "9h 0m", "2025-07-24": "8h 15m", "2025-07-25": "10h 24m",
      "2025-07-28": "7h 42m", "2025-07-29": "8h 25m", "2025-07-30": "9h 0m", "2025-07-31": "8h 15m",
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
      week1: { total: "40 h 0 m", days: [ { date: "Jul 1", hours: "8 h 0 m" }, { date: "Jul 2", hours: "8 h 0 m" }, { date: "Jul 3", hours: "8 h 0 m" }, { date: "Jul 4", hours: "8 h 0 m" }, { date: "Jul 5", hours: "8 h 0 m" }, { date: "Jul 6", hours: "-" }, { date: "Jul 7", hours: "-" } ] },
      week2: { total: "40 h 0 m", days: [ { date: "Jul 8", hours: "8 h 0 m" }, { date: "Jul 9", hours: "8 h 0 m" }, { date: "Jul 10", hours: "8 h 0 m" }, { date: "Jul 11", hours: "8 h 0 m" }, { date: "Jul 12", hours: "8 h 0 m" }, { date: "Jul 13", hours: "-" }, { date: "Jul 14", hours: "-" } ] },
    },
    monthlyTimesheet: {
        "2025-07-01": "8h 0m", "2025-07-02": "8h 0m", "2025-07-03": "8h 0m", "2025-07-04": "8h 0m", "2025-07-07": "8h 0m",
        "2025-07-08": "8h 0m", "2025-07-09": "8h 0m", "2025-07-10": "8h 0m", "2025-07-11": "8h 0m", "2025-07-14": "8h 0m",
        "2025-07-15": "8h 0m", "2025-07-16": "8h 0m", "2025-07-17": "8h 0m", "2025-07-18": "8h 0m", "2025-07-21": "8h 0m",
        "2025-07-22": "8h 0m", "2025-07-23": "8h 0m", "2025-07-24": "8h 0m", "2025-07-25": "8h 0m", "2025-07-28": "8h 0m",
        "2025-07-29": "8h 0m", "2025-07-30": "8h 0m", "2025-07-31": "8h 0m",
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
    biWeeklyTimesheet: {
        totalHours: "90 h 45 m",
        week1: { total: "45 h 30 m", days: [ { date: "Jul 1", hours: "9 h 15m" }, { date: "Jul 2", hours: "9h 0m" }, { date: "Jul 3", hours: "8h 45m" }, { date: "Jul 4", hours: "9h 30m" }, { date: "Jul 5", hours: "8h 0m" }, { date: "Jul 6", hours: "-" }, { date: "Jul 7", hours: "-" } ] },
        week2: { total: "45 h 15 m", days: [ { date: "Jul 8", hours: "9h 0m" }, { date: "Jul 9", hours: "9h 0m" }, { date: "Jul 10", hours: "9h 0m" }, { date: "Jul 11", hours: "9h 15m" }, { date: "Jul 12", hours: "9h 0m" }, { date: "Jul 13", hours: "-" }, { date: "Jul 14", hours: "-" } ] },
    },
    monthlyTimesheet: {
        "2025-07-01": "9h 15m", "2025-07-02": "9h 0m", "2025-07-03": "8h 45m", "2025-07-04": "9h 30m", "2025-07-07": "9h 0m",
        "2025-07-08": "9h 0m", "2025-07-09": "9h 0m", "2025-07-10": "9h 0m", "2025-07-11": "9h 15m", "2025-07-14": "8h 45m",
        "2025-07-15": "9h 0m", "2025-07-16": "9h 30m", "2025-07-17": "9h 0m", "2025-07-18": "9h 0m", "2025-07-21": "9h 15m",
        "2025-07-22": "8h 45m", "2025-07-23": "9h 0m", "2025-07-24": "9h 30m", "2025-07-25": "9h 0m", "2025-07-28": "9h 0m",
        "2025-07-29": "9h 15m", "2025-07-30": "8h 45m", "2025-07-31": "9h 0m",
    }
  },
  { 
    id: 4, 
    name: "Laura Palmer", 
    avatarUrl: lauraPalmerImg, 
    title: "QA Engineer", 
    managerName: "Elon Musk", 
    hourlyRate: 40, 
    overtimeRate: 60, 
    totalTime: "7h 30m", 
    timeEntries: [], 
    biWeeklyTimesheet: {
        totalHours: "75 h 0 m",
        week1: { total: "37 h 30 m", days: [ { date: "Jul 1", hours: "7h 30m" }, { date: "Jul 2", hours: "7h 30m" }, { date: "Jul 3", hours: "7h 30m" }, { date: "Jul 4", hours: "7h 30m" }, { date: "Jul 5", hours: "7h 30m" }, { date: "Jul 6", hours: "-" }, { date: "Jul 7", hours: "-" } ] },
        week2: { total: "37 h 30 m", days: [ { date: "Jul 8", hours: "7h 30m" }, { date: "Jul 9", hours: "7h 30m" }, { date: "Jul 10", hours: "7h 30m" }, { date: "Jul 11", hours: "7h 30m" }, { date: "Jul 12", hours: "7h 30m" }, { date: "Jul 13", hours: "-" }, { date: "Jul 14", hours: "-" } ] },
    },
    monthlyTimesheet: {
        "2025-07-01": "7h 30m", "2025-07-02": "7h 30m", "2025-07-03": "7h 30m", "2025-07-04": "7h 30m", "2025-07-07": "7h 30m",
        "2025-07-08": "7h 30m", "2025-07-09": "7h 30m", "2025-07-10": "7h 30m", "2025-07-11": "7h 30m", "2025-07-14": "7h 30m",
        "2025-07-15": "7h 30m", "2025-07-16": "7h 30m", "2025-07-17": "7h 30m", "2025-07-18": "7h 30m", "2025-07-21": "7h 30m",
        "2025-07-22": "7h 30m", "2025-07-23": "7h 30m", "2025-07-24": "7h 30m", "2025-07-25": "7h 30m", "2025-07-28": "7h 30m",
        "2025-07-29": "7h 30m", "2025-07-30": "7h 30m", "2025-07-31": "7h 30m",
    }
  },
  { 
    id: 5, 
    name: "Dale Cooper", 
    avatarUrl: daleCooperImg, 
    title: "DevOps Specialist", 
    managerName: "Elon Musk", 
    hourlyRate: 60, 
    overtimeRate: 90, 
    totalTime: "8h 0m", 
    timeEntries: [], 
    biWeeklyTimesheet: null, 
    monthlyTimesheet: {} 
  },
  { 
    id: 6, 
    name: "Audrey Horne", 
    avatarUrl: audreyHorneImg, 
    title: "Project Manager", 
    managerName: "Elon Musk", 
    hourlyRate: 65, 
    overtimeRate: 95, 
    totalTime: "7h 15m", 
    timeEntries: [], 
    biWeeklyTimesheet: null, 
    monthlyTimesheet: {} 
  }
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