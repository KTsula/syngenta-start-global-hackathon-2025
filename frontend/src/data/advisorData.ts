// Mock data for the financial advisor dashboard

export const loanRequestsData = {
  totalRequests: 32,
  pendingRequests: 12,
  approvedRequests: 16,
  rejectedRequests: 4,
  recentRequests: [
    {
      id: "LR-4392",
      farmerName: "Rajesh Kumar",
      amount: 50000,
      date: "2023-09-10",
      status: "pending",
      creditScore: 82,
    },
    {
      id: "LR-4391",
      farmerName: "Arjun Singh",
      amount: 75000,
      date: "2023-09-09",
      status: "approved",
      creditScore: 88,
    },
    {
      id: "LR-4390",
      farmerName: "Priya Patel",
      amount: 35000,
      date: "2023-09-08",
      status: "rejected",
      creditScore: 56,
    },
    {
      id: "LR-4389",
      farmerName: "Deepak Verma",
      amount: 60000,
      date: "2023-09-07",
      status: "approved",
      creditScore: 79,
    },
    {
      id: "LR-4388",
      farmerName: "Sunita Rao",
      amount: 45000,
      date: "2023-09-06",
      status: "pending",
      creditScore: 73,
    },
  ],
};

export const advisorPerformanceData = {
  processedLastMonth: 28,
  approvalRate: 72, // percentage
  averageProcessingTime: 3.2, // days
  monthlyComparison: [
    { month: "Apr", requests: 18 },
    { month: "May", requests: 22 },
    { month: "Jun", requests: 19 },
    { month: "Jul", requests: 24 },
    { month: "Aug", requests: 28 },
    { month: "Sep", requests: 16 },
  ],
};

export const riskMonitoringData = {
  farmersAtRisk: [
    {
      id: "FM-29834",
      name: "Rajesh Kumar",
      village: "Bandarala",
      district: "Eluru",
      riskScore: 62,
      riskFactors: [
        "Weather alert: Heavy rainfall forecast",
        "Moderate pest infestation reported",
      ],
      loanAmount: 50000,
      recommendedAction:
        "Contact local extension agent to verify crop condition",
    },
    {
      id: "FM-28456",
      name: "Deepak Verma",
      village: "Palanpur",
      district: "Banaskantha",
      riskScore: 78,
      riskFactors: [
        "Irrigation water shortage reported",
        "Previous loan repayment delayed by 15 days",
      ],
      loanAmount: 60000,
      recommendedAction: "Schedule call to discuss irrigation alternatives",
    },
    {
      id: "FM-30121",
      name: "Lakshmi Devi",
      village: "Bellandur",
      district: "Bangalore Rural",
      riskScore: 81,
      riskFactors: [
        "Market price dropped by 12% this month",
        "Two consecutive lower-than-average yields",
      ],
      loanAmount: 40000,
      recommendedAction: "Review repayment schedule flexibility",
    },
  ],
  riskTrends: {
    weatherRelated: 42, // percentage
    marketRelated: 28, // percentage
    cropDisease: 18, // percentage
    other: 12, // percentage
  },
};

export const recentActivitiesData = [
  {
    id: "ACT-001",
    timestamp: "2023-09-10T10:23:45",
    type: "Loan Approval",
    description: "Approved loan request LR-4391 for Arjun Singh",
  },
  {
    id: "ACT-002",
    timestamp: "2023-09-10T09:15:12",
    type: "Risk Alert",
    description:
      "Added Rajesh Kumar to risk monitoring due to weather forecast",
  },
  {
    id: "ACT-003",
    timestamp: "2023-09-09T16:42:33",
    type: "Loan Rejection",
    description:
      "Rejected loan request LR-4390 for Priya Patel due to low credit score",
  },
  {
    id: "ACT-004",
    timestamp: "2023-09-09T14:10:27",
    type: "Farmer Contact",
    description:
      "Scheduled follow-up call with Deepak Verma for irrigation consultation",
  },
  {
    id: "ACT-005",
    timestamp: "2023-09-08T11:38:54",
    type: "Document Verification",
    description: "Verified land ownership documents for Sunita Rao",
  },
];
