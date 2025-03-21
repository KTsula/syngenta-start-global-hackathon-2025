import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const translations = {
  en: {
    // Common
    profile_complete: "Profile Complete",
    back_to_farmers: "Back to Farmers",
    farmer_details: "Farmer Details",
    last_updated: "Last updated",

    // Farmer Profile
    farmer_profile: "Farmer Profile",
    full_name: "Full Name",
    contact: "Contact",
    address: "Address",
    land_size: "Land Size",
    land_ownership: "Land Ownership",
    crops_grown: "Crops Grown",
    farming_experience: "Farming Experience",
    years: "years",
    hectares: "hectares",

    // Units & Measurements
    id: "ID",

    // Dashboard
    dashboard: "Dashboard",
    farmers: "Farmers",
    loan_applications: "Loan Applications",
    farm_profiles: "Farm Profiles",
    season_status: "Season Status",
    risk_analysis: "Risk Analysis",
    financial_projections: "Financial Projections",
    analytics: "Analytics",
    market_data: "Market Data",
    credit_scoring: "Credit Scoring",
    disbursements: "Disbursements",
    settings: "Settings",

    // Page Titles
    credit_assessment_dashboard: "Credit Assessment Dashboard",
    farmers_management: "Farmers Management",
    view_manage_farmers: "View and manage farmer profiles",
    farmer_applications: "Farmer Applications",
    view_manage_applications: "View and manage farmer loan applications",
    financial_advisor_dashboard: "Financial Advisor Dashboard",
    monitor_loan_requests: "Monitor loan requests and risk exposure",

    // Sidebar Groups
    overview: "Overview",
    assessment: "Assessment",
    reports: "Reports",

    // NotFound Page
    not_found: "Oops! Page not found",

    // Risk Assessment
    risk_assessment: "Risk Assessment",
    low_risk: "Low Risk",
    overall_risk_score: "Overall Risk Score",
    lower_risk_note: "Lower score indicates lower risk exposure",
    "7_day_weather": "7-Day Weather Forecast",
    no_weather_warnings: "No weather warnings",
    irrigation: "Irrigation",
    primary_source: "Primary Source",
    reliability: "Reliability",
    soil_quality: "Soil Quality",
    type: "Type",
    ph: "pH",
    organic_matter: "Organic Matter",
    nutrient_status: "Nutrient Status",
    insurance_coverage: "Insurance Coverage",
    policy: "Policy",
    premium: "Premium",
    coverage: "Coverage",
    previous_claims: "Previous claims",
    no_previous_claims: "No previous claims",

    // Credit Scoring
    credit_score: "Credit Score",
    score_components: "Score Components",
    risk_flags: "Risk Flags",
    recommendation: "Recommendation",
    approve: "Approve",
    reject: "Reject",
    review_needed: "Review Needed",
    approve_message:
      "Strong credit profile with consistent repayment history and stable farm operations.",
    reject_message:
      "Credit application does not meet minimum requirements. See risk flags for details.",
    review_message:
      "The application requires additional verification or documentation before a decision.",

    // Season Status
    current_season_status: "Current Season Status",
    on_schedule: "On Schedule",
    stage: "Stage",
    sowing: "Sowing",
    days_to_harvest: "days to harvest",
    harvest: "Harvest",
    crop_health: "Crop Health",
    soil_moisture: "Soil Moisture",
    field_conditions: "Field Conditions",
    recent_rainfall: "Recent Rainfall",
    last_7_days: "Last 7 days",
    temperature: "Temperature",
    from_normal: "from normal",
    issues_recommendations: "Issues & Recommendations",
    minor: "Minor",
    major: "Major",
    issue: "Issue",

    // Requests Summary
    total_requests: "Total Requests",
    loan_applications_received: "Loan applications received",
    pending_review: "Pending Review",
    awaiting_assessment: "Awaiting your assessment",
    approved: "Approved",
    approval_rate: "approval rate",
    rejected: "Rejected",
    rejection_rate: "rejection rate",
    recent_loan_requests: "Recent Loan Requests",
    review_process_applications: "Review and process the latest applications",
    score: "Score",

    // Risk Monitoring
    farmers_at_risk: "Farmers at Risk",
    requiring_attention: "Farmers requiring immediate attention",
    risk_score: "Risk Score",
    risk_breakdown: "Risk Breakdown",
    contributing_factors: "Contributing factors to current risks",
    weather_related_risks:
      "Weather-related risks are the most significant contributors this season",

    // Recent Activities
    recent_activities: "Recent Activities",
    latest_actions: "Your latest actions and notifications",
    loan_approval: "Loan Approval",
    loan_rejection: "Loan Rejection",
    risk_alert: "Risk Alert",
    document_verification: "Document Verification",

    // Loan Applications Page
    search_loan_applications: "Search loan applications...",
    search_dashboard: "Search dashboard...",
    search_placeholder: "Search...",
    all: "All",
    pending: "Pending",
    farmer_name: "Farmer Name",
    loan_amount: "Loan Amount",
    status: "Status",
    applied: "Applied",
    actions: "Actions",
    no_applications_found: "No applications found",
    application_approved: "Application Approved",
    application_rejected: "Application Rejected",
    more_info_requested: "More Information Requested",
    loan_application: "Loan Application",
    submitted: "Submitted on",
    details: "Details",
    documents: "Documents",
    history: "History",
    applicant_information: "Applicant Information",
    farm_details: "Farm Details",
    loan_information: "Loan Information",
    credit_information: "Credit Information",
    loan_type: "Loan Type",
    requested_amount: "Requested Amount",
    purpose: "Purpose",
    repayment_term: "Repayment Term",
    months: "months",
    previous_loans: "Previous Loans",
    all_repaid: "all repaid",
    owned: "Owned",
    crop_loan: "Crop Loan",
    seeds_fertilizers_equipment: "Seeds, Fertilizers & Equipment",
    document: "Document",
    identity_proof: "Identity Proof",
    aadhaar_card: "Aadhaar Card",
    bank_statements: "Bank Statements",
    statement: "Statement",
    application_submitted: "Application Submitted",
    documents_reviewed: "Documents Reviewed",
    credit_assessment_completed: "Credit Assessment Completed",
    close: "Close",

    // Map and NDVI related
    ndvi_legend: "NDVI Legend",
    healthy_vegetation: "Healthy Vegetation",
    moderate_vegetation: "Moderate Vegetation",
    sparse_vegetation: "Sparse Vegetation",
    low: "Low",
    high: "High",
    very_high: "Very High",
    layer_opacity: "Layer Opacity",
    unable_to_load_map:
      "Unable to load map. Please check your internet connection.",
    no_field_data_available: "No field data available for this farm",
    google_maps_api_key_missing: "Google Maps API key is missing",
    failed_to_load_google_maps: "Failed to load Google Maps API",
    map_initialization_error: "Failed to load map. Please try again later.",
    voronoi_error: "Failed to create Voronoi diagram. Please try again later.",
    map_initialized_successfully: "Map initialized successfully",
    creating_voronoi: "Creating Voronoi diagram with",
    points: "points",
    clustered_points: "clustered points from",
    original_points: "original points",
    created: "Created",

    // Farmer Dashboard
    farmer_dashboard: "Farmer Dashboard",
    last_updated_today: "Last updated: Today, 10:45 AM",
    loading_dashboard_data: "Loading dashboard data...",
    error_loading_dashboard: "Error loading dashboard data",

    // Risk Factors
    crop_risk_factors_detected: "Crop Risk Factors Detected",
    current_crop_risk_factors:
      "Current crop has {0} risk factors that need attention.",
    loan_default_alert: "Loan Default Alert",
    loan_default_message:
      "One or more loans are in default status. Immediate action required.",
    weather_alert_rainfall: "Weather alert: Heavy rainfall forecast",
    moderate_pest_infestation: "Moderate pest infestation reported",
    irrigation_water_shortage: "Irrigation water shortage reported",
    loan_repayment_delayed: "Previous loan repayment delayed by 15 days",
    market_price_dropped: "Market price dropped by 12% this month",
    lower_than_average_yields: "Two consecutive lower-than-average yields",

    // Recommended Actions
    contact_extension_agent:
      "Contact local extension agent to verify crop condition",
    schedule_irrigation_call:
      "Schedule call to discuss irrigation alternatives",
    review_repayment_schedule: "Review repayment schedule flexibility",

    // Activity Descriptions
    approved_loan_request: "Approved loan request {0} for {1}",
    added_to_risk_monitoring:
      "Added {0} to risk monitoring due to weather forecast",
    rejected_loan_request:
      "Rejected loan request {0} for {1} due to low credit score",
    scheduled_followup_call:
      "Scheduled follow-up call with {0} for irrigation consultation",
    verified_documents: "Verified land ownership documents for {0}",

    // Metrics
    total_land_size: "Total Land Size",
    current_crop_ndvi: "Current Crop NDVI",
    normalized_difference_vegetation_index:
      "Normalized Difference Vegetation Index",
    repayment_rate: "Repayment Rate",

    // Risk & Analysis
    risk_loan_analysis: "Risk & Loan Analysis",

    // Farmer Contact
    farmer_contact: "Farmer Contact",

    // Weather Related
    weather: "Weather",
    market: "Market",
    disease: "Disease",
    other: "Other",

    // Loan Types
    pending_approval: "Pending Approval",
    pending_final_approval: "Pending Final Approval",
    review_changes_before_final_approval:
      "Review changes before final approval",
    advisor_notes: "Advisor Notes",
    add_notes_for_approval: "Add notes for approval",
    changes_saved: "Changes Saved",
    loan_amount_updated: "Loan amount updated",
    edit: "Edit",
    save: "Save",
    na: "N/A",
    agrifinance: "AgriFinance",
    farmer_id: "Farmer ID",
    name: "Name",
    location: "Location",

    // Financial Projections
    profitable: "Profitable",
    projected_yield: "Projected Yield",
    expected_this_season: "Expected this season",
    market_value: "Market Value",
    production_costs_breakdown: "Production Costs Breakdown",
    seeds: "Seeds",
    fertilizers: "Fertilizers",
    pesticides: "Pesticides",
    labor: "Labor",
    machinery: "Machinery",
    profit_margins: "Profit Margins",
    revenue: "Revenue",
    net_profit: "Net Profit",
    profit_margin: "Profit Margin",
    loan_analysis: "Loan Analysis",
    loan_to_value_ratio: "Loan-to-Value Ratio",
    recommended_max_loan: "Recommended Max Loan",
    collateral_value: "Collateral Value",

    // Market Indicators translations
    market_indicators: "Market Indicators",
    favorable: "Favorable",
    unfavorable: "Unfavorable",
    rice_price_trends: "Rice Price Trends",
    per_ton: "per ton",
    loading_price_data: "Loading price data",
    price: "Price",
    current_market_price: "Current Market Price",
    policy_changes: "Policy Changes",
    no_major_policy_changes: "No major policy changes recently",
    procurement_infrastructure: "Procurement Infrastructure",
    mandi: "Mandi",
    distance: "Distance",
    active: "Active",
    inactive: "Inactive",
    positive: "Positive",
    negative: "Negative",
    neutral: "Neutral",
  },
  hi: {
    // Common
    profile_complete: "प्रोफ़ाइल पूर्ण",
    back_to_farmers: "किसानों पर वापस जाएँ",
    farmer_details: "किसान विवरण",
    last_updated: "आखिरी अपडेट",

    // Farmer Profile
    farmer_profile: "किसान प्रोफ़ाइल",
    full_name: "पूरा नाम",
    contact: "संपर्क",
    address: "पता",
    land_size: "भूमि का आकार",
    land_ownership: "भूमि स्वामित्व",
    crops_grown: "उगाई गई फसलें",
    farming_experience: "कृषि अनुभव",
    years: "वर्ष",
    hectares: "हेक्टेयर",

    // Units & Measurements
    id: "आईडी",

    // Dashboard
    dashboard: "डैशबोर्ड",
    farmers: "किसान",
    loan_applications: "ऋण आवेदन",
    farm_profiles: "कृषि प्रोफाइल",
    season_status: "मौसम स्थिति",
    risk_analysis: "जोखिम विश्लेषण",
    financial_projections: "वित्तीय अनुमान",
    analytics: "विश्लेषिकी",
    market_data: "बाजार डेटा",
    credit_scoring: "क्रेडिट स्कोरिंग",
    disbursements: "वितरण",
    settings: "सेटिंग्स",

    // Page Titles
    credit_assessment_dashboard: "क्रेडिट मूल्यांकन डैशबोर्ड",
    farmers_management: "किसान प्रबंधन",
    view_manage_farmers: "किसान प्रोफाइल देखें और प्रबंधित करें",
    farmer_applications: "किसान आवेदन",
    view_manage_applications: "किसान ऋण आवेदन देखें और प्रबंधित करें",
    financial_advisor_dashboard: "वित्तीय सलाहकार डैशबोर्ड",
    monitor_loan_requests: "ऋण अनुरोधों और जोखिम की निगरानी करें",

    // Sidebar Groups
    overview: "अवलोकन",
    assessment: "मूल्यांकन",
    reports: "रिपोर्ट",

    // NotFound Page
    not_found: "उफ़! पृष्ठ नहीं मिला",

    // Risk Assessment
    risk_assessment: "जोखिम मूल्यांकन",
    low_risk: "कम जोखिम",
    overall_risk_score: "समग्र जोखिम स्कोर",
    lower_risk_note: "कम स्कोर कम जोखिम का संकेत देता है",
    "7_day_weather": "7-दिन का मौसम पूर्वानुमान",
    no_weather_warnings: "कोई मौसम चेतावनी नहीं",
    irrigation: "सिंचाई",
    primary_source: "प्राथमिक स्रोत",
    reliability: "विश्वसनीयता",
    soil_quality: "मिट्टी की गुणवत्ता",
    type: "प्रकार",
    ph: "पीएच",
    organic_matter: "जैविक पदार्थ",
    nutrient_status: "पोषक तत्व स्थिति",
    insurance_coverage: "बीमा कवरेज",
    policy: "पॉलिसी",
    premium: "प्रीमियम",
    coverage: "कवरेज",
    previous_claims: "पिछले दावे",
    no_previous_claims: "कोई पिछला दावा नहीं",

    // Credit Scoring
    credit_score: "क्रेडिट स्कोर",
    score_components: "स्कोर घटक",
    risk_flags: "जोखिम संकेत",
    recommendation: "अनुशंसा",
    approve: "स्वीकृत",
    reject: "अस्वीकृत",
    review_needed: "समीक्षा आवश्यक",
    approve_message:
      "लगातार पुनर्भुगतान इतिहास और स्थिर कृषि संचालन के साथ मजबूत क्रेडिट प्रोफाइल।",
    reject_message:
      "क्रेडिट आवेदन न्यूनतम आवश्यकताओं को पूरा नहीं करता है। विवरण के लिए जोखिम संकेत देखें।",
    review_message:
      "आवेदन को निर्णय लेने से पहले अतिरिक्त सत्यापन या दस्तावेज़ीकरण की आवश्यकता है।",

    // Season Status
    current_season_status: "वर्तमान मौसम की स्थिति",
    on_schedule: "समय पर",
    stage: "चरण",
    sowing: "बुवाई",
    days_to_harvest: "कटाई तक दिन",
    harvest: "कटाई",
    crop_health: "फसल स्वास्थ्य",
    soil_moisture: "मिट्टी की नमी",
    field_conditions: "खेत की स्थिति",
    recent_rainfall: "हाल की बारिश",
    last_7_days: "पिछले 7 दिन",
    temperature: "तापमान",
    from_normal: "सामान्य से",
    issues_recommendations: "समस्याएं और सिफारिशें",
    minor: "छोटी",
    major: "बड़ी",
    issue: "समस्या",

    // Requests Summary
    total_requests: "कुल अनुरोध",
    loan_applications_received: "प्राप्त ऋण आवेदन",
    pending_review: "समीक्षा के लिए लंबित",
    awaiting_assessment: "आपके मूल्यांकन की प्रतीक्षा में",
    approved: "स्वीकृत",
    approval_rate: "स्वीकृति दर",
    rejected: "अस्वीकृत",
    rejection_rate: "अस्वीकृति दर",
    recent_loan_requests: "हाल के ऋण अनुरोध",
    review_process_applications: "नवीनतम आवेदनों की समीक्षा और प्रक्रिया करें",
    score: "स्कोर",

    // Risk Monitoring
    farmers_at_risk: "जोखिम में किसान",
    requiring_attention: "तत्काल ध्यान देने की आवश्यकता वाले किसान",
    risk_score: "जोखिम स्कोर",
    risk_breakdown: "जोखिम विभाजन",
    contributing_factors: "वर्तमान जोखिमों के योगदान कारक",
    weather_related_risks:
      "इस मौसम में मौसम संबंधित जोखिम सबसे महत्वपूर्ण योगदानकर्ता हैं",

    // Recent Activities
    recent_activities: "हाल की गतिविधियाँ",
    latest_actions: "आपकी नवीनतम कार्रवाइयाँ और सूचनाएँ",
    loan_approval: "ऋण स्वीकृति",
    loan_rejection: "ऋण अस्वीकृति",
    risk_alert: "जोखिम अलर्ट",
    document_verification: "दस्तावेज़ सत्यापन",

    // Loan Applications Page
    search_loan_applications: "ऋण आवेदन खोजें...",
    search_dashboard: "डैशबोर्ड खोजें...",
    search_placeholder: "खोजें...",
    all: "सभी",
    pending: "लंबित",
    farmer_name: "किसान का नाम",
    loan_amount: "ऋण राशि",
    status: "स्थिति",
    applied: "आवेदन किया",
    actions: "कार्रवाई",
    no_applications_found: "कोई आवेदन नहीं मिला",
    application_approved: "आवेदन स्वीकृत",
    application_rejected: "आवेदन अस्वीकृत",
    more_info_requested: "अधिक जानकारी का अनुरोध",
    loan_application: "ऋण आवेदन",
    submitted: "जमा किया गया",
    details: "विवरण",
    documents: "दस्तावेज़",
    history: "इतिहास",
    applicant_information: "आवेदक की जानकारी",
    farm_details: "खेत का विवरण",
    loan_information: "ऋण जानकारी",
    credit_information: "क्रेडिट जानकारी",
    loan_type: "ऋण प्रकार",
    requested_amount: "अनुरोधित राशि",
    purpose: "उद्देश्य",
    repayment_term: "चुकौती अवधि",
    months: "महीने",
    previous_loans: "पिछले ऋण",
    all_repaid: "सभी चुकाए गए",
    owned: "स्वामित्व",
    crop_loan: "फसल ऋण",
    seeds_fertilizers_equipment: "बीज, उर्वरक और उपकरण",
    document: "दस्तावेज़",
    identity_proof: "पहचान प्रमाण",
    aadhaar_card: "आधार कार्ड",
    bank_statements: "बैंक स्टेटमेंट",
    statement: "स्टेटमेंट",
    application_submitted: "आवेदन जमा किया गया",
    documents_reviewed: "दस्तावेज़ समीक्षित",
    credit_assessment_completed: "क्रेडिट मूल्यांकन पूर्ण",
    close: "बंद करें",

    // Map and NDVI related
    ndvi_legend: "एनडीवीआई विवरण",
    healthy_vegetation: "स्वस्थ वनस्पति",
    moderate_vegetation: "मध्यम वनस्पति",
    sparse_vegetation: "कम वनस्पति",
    low: "निम्न",
    high: "उच्च",
    very_high: "बहुत उच्च",
    layer_opacity: "परत पारदर्शिता",
    unable_to_load_map:
      "मानचित्र लोड करने में असमर्थ। कृपया अपने इंटरनेट कनेक्शन की जांच करें।",
    no_field_data_available: "इस खेत के लिए कोई क्षेत्र डेटा उपलब्ध नहीं है",
    google_maps_api_key_missing: "Google मानचित्र API की कुंजी अनुपलब्ध है",
    failed_to_load_google_maps: "Google मानचित्र API लोड करने में विफल",
    map_initialization_error:
      "मानचित्र लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",
    voronoi_error:
      "वोरोनोई आरेख बनाने में विफल। कृपया बाद में पुनः प्रयास करें।",
    map_initialized_successfully: "मानचित्र सफलतापूर्वक प्रारंभ किया गया",
    creating_voronoi: "वोरोनोई आरेख बना रहा है",
    points: "बिंदु",
    clustered_points: "क्लस्टर्ड बिंदु से",
    original_points: "मूल बिंदु",
    created: "बनाया गया",

    // Farmer Dashboard
    farmer_dashboard: "किसान डैशबोर्ड",
    last_updated_today: "आखरी अपडेट: आज, 10:45 पूर्वाह्न",
    loading_dashboard_data: "डैशबोर्ड डेटा लोड हो रहा है...",
    error_loading_dashboard: "डैशबोर्ड डेटा लोड करने में त्रुटि",

    // Risk Factors
    crop_risk_factors_detected: "फसल जोखिम कारकों का पता चला",
    current_crop_risk_factors:
      "वर्तमान फसल में {0} जोखिम कारक हैं जिन्हें ध्यान देने की आवश्यकता है।",
    loan_default_alert: "ऋण डिफॉल्ट अलर्ट",
    loan_default_message:
      "एक या अधिक ऋण डिफॉल्ट स्थिति में हैं। तत्काल कार्रवाई आवश्यक है।",
    weather_alert_rainfall: "मौसम चेतावनी: भारी वर्षा का पूर्वानुमान",
    moderate_pest_infestation: "मध्यम कीट संक्रमण की सूचना",
    irrigation_water_shortage: "सिंचाई पानी की कमी की सूचना",
    loan_repayment_delayed: "पिछला ऋण भुगतान 15 दिनों से देरी",
    market_price_dropped: "इस महीने बाजार मूल्य 12% गिरा",
    lower_than_average_yields: "लगातार दो बार औसत से कम उपज",

    // Recommended Actions
    contact_extension_agent:
      "फसल की स्थिति को सत्यापित करने के लिए स्थानीय विस्तार एजेंट से संपर्क करें",
    schedule_irrigation_call:
      "सिंचाई विकल्पों पर चर्चा के लिए कॉल शेड्यूल करें",
    review_repayment_schedule: "पुनर्भुगतान अनुसूची लचीलापन की समीक्षा करें",

    // Activity Descriptions
    approved_loan_request: "{1} के लिए ऋण अनुरोध {0} स्वीकृत किया",
    added_to_risk_monitoring:
      "मौसम पूर्वानुमान के कारण {0} को जोखिम निगरानी में जोड़ा गया",
    rejected_loan_request:
      "कम क्रेडिट स्कोर के कारण {1} के लिए ऋण अनुरोध {0} अस्वीकार किया",
    scheduled_followup_call:
      "सिंचाई परामर्श के लिए {0} के साथ अनुवर्ती कॉल शेड्यूल की",
    verified_documents: "{0} के लिए भूमि स्वामित्व दस्तावेजों का सत्यापन किया",

    // Metrics
    total_land_size: "कुल भूमि आकार",
    current_crop_ndvi: "वर्तमान फसल एनडीवीआई",
    normalized_difference_vegetation_index: "सामान्यीकृत अंतर वनस्पति सूचकांक",
    repayment_rate: "पुनर्भुगतान दर",

    // Risk & Analysis
    risk_loan_analysis: "जोखिम और ऋण विश्लेषण",

    // Farmer Contact
    farmer_contact: "किसान संपर्क",

    // Weather Related
    weather: "मौसम",
    market: "बाजार",
    disease: "रोग",
    other: "अन्य",

    // Loan Types
    pending_approval: "अनुमोदन के लिए लंबित",
    pending_final_approval: "अंतिम अनुमोदन के लिए लंबित",
    review_changes_before_final_approval:
      "अंतिम अनुमोदन से पहले परिवर्तनों की समीक्षा करें",
    advisor_notes: "सलाहकार नोट्स",
    add_notes_for_approval: "अनुमोदन के लिए नोट्स जोड़ें",
    changes_saved: "परिवर्तन सहेजे गए",
    loan_amount_updated: "ऋण राशि अपडेट की गई",
    edit: "संपादित करें",
    save: "सहेजें",
    na: "उपलब्ध नहीं",
    agrifinance: "कृषि-वित्त",
    farmer_id: "किसान आईडी",
    name: "नाम",
    location: "स्थान",

    // Financial Projections
    profitable: "लाभदायक",
    projected_yield: "अनुमानित उपज",
    expected_this_season: "इस मौसम की अपेक्षा",
    market_value: "बाजार मूल्य",
    production_costs_breakdown: "उत्पादन लागत विश्लेषण",
    seeds: "बीज",
    fertilizers: "उर्वरक",
    pesticides: "कीटनाशक",
    labor: "श्रम",
    machinery: "मशीनरी",
    profit_margins: "लाभ मार्जिन",
    revenue: "राजस्व",
    net_profit: "शुद्ध लाभ",
    profit_margin: "लाभ मार्जिन",
    loan_analysis: "ऋण विश्लेषण",
    loan_to_value_ratio: "ऋण-से-मूल्य अनुपात",
    recommended_max_loan: "अनुशंसित अधिकतम ऋण",
    collateral_value: "संपार्श्विक मूल्य",

    // Market Indicators translations
    market_indicators: "बाजार संकेतक",
    favorable: "अनुकूल",
    rice_price_trends: "चावल मूल्य प्रवृत्ति",
    per_ton: "प्रति टन",
    loading_price_data: "मूल्य डेटा लोड हो रहा है",
    price: "मूल्य",
    current_market_price: "वर्तमान बाजार मूल्य",
    policy_changes: "नीतिगत परिवर्तन",
    no_major_policy_changes: "हाल ही में कोई बड़ा नीतिगत परिवर्तन नहीं",
    procurement_infrastructure: "खरीद इंफ्रास्ट्रक्चर",
    mandi: "मंडी",
    distance: "दूरी",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    positive: "सकारात्मक",
    negative: "नकारात्मक",
    neutral: "तटस्थ",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get saved language from localStorage or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage === "en" || savedLanguage === "hi"
      ? savedLanguage
      : "en";
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
