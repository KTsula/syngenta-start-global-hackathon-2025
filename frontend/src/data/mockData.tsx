// Mock data for the agricultural finance dashboard

export const farmerProfileData = {
  id: "FM-29834",
  name: "Rajesh Kumar",
  location: {
    district: "Eluru",
    village: "Badarala",
    state: "Andhra Pradesh",
  },
  contact: "+91 98765 43210",
  land: {
    size: 2.5, // hectares
    ownership: "Owned", // Owned, Leased, or Mixed
    tenure: 15, // years
  },
  crops: ["Rice", "Pulses"],
  farmingExperience: 12, // years
};

export const historicalPerformanceData = {
  yieldHistory: [
    { year: 2019, yieldTonsPerHa: 5.8, target: 5.5 },
    { year: 2020, yieldTonsPerHa: 5.2, target: 5.5 },
    { year: 2021, yieldTonsPerHa: 6.1, target: 5.5 },
    { year: 2022, yieldTonsPerHa: 5.7, target: 5.5 },
    { year: 2023, yieldTonsPerHa: 6.3, target: 5.5 },
  ],
  loanRepaymentHistory: [
    {
      year: 2019,
      amount: 50000,
      onTime: true,
      institution: "State Bank of India",
    },
    {
      year: 2020,
      amount: 65000,
      onTime: true,
      institution: "State Bank of India",
    },
    {
      year: 2021,
      amount: 75000,
      onTime: true,
      institution: "State Bank of India",
    },
    { year: 2022, amount: 70000, onTime: true, institution: "NABARD" },
    { year: 2023, amount: 80000, onTime: true, institution: "NABARD" },
  ],
  incomeHistory: [
    { year: 2019, farming: 120000, nonFarming: 35000 },
    { year: 2020, farming: 110000, nonFarming: 40000 },
    { year: 2021, farming: 135000, nonFarming: 45000 },
    { year: 2022, farming: 125000, nonFarming: 40000 },
    { year: 2023, farming: 150000, nonFarming: 45000 },
  ],
};

export const currentSeasonData = {
  cropDetails: {
    type: "Rice",
    variety: "BPT-5204 (Samba Mahsuri)",
    dateOfSowing: "2023-06-15",
    expectedHarvest: "2023-10-20",
    growthStage: "Heading", // Sowing, Vegetative, Tillering, Heading, Harvesting
    healthScore: 85, // 0-100
    daysToHarvest: 42,
  },
  fieldConditions: {
    soilMoisture: 72, // percentage
    recentRainfall: 25, // mm in last 7 days
    temperature: {
      current: 28, // celsius
      deviation: -1, // from normal
    },
  },
  issues: [
    {
      type: "Minor",
      description: "Slight nitrogen deficiency detected",
      recommendation: "Apply additional urea (10kg/acre)",
    },
  ],
};

export const riskAssessmentData = {
  weatherForecast: {
    next7Days: [
      { day: "Mon", rainfall: 0, temperature: 32 },
      { day: "Tue", rainfall: 5, temperature: 30 },
      { day: "Wed", rainfall: 10, temperature: 29 },
      { day: "Thu", rainfall: 2, temperature: 31 },
      { day: "Fri", rainfall: 0, temperature: 32 },
      { day: "Sat", rainfall: 0, temperature: 33 },
      { day: "Sun", rainfall: 0, temperature: 32 },
    ],
    warnings: [],
  },
  irrigationSource: {
    primary: "Canal",
    secondary: "Groundwater",
    reliability: 85, // percentage
  },
  soilQuality: {
    type: "Clay Loam",
    ph: 6.8,
    organicMatter: "Medium",
    nutrientStatus: "Good",
    issues: [],
  },
  insuranceCoverage: {
    policy: "Pradhan Mantri Fasal Bima Yojana",
    premium: 3500,
    coverageAmount: 110000,
    claimHistory: [],
  },
  overallRiskScore: 22, // 0-100, lower is better
};

export const financialProjectionsData = {
  projectedYield: 6.2, // tons per hectare
  marketValue: 22000, // per ton
  productionCosts: [
    { item: "Seeds", amount: 8500 },
    { item: "Fertilizers", amount: 12000 },
    { item: "Pesticides", amount: 5500 },
    { item: "Labor", amount: 25000 },
    { item: "Irrigation", amount: 7500 },
    { item: "Equipment", amount: 3500 },
  ],
  profitMargins: {
    totalRevenue: 136400, // Total revenue from harvest
    totalCosts: 62000, // Sum of all production costs
    netProfit: 74400, // Revenue - Costs
    profitPerHectare: 29760, // Net profit / land size
    profitMarginPercentage: 54.5, // (Net profit / Revenue) * 100
  },
  loanAnalysis: {
    requestedAmount: 50000,
    loanToValueRatio: 0.37, // Loan amount / Expected harvest value
    collateralValue: 800000, // Land value serving as collateral
    recommendedMaxLoan: 68000,
  },
};

export const marketIndicatorsData = {
  prices: [
    { month: "Jan", price: 19500 },
    { month: "Feb", price: 19800 },
    { month: "Mar", price: 20000 },
    { month: "Apr", price: 20500 },
    { month: "May", price: 21000 },
    { month: "Jun", price: 21500 },
    { month: "Jul", price: 22000 },
    { month: "Aug", price: 22000 },
    { month: "Sep", price: 21800 },
    { month: "Oct", price: 21500 },
    { month: "Nov", price: 21200 },
    { month: "Dec", price: 20800 },
  ],
  minimumSupportPrice: 20400, // per ton
  policyChanges: [
    {
      type: "Positive",
      description: "New fertilizer subsidy announced",
      impact: "Reduces production costs by approximately 8%",
    },
  ],
  procurementInfo: {
    procurementCenter: "Mangalagiri Mandi",
    distance: 12, // km
    active: true,
  },
};

export const creditScoringData = {
  overallScore: 82, // 0-100
  recommendation: "Approve", // Approve, Reject, Additional Review
  components: [
    { name: "Repayment History", score: 92, weight: 0.25 },
    { name: "Current Crop Health", score: 85, weight: 0.2 },
    { name: "Financial Projections", score: 88, weight: 0.2 },
    { name: "Risk Assessment", score: 78, weight: 0.15 },
    { name: "Farm Profile", score: 90, weight: 0.1 },
    { name: "Market Outlook", score: 80, weight: 0.1 },
  ],
  qualitativeFlags: [],
};
