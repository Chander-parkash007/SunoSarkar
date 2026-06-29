import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    complaints: 'Complaints',
    leaderboard: 'Leaderboard',
    emergency: 'Emergency',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    dashboard: 'Dashboard',
    logout: 'Log Out',
    adminPanel: 'Admin Panel',
    stats: 'Statistics',

    // Landing
    tagline: "Pakistan's Civic Platform",
    heroTitle1: 'Suno',
    heroTitle2: 'Sarkar',
    heroUrdu: 'آواز اٹھاؤ، حق لو',
    heroDesc: 'Report garbage, broken roads, sewage, and infrastructure failures directly to responsible government officials.',
    heroSub: 'Pakistan deserves better public services.',
    reportProblem: 'Report a Problem',
    viewComplaints: 'View Complaints',
    complaintsField: 'Complaints Filed',
    resolved: 'Resolved',
    activeOfficers: 'Active Officers',
    citiesCovered: 'Cities Covered',
    whatCanReport: 'What Can You Report?',
    everyProblem: 'Every Problem',
    matters: 'Matters',
    howItWorks: 'How It Works',
    simpleProcess: 'Simple Process',
    register: 'Register',
    fileComplaint: 'File Complaint',
    officerNotified: 'Officers Notified',
    trackConfirm: 'Track & Confirm',
    registerDesc: 'Sign up with your CNIC and verify your email with OTP',
    fileDesc: 'Describe the problem, add photos and your location',
    notifyDesc: 'Responsible officers in your UC are instantly alerted',
    trackDesc: 'Get status updates and confirm when resolved',
    whySuno: 'Why SunoSarkar?',
    builtFor: 'Built for',
    pakistan: 'Pakistan',
    beTheChange: 'Be the',
    change: 'Change',
    registerNow: 'Register Free',
    imOfficer: 'Officer Registration',
    topPerformers: 'Top Performers',
    officerLeaderboard: 'Officer Leaderboard',
    viewFullLeaderboard: 'View Full Leaderboard',

    // Auth
    createAccount: 'Create Account',
    joinToday: 'Join SunoSarkar today',
    personalInfo: 'Personal',
    location: 'Location',
    security: 'Security',
    fullName: 'Full Name',
    cnic: 'CNIC',
    email: 'Email Address',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    city: 'City',
    ucCode: 'UC Code',
    residentialAddress: 'Residential Address',
    permanentAddress: 'Permanent Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    continue: 'Continue',
    back: 'Back',
    alreadyAccount: 'Already have an account?',
    areYouOfficer: 'Are you an officer?',
    officerReg: 'Officer Registration',
    welcomeBack: 'Welcome back',
    signInToAccount: 'Sign in to your account',
    citizen: 'Citizen',
    officer: 'Officer',
    signInAs: 'Sign In as',
    noAccount: 'No account?',
    createOneFree: 'Create one free',
    verifyEmail: 'Verify Your Email',
    sentCode: 'We sent a 6-digit code to',
    enterOtp: 'Enter 6-digit OTP',
    verifyEmailBtn: 'Verify Email',
    didntReceive: "Didn't receive the code?",
    resendOtp: 'Resend Code',
    resendIn: 'Resend in',
    backToLogin: '← Back to Login',

    // Dashboard
    newComplaint: 'New Complaint',
    myComplaints: 'My Complaints',
    overview: 'Overview',
    areaComplaints: 'Area Complaints',
    fileNewComplaint: 'File New Complaint',
    details: 'Details',
    photos: 'Photos',
    category: 'Category',
    priority: 'Priority',
    title: 'Title',
    description: 'Description',
    normal: 'Normal',
    urgent: 'Urgent',
    emergencyPriority: 'Emergency',
    routineIssue: 'Routine issue',
    needsQuickAction: 'Needs quick action',
    criticalSituation: 'Critical situation',
    areaAddress: 'Area / Location',
    googleMapsLink: 'Google Maps Link',
    complaintDetails: 'Complaint Details',
    updateStatus: 'Update Status',
    submitComplaint: 'Submit Complaint',
    dropPhotos: 'Click or drag photos here',

    // Status
    pending: 'Pending',
    accepted: 'Accepted',
    inProgress: 'In Progress',
    resolvedStatus: 'Resolved',
    rejected: 'Rejected',
    closed: 'Closed',
    confirmResolved: 'Confirm Resolved',

    // Dashboard stats
    welcomeBack2: 'Welcome back',
    totalFiled: 'Total Filed',
    resolutionProgress: 'Resolution Progress',
    recentComplaints: 'Recent Complaints',
    viewAll: 'View all',
    noComplaintsYet: 'No complaints yet',
    fileFirstComplaint: 'File Your First Complaint',

    // Public pages
    officerRankings: 'Officer Rankings',
    emergencyHelplines: 'Emergency Helplines',
    emergencyContacts: 'Emergency Contacts',
    nationalNumbers: '🇵🇰 National Emergency Numbers',
    citySpecific: 'City-Specific Services',
    tapToCall: 'Tap to call',
    safetyReminders: 'Safety Reminders',

    // Language
    selectLanguage: 'Select Language',
    english: 'English',
    urdu: 'اردو',
    chooseLanguage: 'Choose your language',

    // Public Feed
    publicComplaints: 'Public Complaints',
    liveComplaintFeed: 'Live Complaint Feed',
    noComplaintsFound: 'No complaints found',
    tryDifferentCity: 'Try selecting a different city',
    complaintDetails: 'Complaint Details',
    areaAddress2: 'Area Address',
    viewOnMaps: 'View on Google Maps',
    refresh: 'Refresh',
    previous: 'Previous',
    next: 'Next',

    // Admin / Officer
    manageUsers: 'Manage Users',
    manageOfficers: 'Manage Officers',
    allComplaints: 'All Complaints',
    totalUsers: 'Total Users',
    totalOfficers: 'Total Officers',
    totalComplaints: 'Total Complaints',
    pendingApproval: 'Pending Approval',
    officersAwaiting: 'Officers Awaiting Approval',
    approve: 'Approve',
    deactivate: 'Deactivate',
    updateStatus: 'Update Status',
    note: 'Note (optional)',
    search: 'Search',
    searchPlaceholder: 'Search by title, city...',
    noData: 'No data yet',
    allCaught: 'All caught up!',
    noPendingComplaints: 'No pending complaints in your area',

    // Misc
    loading: 'Loading...',
    error: 'Something went wrong',
    reload: 'Reload Page',
    goHome: 'Go Home',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    optional: 'optional',
    required: 'required',
    min8chars: 'Minimum 8 characters',
    passwordsMatch: 'Passwords must match',
    emailVerificationRequired: 'Email Verification Required',
    otpWillBeSent: 'A 6-digit OTP will be sent to your email to verify your account.',
    adminApprovalRequired: 'Admin approval required after email verification.',
    selectRole: 'Select Your Role',
    jurisdictionArea: 'Jurisdiction Area',
    phoneNumber: 'Phone Number',
    verified: 'Verified',
    notVerified: 'Not Verified',
    active: 'Active',
    deactivated: 'Deactivated',
    resolved2: 'resolved',
    filed: 'filed',
    upvotes: 'upvotes',
  },

  ur: {
    // Navigation
    home: 'مرکزی صفحہ',
    complaints: 'شکایات',
    leaderboard: 'افسران درجہ',
    emergency: 'ہنگامی نمبر',
    signIn: 'لاگ ان',
    getStarted: 'شروع کریں',
    dashboard: 'ڈیش بورڈ',
    logout: 'لاگ آؤٹ',
    adminPanel: 'ایڈمن پینل',
    stats: 'اعداد و شمار',

    // Landing
    tagline: 'پاکستان کا شہری پلیٹ فارم',
    heroTitle1: 'سنو',
    heroTitle2: 'سرکار',
    heroUrdu: 'آواز اٹھاؤ — حق لو',
    heroDesc: 'کوڑا، ٹوٹی سڑکیں، سیوریج اور انفراسٹرکچر کی خرابیاں براہ راست ذمہ دار سرکاری اہلکاروں کو رپورٹ کریں۔',
    heroSub: 'پاکستان بہتر سرکاری خدمات کا حقدار ہے۔',
    reportProblem: 'مسئلہ رپورٹ کریں',
    viewComplaints: 'شکایات دیکھیں',
    complaintsField: 'درج شکایات',
    resolved: 'حل شدہ',
    activeOfficers: 'فعال افسران',
    citiesCovered: 'شامل شہر',
    whatCanReport: 'کیا رپورٹ کریں؟',
    everyProblem: 'ہر مسئلہ',
    matters: 'اہم ہے',
    howItWorks: 'کیسے کام کرتا ہے',
    simpleProcess: 'آسان طریقہ',
    register: 'رجسٹر کریں',
    fileComplaint: 'شکایت درج کریں',
    officerNotified: 'افسر کو اطلاع',
    trackConfirm: 'ٹریک اور تصدیق',
    registerDesc: 'اپنے شناختی کارڈ سے رجسٹر کریں اور OTP سے ای میل تصدیق کریں',
    fileDesc: 'مسئلہ بیان کریں، تصاویر اور اپنا مقام شامل کریں',
    notifyDesc: 'آپ کے علاقے کے ذمہ دار افسران کو فوری اطلاع دی جاتی ہے',
    trackDesc: 'شکایت کی حالت جانتے رہیں اور حل ہونے پر تصدیق کریں',
    whySuno: 'سنو سرکار کیوں؟',
    builtFor: 'بنایا گیا',
    pakistan: 'پاکستان کے لیے',
    beTheChange: 'تبدیلی',
    change: 'لائیں',
    registerNow: 'مفت رجسٹر کریں',
    imOfficer: 'افسر رجسٹریشن',
    topPerformers: 'سرفہرست افسران',
    officerLeaderboard: 'افسران کی درجہ بندی',
    viewFullLeaderboard: 'مکمل فہرست دیکھیں',

    // Auth
    createAccount: 'اکاؤنٹ بنائیں',
    joinToday: 'آج سنو سرکار میں شامل ہوں',
    personalInfo: 'ذاتی معلومات',
    location: 'مقام',
    security: 'سیکیورٹی',
    fullName: 'پورا نام',
    cnic: 'شناختی کارڈ نمبر',
    email: 'ای میل پتہ',
    age: 'عمر',
    gender: 'جنس',
    male: 'مرد',
    female: 'عورت',
    other: 'دیگر',
    city: 'شہر',
    ucCode: 'یونین کونسل کوڈ',
    residentialAddress: 'رہائشی پتہ',
    permanentAddress: 'مستقل پتہ',
    password: 'پاس ورڈ',
    confirmPassword: 'پاس ورڈ دوبارہ لکھیں',
    continue: 'جاری رکھیں',
    back: 'واپس',
    alreadyAccount: 'پہلے سے اکاؤنٹ ہے؟',
    areYouOfficer: 'کیا آپ افسر ہیں؟',
    officerReg: 'افسر رجسٹریشن',
    welcomeBack: 'خوش آمدید',
    signInToAccount: 'اپنے اکاؤنٹ میں داخل ہوں',
    citizen: 'شہری',
    officer: 'افسر',
    signInAs: 'لاگ ان کریں',
    noAccount: 'اکاؤنٹ نہیں ہے؟',
    createOneFree: 'مفت بنائیں',
    verifyEmail: 'ای میل کی تصدیق',
    sentCode: 'ہم نے 6 ہندسی کوڈ بھیجا ہے',
    enterOtp: '6 ہندسی OTP درج کریں',
    verifyEmailBtn: 'ای میل تصدیق کریں',
    didntReceive: 'کوڈ نہیں ملا؟',
    resendOtp: 'کوڈ دوبارہ بھیجیں',
    resendIn: 'دوبارہ بھیجیں',
    backToLogin: '← لاگ ان پر واپس',

    // Dashboard
    newComplaint: 'نئی شکایت',
    myComplaints: 'میری شکایات',
    overview: 'مجموعی جائزہ',
    areaComplaints: 'علاقے کی شکایات',
    fileNewComplaint: 'نئی شکایت درج کریں',
    details: 'تفصیلات',
    photos: 'تصاویر',
    category: 'زمرہ',
    priority: 'ترجیح',
    title: 'عنوان',
    description: 'تفصیل',
    normal: 'معمول',
    urgent: 'فوری',
    emergencyPriority: 'ہنگامی',
    routineIssue: 'معمول کا مسئلہ',
    needsQuickAction: 'فوری کارروائی ضروری',
    criticalSituation: 'نازک صورتحال',
    areaAddress: 'علاقہ / مقام',
    googleMapsLink: 'گوگل میپس لنک',
    complaintDetails: 'شکایت کی تفصیل',
    updateStatus: 'حالت تبدیل کریں',
    submitComplaint: 'شکایت جمع کروائیں',
    dropPhotos: 'تصاویر یہاں ڈراپ کریں',

    // Status
    pending: 'زیر التوا',
    accepted: 'قبول شدہ',
    inProgress: 'کارروائی جاری',
    resolvedStatus: 'حل ہو گئی',
    rejected: 'مسترد',
    closed: 'بند',
    confirmResolved: 'حل کی تصدیق کریں',

    // Dashboard stats
    welcomeBack2: 'خوش آمدید',
    totalFiled: 'کل درج شکایات',
    resolutionProgress: 'حل کی پیش رفت',
    recentComplaints: 'حالیہ شکایات',
    viewAll: 'سب دیکھیں',
    noComplaintsYet: 'ابھی تک کوئی شکایت نہیں',
    fileFirstComplaint: 'پہلی شکایت درج کریں',

    // Public pages
    officerRankings: 'افسران کی درجہ بندی',
    emergencyHelplines: 'ہنگامی ہیلپ لائنز',
    emergencyContacts: 'ہنگامی رابطے',
    nationalNumbers: '🇵🇰 قومی ہنگامی نمبر',
    citySpecific: 'شہر کے مخصوص نمبر',
    tapToCall: 'کال کرنے کے لیے دبائیں',
    safetyReminders: 'حفاظتی تجاویز',

    // Language
    selectLanguage: 'زبان منتخب کریں',
    english: 'انگریزی',
    urdu: 'اردو',
    chooseLanguage: 'اپنی زبان منتخب کریں',

    // Public Feed
    publicComplaints: 'عوامی شکایات',
    liveComplaintFeed: 'لائیو شکایات فیڈ',
    noComplaintsFound: 'کوئی شکایت نہیں ملی',
    tryDifferentCity: 'کوئی اور شہر منتخب کریں',
    complaintDetails: 'شکایت کی تفصیل',
    areaAddress2: 'علاقے کا پتہ',
    viewOnMaps: 'گوگل میپس پر دیکھیں',
    refresh: 'تازہ کریں',
    previous: 'پچھلا',
    next: 'اگلا',

    // Admin / Officer
    manageUsers: 'صارفین کا انتظام',
    manageOfficers: 'افسران کا انتظام',
    allComplaints: 'تمام شکایات',
    totalUsers: 'کل صارفین',
    totalOfficers: 'کل افسران',
    totalComplaints: 'کل شکایات',
    pendingApproval: 'منظوری کے انتظار میں',
    officersAwaiting: 'منظوری کے منتظر افسران',
    approve: 'منظور کریں',
    deactivate: 'غیر فعال کریں',
    updateStatus: 'حالت تبدیل کریں',
    note: 'نوٹ (اختیاری)',
    search: 'تلاش',
    searchPlaceholder: 'عنوان، شہر سے تلاش کریں...',
    noData: 'ابھی کوئی ڈیٹا نہیں',
    allCaught: 'سب ٹھیک ہے!',
    noPendingComplaints: 'آپ کے علاقے میں کوئی زیر التوا شکایت نہیں',

    // Misc
    loading: 'لوڈ ہو رہا ہے...',
    error: 'کچھ غلط ہو گیا',
    reload: 'صفحہ دوبارہ لوڈ کریں',
    goHome: 'مرکزی صفحے پر جائیں',
    submit: 'جمع کریں',
    cancel: 'منسوخ',
    save: 'محفوظ کریں',
    close: 'بند کریں',
    delete: 'حذف کریں',
    edit: 'ترمیم',
    view: 'دیکھیں',
    yes: 'جی ہاں',
    no: 'نہیں',
    or: 'یا',
    optional: 'اختیاری',
    required: 'ضروری',
    min8chars: 'کم از کم 8 حروف',
    passwordsMatch: 'پاس ورڈ ایک جیسے ہونے چاہئیں',
    emailVerificationRequired: 'ای میل تصدیق ضروری ہے',
    otpWillBeSent: 'آپ کے اکاؤنٹ کی تصدیق کے لیے ای میل پر 6 ہندسی کوڈ بھیجا جائے گا۔',
    adminApprovalRequired: 'ای میل تصدیق کے بعد ایڈمن کی منظوری ضروری ہے۔',
    selectRole: 'اپنا کردار منتخب کریں',
    jurisdictionArea: 'دائرہ اختیار',
    phoneNumber: 'فون نمبر',
    verified: 'تصدیق شدہ',
    notVerified: 'تصدیق نہیں ہوئی',
    active: 'فعال',
    deactivated: 'غیر فعال',
    resolved2: 'حل شدہ',
    filed: 'درج',
    upvotes: 'ووٹ',
  },
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('ss_theme') || 'dark');
  const [lang, setLangState] = useState(() => localStorage.getItem('ss_lang') || 'en');
  const [showLangModal, setShowLangModal] = useState(() => !localStorage.getItem('ss_lang'));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    localStorage.setItem('ss_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Set lang attribute + direction on whole document
    const root = document.documentElement;
    if (lang === 'ur') {
      root.setAttribute('lang', 'ur');
      root.setAttribute('dir', 'rtl');
      // Apply Urdu font to body for senior citizen readability
      document.body.style.fontFamily = "'Noto Nastaliq Urdu', serif";
      document.body.style.fontSize = '17px';
      document.body.style.lineHeight = '2.2';
    } else {
      root.setAttribute('lang', 'en');
      root.removeAttribute('dir');
      document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
      document.body.style.fontSize = '16px';
      document.body.style.lineHeight = '1.6';
    }
    localStorage.setItem('ss_lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const setLang = (l) => {
    setLangState(l);
    setShowLangModal(false);
    localStorage.setItem('ss_lang', l);
  };

  // Translate function — falls back to English, then returns the key itself
  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;
  const isUrdu = lang === 'ur';

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, t, isUrdu, showLangModal, setShowLangModal }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
