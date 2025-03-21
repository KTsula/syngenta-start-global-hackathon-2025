export interface Farmer {
  id: string;
  name: string;
  location: string;
  status: "new" | "reviewing" | "approved" | "rejected" | "pending";
  creditScore: number;
  loanAmount: number;
  applicationDate: string;
  lastActivity: string;
  profileImage?: string;
}

export const farmersList: Farmer[] = [
  {
    id: "F001",
    name: "Rajesh Kumar",
    location: "Andhra Pradesh",
    status: "approved",
    creditScore: 720,
    loanAmount: 250000,
    applicationDate: "2023-08-15",
    lastActivity: "2023-09-05",
  },
  {
    id: "F002",
    name: "Meera Patel",
    location: "Gujarat",
    status: "reviewing",
    creditScore: 680,
    loanAmount: 150000,
    applicationDate: "2023-09-10",
    lastActivity: "2023-09-18",
  },
  {
    id: "F003",
    name: "Arjun Singh",
    location: "Haryana",
    status: "new",
    creditScore: 650,
    loanAmount: 300000,
    applicationDate: "2023-09-20",
    lastActivity: "2023-09-20",
  },
  {
    id: "F004",
    name: "Lakshmi Devi",
    location: "Tamil Nadu",
    status: "rejected",
    creditScore: 580,
    loanAmount: 200000,
    applicationDate: "2023-08-25",
    lastActivity: "2023-09-12",
  },
  {
    id: "F005",
    name: "Sanjay Verma",
    location: "Maharashtra",
    status: "pending",
    creditScore: 700,
    loanAmount: 175000,
    applicationDate: "2023-09-05",
    lastActivity: "2023-09-15",
  },
  {
    id: "F006",
    name: "Ananya Sharma",
    location: "Uttar Pradesh",
    status: "approved",
    creditScore: 730,
    loanAmount: 280000,
    applicationDate: "2023-08-10",
    lastActivity: "2023-09-01",
  },
  {
    id: "F007",
    name: "Rahul Gupta",
    location: "Rajasthan",
    status: "reviewing",
    creditScore: 690,
    loanAmount: 220000,
    applicationDate: "2023-09-12",
    lastActivity: "2023-09-19",
  },
  {
    id: "F008",
    name: "Priya Reddy",
    location: "Andhra Pradesh",
    status: "new",
    creditScore: 640,
    loanAmount: 190000,
    applicationDate: "2023-09-21",
    lastActivity: "2023-09-21",
  },
  {
    id: "F009",
    name: "Vikram Malhotra",
    location: "Madhya Pradesh",
    status: "pending",
    creditScore: 710,
    loanAmount: 320000,
    applicationDate: "2023-09-08",
    lastActivity: "2023-09-16",
  },
  {
    id: "F010",
    name: "Nandini Iyer",
    location: "Karnataka",
    status: "approved",
    creditScore: 750,
    loanAmount: 270000,
    applicationDate: "2023-08-20",
    lastActivity: "2023-09-10",
  },
  {
    id: "F011",
    name: "Kiran Joshi",
    location: "Kerala",
    status: "rejected",
    creditScore: 600,
    loanAmount: 210000,
    applicationDate: "2023-08-30",
    lastActivity: "2023-09-14",
  },
  {
    id: "F012",
    name: "Deepak Choudhary",
    location: "Bihar",
    status: "reviewing",
    creditScore: 670,
    loanAmount: 180000,
    applicationDate: "2023-09-15",
    lastActivity: "2023-09-20",
  },
];
