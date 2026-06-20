import React, { useState, useEffect, useRef } from "react";
import { UserRole, AppLanguage } from "../types";
import { TRANSLATIONS } from "../translations";
import { RAJASTHAN_DISTRICTS, getVillagesForDistrict } from "../data/rajasthanData";
import { SearchableCombobox } from "./SearchableCombobox";
import { 
  Landmark, 
  Lock, 
  User, 
  Sparkles, 
  Languages, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  Mail, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  ChevronLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Sun,
  Moon
} from "lucide-react";

interface LoginProps {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onLoginSuccess: (user: { id: string; role: UserRole; name: string; designation?: string }) => void;
  setIsLandingActive?: (val: boolean) => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
}

const STEP_TRANSLATIONS: Record<AppLanguage, {
  stepAlert: string;
  verMethod: string;
  welcomeTitle: string;
  welcomeDesc: string;
  withGoogle: string;
  withEmail: string;
  demoTitle: string;
  stepProfile: string;
  selectRoleTitle: string;
  selectRoleDesc: string;
  roleVillagerTitle: string;
  roleVillagerDesc: string;
  roleSachivTitle: string;
  roleSachivDesc: string;
  roleSarpanchTitle: string;
  roleSarpanchDesc: string;
  stepIdentity: string;
  identityTitle: string;
  identityDescCitizen: string;
  identityDescSachiv: string;
  identityDescAdmin: string;
  fullNameLabel: string;
  aadhaarLabel: string;
  officerCodeLabel: string;
  adminTokenLabel: string;
  finishBtn: string;
  backBtn: string;
  ageLabel: string;
  phoneLabel: string;
  villageLabel: string;
  districtLabel: string;
  officialIdLabel: string;
  sendOtpBtn: string;
  verifyOtpBtn: string;
  otpLabel: string;
  otpHint: string;
  otpSuccess: string;
  otpRequiredError: string;
  otpVerifyError: string;
  successTitle: string;
  successDesc: string;
  successName: string;
  successDesignation: string;
  successLocation: string;
  successPhone: string;
  successProceed: string;
}> = {
  [AppLanguage.EN]: {
    stepAlert: "STEP {step} OF 3: {title}",
    verMethod: "VERIFICATION METHOD",
    welcomeTitle: "Welcome Back to GramSeva",
    welcomeDesc: "Access Rajasthan's premier local government services through unified secure entry.",
    withGoogle: "Continue with Google",
    withEmail: "Continue with Email Address",
    demoTitle: "ACCESS OFFICIAL / ADMIN DEMO ACCOUNTS",
    stepProfile: "PROFILE SELECTOR",
    selectRoleTitle: "Select Your Role",
    selectRoleDesc: "Choose your workspace level in the Panchayat to load your authorized dashboard.",
    roleVillagerTitle: "Villager (ग्रामीण)",
    roleVillagerDesc: "Access schemes, file grievances & apply for certificate copies.",
    roleSachivTitle: "Gram Sachiv (ग्राम सचिव)",
    roleSachivDesc: "Verify attendance, approve documents, review public grievances.",
    roleSarpanchTitle: "Sarpanch & Admin (सरपंच)",
    roleSarpanchDesc: "Oversee Zila budget, track assets, manage escalation tiers.",
    stepIdentity: "SECURE IDENTITY VERIFICATION",
    identityTitle: "Confirm Your Identity",
    identityDescCitizen: "Enter your name and Aadhaar to match digital identity or digital-locker records.",
    identityDescSachiv: "Provide your Panchayat officer license identifier and access passkey.",
    identityDescAdmin: "Please authorize secure token check for Zila Parishad treasury allocation access.",
    fullNameLabel: "Full Name",
    aadhaarLabel: "Aadhaar Card Number",
    officerCodeLabel: "Officer Employee Code",
    adminTokenLabel: "Sarpanch Secure Key / Token",
    finishBtn: "Confirm & Complete Sign-In",
    backBtn: "Go Back",
    ageLabel: "Age",
    phoneLabel: "Phone Number",
    villageLabel: "Village Name",
    districtLabel: "District Name",
    officialIdLabel: "Official ID",
    sendOtpBtn: "Send OTP Code",
    verifyOtpBtn: "Verify Code",
    otpLabel: "Enter 4-Digit OTP",
    otpHint: "OTP dispatched to your registered mobile number.",
    otpSuccess: "✓ Phone Verified",
    otpRequiredError: "Please verify your phone number with the OTP sent.",
    otpVerifyError: "Incorrect OTP. Please check the code and try again.",
    successTitle: "Account Created Successfully!",
    successDesc: "Your security credentials have been verified and registered on the e-Panchayat system.",
    successName: "Full Name",
    successDesignation: "Designation",
    successLocation: "Location Area",
    successPhone: "Phone Number",
    successProceed: "Proceed to Portal"
  },
  [AppLanguage.HI]: {
    stepAlert: "चरण {step}/3: {title}",
    verMethod: "सत्यापन विधि",
    welcomeTitle: "ग्रामसेवा में आपका स्वागत है",
    welcomeDesc: "एकीकृत सुरक्षित प्रवेश प्रणाली द्वारा राजस्थान सरकार की डिजिटल पंचायत सेवाओं का आनंद लें।",
    withGoogle: "गूगल के साथ जारी रखें",
    withEmail: "ईमेल पते के साथ जारी रखें",
    demoTitle: "आधिकारिक / एडमिन डेमो खाते खोलें",
    stepProfile: "प्रोफ़ाइल चयनकर्ता",
    selectRoleTitle: "अपनी भूमिका चुनें",
    selectRoleDesc: "पंचायत में अपने अधिकार क्षेत्र का चयन करें जिससे सही डैशबोर्ड लोड हो सके।",
    roleVillagerTitle: "ग्रामीण नागरिक",
    roleVillagerDesc: "सरकारी योजनाएं देखें, शिकायत दर्ज करें और प्रमाण पत्र आवेदन करें।",
    roleSachivTitle: "ग्राम सचिव",
    roleSachivDesc: "मजदूरी हाजिरी जांचें, दस्तावेज स्वीकृत करें, नागरिक शिकायतें सुलझाएं।",
    roleSarpanchTitle: "सरपंच एवं मुख्य प्रशासक",
    roleSarpanchDesc: "बजट का आवंटन तय करें, संपत्ति की जाँच करें और जिला एस्केलेशन देखें।",
    stepIdentity: "सुरक्षित पहचान सत्यापन",
    identityTitle: "अपनी पहचान सत्यापित करें",
    identityDescCitizen: "डिजिटल पहचान पत्र (Aadhaar/DigiLocker) के मिलान के लिए अपना नाम और आधार दर्ज करें।",
    identityDescSachiv: "अपना सरकारी लाइसेंस नंबर और विशेष पंचायत पासवर्ड प्रदान करें।",
    identityDescAdmin: "जिला परिषद वित्तीय निधि और ट्रेजरी बजट उपयोग की पहुंच के लिए टोकन भरें।",
    fullNameLabel: "पूरा नाम",
    aadhaarLabel: "आधार कार्ड संख्या",
    officerCodeLabel: "अधिकारी कर्मचारी कोड",
    adminTokenLabel: "सरपंच सुरक्षा कुंजी / टोकन",
    finishBtn: "सत्यापन पूर्ण करें और प्रवेश करें",
    backBtn: "पीछे जाएं",
    ageLabel: "आयु",
    phoneLabel: "फ़ोन नंबर",
    villageLabel: "ग्राम का नाम",
    districtLabel: "जिला का नाम",
    officialIdLabel: "आधिकारिक पहचान पत्र (Official ID)",
    sendOtpBtn: "ओटीपी कोड भेजें",
    verifyOtpBtn: "कोड सत्यापित करें",
    otpLabel: "4-अंकीय ओटीपी दर्ज करें",
    otpHint: "ओटीपी आपके मोबाइल नंबर पर भेज दिया गया है।",
    otpSuccess: "✓ फ़ोन सत्यापित हो गया",
    otpRequiredError: "कृपया अपना मोबाइल नंबर ओटीपी से सत्यापित करें।",
    otpVerifyError: "गलत ओटीपी। कृपया भेजा गया कोड दिखाएं और पुनः प्रयास करें।",
    successTitle: "खाता सफलतापूर्वक बनाया गया!",
    successDesc: "आपका राजस्थान ई-पंचायत खाता स्वीकृत और सत्यापित कर दिया गया है।",
    successName: "पूरा नाम",
    successDesignation: "अधिकार पद / पदवी",
    successLocation: "स्थान / क्षेत्र",
    successPhone: "मोबाइल नंबर",
    successProceed: "पोर्टल में प्रवेश करें"
  },
  [AppLanguage.MW]: {
    stepAlert: "कदम {step} री ३: {title}",
    verMethod: "जांच री रीत सा",
    welcomeTitle: "राम-राम सा! ग्रामसेवा माथै स्वागत है सा",
    welcomeDesc: "सिधो अर सुरक्षित रीत सूं राजस्थान सरकार री सगळी पंचायत सुविधायुक्त सेवावां रो उपयोग करो सा।",
    withGoogle: "गूगल (Google) रै साथै चालो सा",
    withEmail: "ईमेल सु कोड मंगाओ सा",
    demoTitle: "नक्की डेमो सरकारी खातां मां प्रवेश सा",
    stepProfile: "खाता रो अधिकार सा",
    selectRoleTitle: "थारो अधिकार चुणो सा",
    selectRoleDesc: "पंचायत मां थारो काम चुणो सा, जणूसूं थारो बही-खातो अर डैशबोर्ड चालू हो सके सा।",
    roleVillagerTitle: "गांवां रो नागरिक (Villager)",
    roleVillagerDesc: "परमाण पत्र बणाओ सा, शिकायत दर्ज कराओ अर सरकारी योजना रो लाभ उठाओ सा।",
    roleSachivTitle: "ग्राम सचिव सा (Gram Sachiv)",
    roleSachivDesc: "कागजात मंजूर करो सा, मजदूरां री हाजिरी देखो अर जन-शिकायतां सुलझाओ सा।",
    roleSarpanchTitle: "सरपंच सा अर कलक्टर (Sarpanch)",
    roleSarpanchDesc: "बजट रो बांटवारो संभालो सा, संपत री जांच करो अर जिल्ला स्तर रा काम निपटाओ सा।",
    stepIdentity: "पहचान री पक्की जांच सा",
    identityTitle: "थारी पहचान नक्की करो सा",
    identityDescCitizen: "डिजिटल क्रेडेंशियल जांचण सारू थारो पूरो नाम अर आधार नंबर नक्की लिखो सा।",
    identityDescSachiv: "थारो सरकारी कर्मचारी कोड अर पासवर्ड नक्की लिखो सा।",
    identityDescAdmin: "जिला खजाने री संभाल अर बजट रो ब्यौरो देखण सारू गुप्त टोकन नक्की करो सा।",
    fullNameLabel: "पूरो नाम सा",
    aadhaarLabel: "आधार कार्ड नंबर सा",
    officerCodeLabel: "सचिव कोड / कर्मचारी पास",
    adminTokenLabel: "सरपंच तिजोरी पासवर्ड / टोकन",
    finishBtn: "जांच पूरी करो अर प्रवेश करो सा",
    backBtn: "पाछा जाओ सा",
    ageLabel: "उम्मर सा",
    phoneLabel: "फ़ोन नंबर सा",
    villageLabel: "गांव रो नाम सा",
    districtLabel: "जिल्लो सा",
    officialIdLabel: "सरकारी पास कोड (Official ID) सा",
    sendOtpBtn: "ओटीपी भेजो सा",
    verifyOtpBtn: "कोड पक्की करो सा",
    otpLabel: "४-अंकीय ओटीपी लिखो सा",
    otpHint: "ओटीपी थारा मोबाइल नंबर पर भेजियो गयो सा।",
    otpSuccess: "✓ फ़ोन नंबर पक्को होग्यो सा",
    otpRequiredError: "मोबाइल नंबर ओटीपी सूं पक्को करो सा।",
    otpVerifyError: "गलत ओटीपी सा। भेजियो गयो कोड देखो अर फेर कोशिश करो सा।",
    successTitle: "खातो सफ़लतापूर्वक बणग्यो सा!",
    successDesc: "थारो राजस्थान ई-पंचायत खातो मंजूर अर जांच्यो ग्यो है सा।",
    successName: "पूरो नाम सा",
    successDesignation: "अधिकार रो पद सा",
    successLocation: "स्थान / क्षेत्र सा",
    successPhone: "फ़ोन नंबर सा",
    successProceed: "पोर्टल मां प्रवेश करो सा"
  }
};

export default function Login({ 
  language, 
  setLanguage, 
  onLoginSuccess, 
  setIsLandingActive: propsSetIsLandingActive,
  darkMode = false,
  setDarkMode
}: LoginProps) {
  const t = TRANSLATIONS[language];
  const st = STEP_TRANSLATIONS[language];

  // Multi-step form states
  const [step, setStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Form input states
  const [fullName, setFullName] = useState("");
  const [securityCredential, setSecurityCredential] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Email and password sign-up specific states
  const [emailSignUpMode, setEmailSignUpMode] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Custom user fields state
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [villageName, setVillageName] = useState("");
  const [district, setDistrict] = useState("");
  const [officialId, setOfficialId] = useState("");
  const [subStep, setSubStep] = useState<number>(1);
  const [aadhaarCard, setAadhaarCard] = useState("");
  const [gender, setGender] = useState("");
  const [step3OtpSent, setStep3OtpSent] = useState(false);
  const [step3OtpInput, setStep3OtpInput] = useState("");
  const [step3OtpVerified, setStep3OtpVerified] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [step3GeneratedOtp, setStep3GeneratedOtp] = useState<string>("");
  const [otpResendCountdown, setOtpResendCountdown] = useState<number>(0);
  const [step3OtpResendCountdown, setStep3OtpResendCountdown] = useState<number>(0);
  const otpTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const step3OtpTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [savedSuccessUser, setSavedSuccessUser] = useState<any>(null);

  const setIsLandingActive = (val: boolean) => {
    if (typeof propsSetIsLandingActive === "function") {
      propsSetIsLandingActive(val);
    }
  };

  // Generate a random 4-digit OTP
  const generateOtp = (): string =>
    Math.floor(1000 + Math.random() * 9000).toString();

  // Countdown timer for OTP resend (subStep 2)
  useEffect(() => {
    if (otpResendCountdown > 0) {
      otpTimerRef.current = setInterval(() => {
        setOtpResendCountdown(prev => {
          if (prev <= 1) {
            if (otpTimerRef.current) clearInterval(otpTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    };
  }, [otpResendCountdown]);

  // Countdown timer for OTP resend (step 3 phone)
  useEffect(() => {
    if (step3OtpResendCountdown > 0) {
      step3OtpTimerRef.current = setInterval(() => {
        setStep3OtpResendCountdown(prev => {
          if (prev <= 1) {
            if (step3OtpTimerRef.current) clearInterval(step3OtpTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (step3OtpTimerRef.current) clearInterval(step3OtpTimerRef.current);
    };
  }, [step3OtpResendCountdown]);


  // Preloaded Configuration Map
  const DEMO_CREDENTIALS = [
    {
      role: UserRole.CITIZEN,
      id: "citizen",
      pass: "password",
      labelEN: "Citizen Portal",
      labelHI: "नागरिक पोर्टल",
      labelMW: "नागरिक पोर्टल",
      name: "Ramesh Gurjar",
      descEN: "File complaints, apply certificates & check schemes",
      descHI: "शिकायत दर्ज करें, प्रमाण पत्र आवेदन और योजनाएं खोजें",
      descMW: "शिकायत दर्ज करो, कागजात बणाओ अर सरकारी योजना खोजो",
      aadhaar: "4534 1234 8911"
    },
    {
      role: UserRole.OFFICIAL,
      id: "official",
      pass: "password",
      labelEN: "Gram Sachiv",
      labelHI: "ग्राम सचिव",
      labelMW: "ग्राम सचिव",
      name: "Smt. Kavita Sharma",
      designation: "Gram Sachiv (Sanganer)",
      descEN: "Approve documents & verify workers attendance",
      descHI: "दस्तावेज़ स्वीकृत करें और श्रमिकों की कतार देखें",
      descMW: "कागजात मंजूर करो अर मजदूरां री हाजिरी देखो",
      code: "official-sanganer"
    },
    {
      role: UserRole.ADMIN,
      id: "admin",
      pass: "password",
      labelEN: "District Admin",
      labelHI: "जिला अध्यक्ष",
      labelMW: "जिल्ला कलक्टर",
      name: "Shri Jitendra Soni",
      designation: "Jaipur District Collector",
      descEN: "Zila Parishad financial charts, assets map & escalations",
      descHI: "बजट ग्राफ़, एसेट मैपिंग और जिला स्तर शिकायतें",
      descMW: "बजट री ब्यौरा, गांव री संपत अर जिल्ला शिकायतां",
      code: "admin-jaipur"
    }
  ];

  // Back Button / Arrow Navigation handler
  const handleBackNavigation = () => {
    setError(null);
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      if (emailSignUpMode) {
        setEmailSignUpMode(false);
      } else {
        if (setIsLandingActive) {
          setIsLandingActive(true);
        }
      }
    }
  };

  // Helper function to advance steps
  const handleSelectVerification = (method: "google" | "email") => {
    setError(null);
    if (method === "email") {
      setEmailSignUpMode(true);
    } else {
      setSelectedRole(null);
      setStep(2);
    }
  };

  // Password strength helper
  const getPasswordRules = (pwd: string) => ({
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  });

  const getPasswordStrengthLevel = (pwd: string) => {
    const r = getPasswordRules(pwd);
    const score = [r.minLength, r.hasUpper, r.hasNumber, r.hasSpecial].filter(Boolean).length;
    if (score <= 1) return "weak";
    if (score === 2 || score === 3) return "medium";
    return "strong";
  };

  // Email format validator
  const isValidEmail = (email: string) =>
    /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim());

  // Indian mobile number validator: exactly 10 digits, starts with 6/7/8/9
  const isValidIndianPhone = (ph: string) =>
    /^[6-9][0-9]{9}$/.test(ph.replace(/\D/g, ""));

  const handleContinueToStep2 = () => {
    setError(null);
    if (!signUpEmail.trim() || !isValidEmail(signUpEmail)) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया सही ईमेल पता दर्ज करें (जैसे: name@example.com)" 
          : language === AppLanguage.MW
            ? "सही ईमेल पता लिखो सा (जैसे: name@example.com)"
            : "Please enter a valid email address (e.g. name@example.com)."
      );
      return;
    }
    const pwdRules = getPasswordRules(signUpPassword);
    if (!pwdRules.minLength) {
      setError(
        language === AppLanguage.HI 
          ? "पासवर्ड कम से कम ८ अक्षरों का होना चाहिए।" 
          : "Password must be at least 8 characters long."
      );
      return;
    }
    if (!pwdRules.hasUpper) {
      setError(
        language === AppLanguage.HI 
          ? "पासवर्ड में कम से कम एक बड़ा अक्षर (A-Z) होना चाहिए।" 
          : "Password must contain at least one uppercase letter (A–Z)."
      );
      return;
    }
    if (!pwdRules.hasNumber) {
      setError(
        language === AppLanguage.HI 
          ? "पासवर्ड में कम से कम एक अंक (0-9) होना चाहिए।" 
          : "Password must contain at least one number (0–9)."
      );
      return;
    }
    if (!pwdRules.hasSpecial) {
      setError(
        language === AppLanguage.HI 
          ? "पासवर्ड में कम से कम एक विशेष चिन्ह (!@#$%) होना चाहिए।" 
          : "Password must contain at least one special character (!@#$%^&*)."
      );
      return;
    }
    setSelectedRole(null);
    setStep(2);
  };

  // Step 2 profile selector handler
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    
    // Auto-populate default mock data for testing flow of Step 3
    const match = DEMO_CREDENTIALS.find(cred => cred.role === role);
    if (match) {
      setFullName(match.name);
      setSecurityCredential(role === UserRole.CITIZEN ? match.aadhaar : (match.code || ""));
      setAge(role === UserRole.CITIZEN ? "34" : role === UserRole.OFFICIAL ? "41" : "55");
      setPhone("9876543210");
      setVillageName(role === UserRole.OFFICIAL ? "Sanganer" : role === UserRole.ADMIN ? "Amer" : "Chomu");
      setDistrict("Jaipur");
      setOfficialId(role === UserRole.OFFICIAL ? "SEC-9481-JAI" : role === UserRole.ADMIN ? "SARON-502-JPR" : "");
      setAadhaarCard(role === UserRole.CITIZEN ? match.aadhaar : "9876 5432 1012");
      setGender(role === UserRole.OFFICIAL ? "Female" : "Male");
      setOtpSent(true);
      setOtpVerified(true);
      setOtpInput(generatedOtp || "");
      setStep3OtpVerified(true);
      setSubStep(3); // Go straight to location selection for verification
    } else {
      setFullName("");
      setSecurityCredential("");
      setAge("");
      setPhone("");
      setOtpSent(false);
      setOtpInput("");
      setOtpVerified(false);
      setVillageName("");
      setDistrict("");
      setOfficialId("");
      setAadhaarCard("");
      setGender("");
      setStep3OtpVerified(false);
      setStep3OtpSent(false);
      setStep3OtpInput("");
      setSubStep(1); // Real registration starts at Step 1
    }
    setStep(3);
  };

  const handleSendOtp = () => {
    if (!isValidIndianPhone(phone)) {
      setError(
        language === AppLanguage.MW
          ? "सही १० अंकीय मोबाइल नंबर लिखो सा (6/7/8/9 सूं शुरू होवे)।"
          : language === AppLanguage.HI
            ? "कृपया वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू होना चाहिए)।"
            : "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
      );
      return;
    }
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setError(null);
    setOtpSent(true);
    setOtpInput("");
    setOtpResendCountdown(30);
  };

  const handleVerifyOtp = () => {
    if (!otpInput.trim()) {
      setError(language === AppLanguage.HI ? "ओटीपी दर्ज करें।" : "Please enter the OTP.");
      return;
    }
    if (otpInput === generatedOtp) {
      setOtpVerified(true);
      setError(null);
    } else {
      setError(st.otpVerifyError);
    }
  };

  const handleSendStep3Otp = () => {
    if (!isValidIndianPhone(phone)) {
      setError(
        language === AppLanguage.HI
          ? "कृपया वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू)।"
          : "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
      );
      return;
    }
    const otp = generateOtp();
    setStep3GeneratedOtp(otp);
    setError(null);
    setStep3OtpSent(true);
    setStep3OtpInput("");
    setStep3OtpVerified(false);
    setStep3OtpResendCountdown(30);
  };

  const handleVerifyStep3Otp = () => {
    if (!step3OtpInput.trim()) {
      setError(language === AppLanguage.HI ? "ओटीपी दर्ज करें।" : "Please enter the OTP.");
      return;
    }
    if (step3OtpInput === step3GeneratedOtp) {
      setStep3OtpVerified(true);
      setError(null);
    } else {
      setError(st.otpVerifyError);
    }
  };

  const handleNextToOtp = () => {
    if (!fullName.trim()) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया अपना पूरा नाम लिखें।" 
          : "Please enter your full name."
      );
      return;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया एक सही आयु दर्ज करें।" 
          : "Please enter a valid age."
      );
      return;
    }
    if (!isValidIndianPhone(phone)) {
      setError(
        language === AppLanguage.HI
          ? "कृपया वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू होना चाहिए)।"
          : "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
      );
      return;
    }
    if (!gender) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया अपना लिंग चुनें।" 
          : "Please select your gender."
      );
      return;
    }
    setError(null);
    handleSendOtp();
    setSubStep(2);
  };

  const handleSubStepBack = () => {
    setError(null);
    if (subStep === 1) {
      setStep(2); // Go back to role selection screen
    } else {
      setSubStep(subStep - 1);
    }
  };

  // Step 3 registration confirmation
  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Basic details validation (Required if they skip straight to 3 in fallback/demo bypass)
    if (!fullName.trim()) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया अपना पूरा नाम लिखें।" 
          : "Please enter your full name."
      );
      return;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया एक सही आयु दर्ज करें।" 
          : "Please enter a valid age."
      );
      return;
    }
    if (!isValidIndianPhone(phone)) {
      setError(
        language === AppLanguage.HI
          ? "कृपया वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू होना चाहिए)।"
          : "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
      );
      return;
    }
    if (!otpVerified && !step3OtpVerified) {
      setError(st.otpRequiredError);
      return;
    }

    if (!step3OtpVerified) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया मोबाइल नंबर को ओटीपी कोड सत्यापित करें।" 
          : "Please verify your mobile number via OTP first."
      );
      return;
    }

    // Aadhaar Card verification
    const rawAadhaar = aadhaarCard.replace(/\s/g, "");
    if (!rawAadhaar) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया आधार कार्ड संख्या दर्ज करें।" 
          : "Please enter your Aadhaar card number."
      );
      return;
    }
    if (rawAadhaar.length !== 12 || isNaN(Number(rawAadhaar))) {
      setError(
        language === AppLanguage.HI 
          ? "आधार कार्ड संख्या ठीक १२ अंकों की होनी चाहिए।" 
          : "Aadhaar Card number must be exactly 12 digits."
      );
      return;
    }

    // Gender verification
    if (!gender) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया अपना लिंग चुनें।" 
          : "Please select your gender."
      );
      return;
    }

    // 2. Strict district-village validation
    if (!district.trim()) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया पहले जिला का चयन करें।" 
          : "Please select a district."
      );
      return;
    }
    if (!villageName.trim()) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया ग्राम का चयन करें।" 
          : "Please select a village."
      );
      return;
    }

    // Validate selectedVillage is member of selectedDistrict's villages
    const allowedVillages = getVillagesForDistrict(district);
    if (!allowedVillages.includes(villageName)) {
      setError(
        language === AppLanguage.HI
          ? "चयनित ग्राम चयनित जिले से संबंधित नहीं है।"
          : "Selected village does not belong to the selected district."
      );
      return;
    }

    // 3. Official ID Validation
    if ((selectedRole === UserRole.OFFICIAL || selectedRole === UserRole.ADMIN) && !officialId.trim()) {
      setError(
        language === AppLanguage.HI 
          ? "कृपया अपना आधिकारिक कोड / आईडी दर्ज करें।" 
          : "Please enter your official workspace license ID."
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Find matching demo config to load the correct role and full assets
      const match = DEMO_CREDENTIALS.find(cred => cred.role === selectedRole);
      
      let finalDesignation = "Authorized Panchayat Member";
      if (selectedRole === UserRole.OFFICIAL) {
        finalDesignation = `Gram Sachiv (${villageName})`;
      } else if (selectedRole === UserRole.ADMIN) {
        finalDesignation = `Sarpanch & Admin (${villageName})`;
      } else {
        finalDesignation = `Resident Citizen (${villageName})`;
      }

      setSavedSuccessUser({
        id: match ? match.id : `user-${Math.floor(Math.random() * 900000 + 100000)}`,
        role: selectedRole || UserRole.CITIZEN,
        name: fullName.trim(),
        designation: finalDesignation
      });
      setShowSuccessModal(true);
      setIsLoading(false);
    }, 800);
  };

  // Direct Bypass with quick selections
  const handleQuickBypassLogin = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        id: cred.id,
        role: cred.role,
        name: cred.name,
        designation: cred.designation
      });
      setIsLoading(false);
    }, 450);
  };

  // Render variables for step alerts and progress
  const getStepAlertText = () => {
    let titleStr = "";
    if (step === 1) titleStr = st.verMethod;
    else if (step === 2) titleStr = st.stepProfile;
    else titleStr = st.stepIdentity;

    return st.stepAlert.replace("{step}", step.toString()).replace("{title}", titleStr);
  };

  const getPercentageString = () => {
    if (step === 1) return "33%";
    if (step === 2) return "66%";
    return "100%";
  };

  const getProgressWidthClass = () => {
    if (step === 1) return { width: "33%" };
    if (step === 2) return { width: "66%" };
    return { width: "100%" };
  };

  return (
    <div className="min-h-screen bg-rajasthani-pattern flex flex-col justify-between items-center font-sans pb-12 w-full">
      
      {/* Top Header bar with Language Toggle */}
      <div className="w-full max-w-7xl mx-auto px-4 py-4 flex justify-between items-center border-b border-slate-200">
        {/* Website name with map logo as shown in the given image */}
        <div className="flex items-center space-x-1.5 cursor-pointer select-none shrink-0" title="Gram Panchayat Connect - Rajasthan Portal">
          <div className="relative h-20 w-24 flex items-center justify-center p-1 overflow-visible">
            <svg 
              className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,163,115,0.25)] hover:scale-[1.02] transition-transform duration-300" 
              viewBox="0 0 210 170" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Saffron & Sandstone gradient inspired by the Thar Desert and Rajasthani palaces */}
                <linearGradient id="rajasthan-gradient-login" x1="18" y1="18" x2="196" y2="166" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFDFC" />
                  <stop offset="35%" stopColor="#FFF8ED" />
                  <stop offset="70%" stopColor="#FAF1E3" />
                  <stop offset="100%" stopColor="#F5E4C9" />
                </linearGradient>
                
                {/* Subtle royal pattern fill */}
                <pattern id="heritage-dots-login" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="6" cy="6" r="1" fill="#D4A373" opacity="0.25" />
                </pattern>
              </defs>

              {/* Main Geographic State Outline of Rajasthan */}
              <path 
                d="M 105 10 C 111 9, 117 14, 122 11 Q 128 11, 131 18 C 135 22, 128 31, 134 36 C 138 39, 145 34, 150 39 Q 154 44, 146 51 C 151 56, 157 51, 163 56 C 168 59, 172 56, 182 61 C 186 65, 191 67, 196 73 Q 199 77, 189 83 C 186 86, 182 91, 177 90 C 173 94, 178 100, 180 105 C 184 109, 190 111, 189 118 C 187 122, 179 120, 174 122 C 171 126, 166 132, 163 137 C 159 142, 153 150, 149 145 C 145 140, 148 132, 144 128 C 142 124, 137 128, 133 125 C 128 129, 120 131, 116 136 C 112 141, 110 148, 107 156 C 104 161, 102 169, 97 166 C 93 164, 95 156, 93 151 C 89 146, 87 153, 83 150 C 79 145, 74 149, 70 154 C 66 158, 61 154, 59 149 C 58 144, 63 139, 59 134 C 55 130, 49 134, 45 129 C 41 124, 32 127, 27 121 C 23 117, 18 112, 18 107 C 21 102, 28 105, 30 99 C 32 94, 25 89, 23 84 C 19 79, 11 81, 9 76 C 6 71, 14 66, 18 61 C 21 56, 27 58, 32 53 C 36 48, 48 42, 43 38 C 47 34, 55 35, 60 30 C 64 25, 69 22, 76 22 C 81 22, 87 19, 91 14 Z"
                fill="url(#rajasthan-gradient-login)" 
                stroke="#C2410C" 
                strokeWidth="2.5" 
                strokeLinejoin="round"
              />

              {/* Traditional Heritage Micro-pattern Overlay Inside the Map */}
              <path 
                d="M 105 10 C 111 9, 117 14, 122 11 Q 128 11, 131 18 C 135 22, 128 31, 134 36 C 138 39, 145 34, 150 39 Q 154 44, 146 51 C 151 56, 157 51, 163 56 C 168 59, 172 56, 182 61 C 186 65, 191 67, 196 73 Q 199 77, 189 83 C 186 86, 182 91, 177 90 C 173 94, 178 100, 180 105 C 184 109, 190 111, 189 118 C 187 122, 179 120, 174 122 C 171 126, 166 132, 163 137 C 159 142, 153 150, 149 145 C 145 140, 148 132, 144 128 C 142 124, 137 128, 133 125 C 128 129, 120 131, 116 136 C 112 141, 110 148, 107 156 C 104 161, 102 169, 97 166 C 93 164, 95 156, 93 151 C 89 146, 87 153, 83 150 C 79 145, 74 149, 70 154 C 66 158, 61 154, 59 149 C 58 144, 63 139, 59 134 C 55 130, 49 134, 45 129 C 41 124, 32 127, 27 121 C 23 117, 18 112, 18 107 C 21 102, 28 105, 30 99 C 32 94, 25 89, 23 84 C 19 79, 11 81, 9 76 C 6 71, 14 66, 18 61 C 21 56, 27 58, 32 53 C 36 48, 48 42, 43 38 C 47 34, 55 35, 60 30 C 64 25, 69 22, 76 22 C 81 22, 87 19, 91 14 Z"
                fill="url(#heritage-dots-login)" 
                pointerEvents="none"
              />

              {/* Smart Connected Hubs */}
              <circle cx="82" cy="85" r="4" fill="#1565C0" className="animate-pulse" />
              <circle cx="82" cy="85" r="1.5" fill="white" />
              <circle cx="148" cy="68" r="4" fill="#FF9933" />
              <circle cx="148" cy="68" r="1.5" fill="white" />
              <circle cx="132" cy="46" r="3" fill="#2E7D32" />
              
              <line x1="82" y1="85" x2="148" y2="68" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
              <line x1="148" y1="68" x2="132" y2="46" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
              <line x1="82" y1="85" x2="132" y2="46" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />

              {/* Text labels inside the map logo */}
              <g className="select-none pointer-events-none">
                <text 
                  x="108" 
                  y="76" 
                  textAnchor="middle" 
                  fontFamily="Georgia, serif" 
                  fontWeight="900" 
                  fontSize="13.5" 
                  fill="#5D0E23"
                  className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                >
                  {language === AppLanguage.HI ? "ग्राम पंचायत" : "ग्राम पंचायत"}
                </text>
                <text 
                  x="108" 
                  y="93" 
                  textAnchor="middle" 
                  fontFamily="Georgia, serif" 
                  fontWeight="900" 
                  fontSize="13.5" 
                  fill="#5D0E23"
                  className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                >
                  {language === AppLanguage.HI ? "कनेक्ट" : "कनेक्ट"}
                </text>

                <text 
                  x="108" 
                  y="108" 
                  textAnchor="middle" 
                  fontFamily="monospace" 
                  fontWeight="900" 
                  fontSize="7" 
                  fill="#1565C0" 
                  letterSpacing="1.2"
                >
                  GP CONNECT
                </text>
                
                <text 
                  x="108" 
                  y="120" 
                  textAnchor="middle" 
                  fontFamily="sans-serif" 
                  fontWeight="700" 
                  fontSize="5" 
                  fill="#A16207" 
                  letterSpacing="0.8"
                >
                  GOVT. OF RAJASTHAN
                </text>
              </g>
            </svg>
          </div>
          <div className="flex flex-col pl-1 leading-none justify-center">
            <span className="font-display font-black text-2xl tracking-tighter bg-gradient-to-r from-amber-950 via-[#B33D26] to-orange-800 bg-clip-text text-transparent">
              Gram<span className="font-light text-orange-700">Seva</span>
            </span>
            <span className="text-[9px] uppercase font-mono font-extrabold tracking-widest text-[#B33D26] mt-1.5 flex items-center space-x-1">
              <span>RAJASTHAN</span>
              <span className="h-1 w-1 bg-amber-500 rounded-full inline-block animate-pulse"></span>
              <span>PORTAL</span>
            </span>
          </div>
        </div>
        
        {/* Language selector */}
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4 text-slate-400" />
          <div className="flex bg-slate-200/75 rounded-lg p-0.5 border border-slate-300">
            <button
              onClick={() => setLanguage(AppLanguage.EN)}
              className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-semibold transition-all"
              style={{
                backgroundColor: language === AppLanguage.EN ? "#b33d26" : undefined,
                color: language === AppLanguage.EN ? "#ffffff" : undefined
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage(AppLanguage.HI)}
              className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-semibold font-sans transition-all"
              style={{
                backgroundColor: language === AppLanguage.HI ? "#b33d26" : undefined,
                color: language === AppLanguage.HI ? "#ffffff" : undefined
              }}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage(AppLanguage.MW)}
              className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-semibold font-sans transition-all"
              style={{
                backgroundColor: language === AppLanguage.MW ? "#b33d26" : undefined,
                color: language === AppLanguage.MW ? "#ffffff" : undefined
              }}
            >
              मारवाड़ी
            </button>
          </div>
          
          {/* Dark Mode Icon Toggle */}
          <button
            type="button"
            onClick={() => setDarkMode && setDarkMode(!darkMode)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              darkMode
                ? "bg-amber-950/25 border-orange-855/15 text-orange-400 hover:bg-amber-950/45"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
            title={language === AppLanguage.HI ? "डार्क मोड बदलें" : "Toggle Dark Mode"}
          >
            {darkMode ? (
              <Moon className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Container Area */}
      <div className="w-full max-w-md px-4 mt-6 mb-4">
        
        {/* Back Option / Arrow */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={handleBackNavigation}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-350 select-none shadow-xs text-xs font-bold text-slate-800 hover:text-slate-900 transition-all duration-150 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 text-slate-500 hover:text-slate-800 transition" />
            <span>
              {language === AppLanguage.MW ? "पाछो जाओ" : language === AppLanguage.HI ? "पीछे जाएँ" : "Go Back"}
            </span>
          </button>
        </div>

        {/* Dynamic 3-Step Wizard Frame Layout */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-7 space-y-6 relative overflow-hidden">
          
          {/* Progressive Step Progress Header */}
          {((step === 1 && emailSignUpMode) || step === 2 || step === 3) && (
            <div className="space-y-1.5 pb-2 border-b border-slate-100/85 animate-fadeIn">
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-extrabold tracking-widest font-mono text-slate-400">
                <span>
                  {step === 1 && emailSignUpMode && (language === AppLanguage.HI ? "STEP 1 OF 3: SECURE ACCOUNT DETAILS" : "STEP 1 OF 3: SECURE ACCOUNT DETAILS")}
                  {step === 2 && (language === AppLanguage.HI ? "STEP 2 OF 3: RESIDENTS DETAILS" : "STEP 2 OF 3: RESIDENT DETAILS")}
                  {step === 3 && (language === AppLanguage.HI ? "STEP 3 OF 3: RESIDENTS DETAILS" : "STEP 3 OF 3: RESIDENT DETAILS")}
                </span>
                <span className="text-orange-655 font-extrabold" style={{ color: "#E65100" }}>
                  {step === 1 && emailSignUpMode && "33%"}
                  {step === 2 && "66%"}
                  {step === 3 && "100%"}
                </span>
              </div>
              
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    backgroundColor: "#b33d26",
                    width: 
                      step === 1 && emailSignUpMode ? "33%" :
                      step === 2 ? "66%" :
                      step === 3 ? "100%" : "0%"
                  }}
                />
              </div>
            </div>
          )}

          {/* Verification Notification Box */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-start space-x-2 text-xs leading-relaxed animate-shake">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* WIZARD VIEWS */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {emailSignUpMode ? (
                <div className="space-y-5 animate-fadeIn text-left">
                  {/* Return option */}
                  <button
                    type="button"
                    onClick={() => setEmailSignUpMode(false)}
                    className="flex items-center text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer transition"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span>{st.backBtn}</span>
                  </button>

                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-slate-900 font-sans text-md leading-snug">
                      {language === AppLanguage.HI ? "खाता क्रेडेंशियल दर्ज करें" : "Set Secured Credentials"}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                      {language === AppLanguage.HI ? "कृपया अपना ईमेल पता और पासवर्ड दर्ज करें।" : "Enter your email address and password to configure secure portal credentials."}
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Email Address input */}
                    <div className="space-y-1 text-left">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {language === AppLanguage.HI ? "ईमेल आईडी" : "Email Address"} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => {
                            setSignUpEmail(e.target.value);
                            setError(null);
                          }}
                          placeholder="e.g. resident@panchayat.org"
                          className={`w-full bg-slate-50 border text-slate-900 rounded-xl py-2.5 pl-10 pr-9 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-semibold transition-colors ${
                            signUpEmail.length === 0
                              ? "border-slate-200"
                              : isValidEmail(signUpEmail)
                                ? "border-emerald-400 bg-emerald-50/30"
                                : "border-rose-300 bg-rose-50/30"
                          }`}
                        />
                        {signUpEmail.length > 0 && (
                          <span className="absolute right-3 top-2.5">
                            {isValidEmail(signUpEmail)
                              ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              : <AlertCircle className="h-4 w-4 text-rose-400" />
                            }
                          </span>
                        )}
                      </div>
                      {signUpEmail.length > 0 && !isValidEmail(signUpEmail) && (
                        <p className="text-[10px] text-rose-500 font-semibold mt-0.5 pl-1">
                          {language === AppLanguage.HI
                            ? "वैध फ़ॉर्मेट: name@example.com"
                            : "Valid format: name@example.com"}
                        </p>
                      )}
                    </div>

                    {/* Password input */}
                    <div className="space-y-1 text-left">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {language === AppLanguage.HI ? "रहस्य पासवर्ड" : "Security Password"} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={signUpPassword}
                          onChange={(e) => {
                            setSignUpPassword(e.target.value);
                            setError(null);
                          }}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 pl-10 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-mono font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password strength bar + rules checklist */}
                      {signUpPassword.length > 0 && (() => {
                        const rules = getPasswordRules(signUpPassword);
                        const level = getPasswordStrengthLevel(signUpPassword);
                        const barColor = level === "strong" ? "#16a34a" : level === "medium" ? "#d97706" : "#dc2626";
                        const barWidth = level === "strong" ? "100%" : level === "medium" ? "60%" : "25%";
                        const levelLabel = level === "strong"
                          ? (language === AppLanguage.HI ? "मजबूत" : "Strong")
                          : level === "medium"
                            ? (language === AppLanguage.HI ? "मध्यम" : "Medium")
                            : (language === AppLanguage.HI ? "कमजोर" : "Weak");
                        return (
                          <div className="mt-1.5 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-2">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{ width: barWidth, backgroundColor: barColor }}
                                />
                              </div>
                              <span className="text-[10px] font-bold" style={{ color: barColor }}>{levelLabel}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                              {[
                                { ok: rules.minLength, label: language === AppLanguage.HI ? "२ अक्षर न्यूनतम" : "8+ characters" },
                                { ok: rules.hasUpper,  label: language === AppLanguage.HI ? "बड़ा अक्षर (A-Z)" : "Uppercase (A-Z)" },
                                { ok: rules.hasNumber, label: language === AppLanguage.HI ? "अंक (0-9)" : "Number (0-9)" },
                                { ok: rules.hasSpecial,label: language === AppLanguage.HI ? "विशेष चिन्ह (!@#$)" : "Special char (!@#$)" },
                              ].map(({ ok, label }) => (
                                <div key={label} className="flex items-center space-x-1">
                                  <span className={`text-[9px] font-extrabold ${ok ? "text-emerald-500" : "text-slate-300"}`}>{ok ? "✓" : "✗"}</span>
                                  <span className={`text-[9px] font-semibold ${ok ? "text-emerald-700" : "text-slate-400"}`}>{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="button"
                    onClick={handleContinueToStep2}
                    className="w-full text-white font-bold text-xs py-3.5 rounded-xl transition duration-150 shadow-md flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                    style={{ backgroundColor: "#b33d26" }}
                  >
                    <span>{language === AppLanguage.HI ? "क्रेडेंशियल सहेजें और आगे बढ़ें" : "Continue to Profile"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Profile Icon circle */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-orange-50/50 rounded-full border border-orange-100 relative">
                      <div className="bg-white p-3 rounded-full shadow-sm text-orange-600 border border-orange-100">
                        <UserCheck className="h-7 w-7 text-orange-650" />
                      </div>
                    </div>
                  </div>

                  {/* Step 1 Introduction */}
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-slate-900 font-sans text-md leading-snug">
                      {st.welcomeTitle}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                      {st.welcomeDesc}
                    </p>
                  </div>

                  {/* Integration Buttons */}
                  <div className="space-y-3 pt-2">
                    
                    {/* Google Sign In option */}
                    <button
                      type="button"
                      onClick={() => handleSelectVerification("google")}
                      className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs py-3.5 rounded-xl transition duration-150 shadow-xs cursor-pointer flex items-center justify-center space-x-3.5"
                    >
                      {/* Google SVG G logo */}
                      <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48C21.68,11.78 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                          <path d="M12,20.62c2.6,0 4.78,-0.86 6.38,-2.34l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.08,0.98c-2.37,0 -4.38,-1.6 -5.1,-3.75H3.44v2.66C5.03,18.73 8.31,20.62 12,20.62z" fill="#34A853" />
                          <path d="M6.9,12.93c-0.18,-0.54 -0.28,-1.12 -0.28,-1.71s0.1,-1.17 0.28,-1.71V6.85H3.44C2.81,8.11 2.45,9.52 2.45,11.02s0.36,2.91 0.99,4.17L6.9,12.93z" fill="#FBBC05" />
                          <path d="M12,5.38c1.41,0 2.68,0.49 3.68,1.44l2.76,-2.76C16.78,2.51 14.59,1.62 12,1.62C8.31,1.62 5.03,3.51 3.44,6.85l3.46,2.66C7.62,7.36 9.63,5.38 12,5.38z" fill="#EA4335" />
                        </g>
                      </svg>
                      <span>{st.withGoogle}</span>
                    </button>

                    {/* Email address signup option */}
                     <button
                      type="button"
                      onClick={() => handleSelectVerification("email")}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs py-3.5 rounded-xl transition duration-150 shadow-xs cursor-pointer flex items-center justify-center space-x-3.5"
                    >
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span>{st.withEmail}</span>
                    </button>

                  </div>

                  {/* Collapse header */}
                  <div className="pt-2 border-t border-slate-150">
                    <button
                      type="button"
                      onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                      className="w-full flex items-center justify-between py-2 text-[10px] font-bold tracking-wider font-mono text-slate-400 uppercase hover:text-slate-700 cursor-pointer"
                    >
                      <span>{st.demoTitle}</span>
                      {showDemoAccounts ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    {showDemoAccounts && (
                      <div className="grid grid-cols-1 gap-2 mt-3 animate-fadeIn">
                        {DEMO_CREDENTIALS.map((cred) => (
                          <button
                            key={cred.role}
                            type="button"
                            onClick={() => handleQuickBypassLogin(cred)}
                            className="p-3 bg-slate-50 hover:bg-orange-50/50 hover:border-orange-200 text-left rounded-xl border border-slate-200 transition duration-150 flex items-center justify-between cursor-pointer group"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-900">
                                  {language === AppLanguage.MW ? cred.labelMW : (language === AppLanguage.HI ? cred.labelHI : cred.labelEN)}
                                </span>
                                <span className="text-[9px] text-orange-700 bg-orange-50 font-mono font-bold px-1.5 py-0.2 rounded border border-orange-150">
                                  {cred.id}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 group-hover:text-slate-800 leading-relaxed line-clamp-1">
                                {language === AppLanguage.MW ? cred.descMW : (language === AppLanguage.HI ? cred.descHI : cred.descEN)}
                              </p>
                            </div>
                            <Sparkles className="h-4 w-4 text-slate-300 group-hover:text-orange-500 shrink-0 transition" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="text-center space-y-1.5">
                <h3 className="font-bold text-slate-900 font-sans text-md leading-snug">
                  {st.selectRoleTitle}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {st.selectRoleDesc}
                </p>
              </div>

              {/* Three role options explicitly selecting: villager, gram sachiv, sarpanch */}
              <div className="grid grid-cols-1 gap-3">
                
                {/* 1. Villager (Citizen) */}
                <button
                  type="button"
                  onClick={() => handleSelectRole(UserRole.CITIZEN)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 text-left transition duration-150 flex items-start space-x-3.5 cursor-pointer group"
                >
                  <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl border border-sky-100 group-hover:bg-orange-100 group-hover:text-orange-700 transition">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs font-sans">
                      {st.roleVillagerTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {st.roleVillagerDesc}
                    </p>
                  </div>
                </button>

                {/* 2. Gram Sachiv (Official) */}
                <button
                  type="button"
                  onClick={() => handleSelectRole(UserRole.OFFICIAL)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 text-left transition duration-150 flex items-start space-x-3.5 cursor-pointer group"
                >
                  <div className="p-2.5 bg-orange-50 text-orange-750 rounded-xl border border-orange-100 group-hover:bg-orange-100 group-hover:text-orange-700 transition">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs font-sans">
                      {st.roleSachivTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {st.roleSachivDesc}
                    </p>
                  </div>
                </button>

                {/* 3. Sarpanch / Admin */}
                <button
                  type="button"
                  onClick={() => handleSelectRole(UserRole.ADMIN)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 text-left transition duration-150 flex items-start space-x-3.5 cursor-pointer group"
                >
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 group-hover:bg-orange-100 group-hover:text-orange-700 transition">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs font-sans">
                      {st.roleSarpanchTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {st.roleSarpanchDesc}
                    </p>
                  </div>
                </button>

              </div>

              {/* Navigation footer */}
              <button
                type="button"
                onClick={() => {
                  if (emailSignUpMode) {
                    setStep(1); // Goes back to step 1 (which keeps emailSignUpMode = true and displays credentials)
                  } else {
                    setEmailSignUpMode(false);
                    setStep(1);
                  }
                }}
                className="flex items-center text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer transition pt-1.5"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>{st.backBtn}</span>
              </button>

            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn text-left">
              
              {/* Stepper progress headers */}
              <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center flex-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold ${subStep >= 1 ? "bg-orange-700 text-white" : "bg-slate-200 text-slate-500"}`}>1</span>
                    <span className="text-[8px] font-extrabold text-slate-500 mt-1 uppercase">Step 1</span>
                  </div>
                  <div className={`h-0.5 flex-1 mx-2 transition-colors duration-250 ${subStep >= 2 ? "bg-orange-700" : "bg-slate-200"}`} />
                  <div className="flex flex-col items-center flex-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold ${subStep >= 2 ? "bg-orange-700 text-white" : "bg-slate-200 text-slate-500"}`}>2</span>
                    <span className="text-[8px] font-extrabold text-slate-500 mt-1 uppercase">Step 2</span>
                  </div>
                  <div className={`h-0.5 flex-1 mx-2 transition-colors duration-250 ${subStep >= 3 ? "bg-orange-700" : "bg-slate-200"}`} />
                  <div className="flex flex-col items-center flex-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold ${subStep >= 3 ? "bg-orange-700 text-white" : "bg-slate-200 text-slate-500"}`}>3</span>
                    <span className="text-[8px] font-extrabold text-slate-500 mt-1 uppercase">Step 3</span>
                  </div>
                </div>
              </div>

              {subStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-slate-950 font-sans text-xs sm:text-xs">
                      {language === AppLanguage.HI ? "चरण १: सामान्य जानकारी" : language === AppLanguage.MW ? "चरण १: मूल जानकारी सा" : "Step 1: Personal Credentials"}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      {language === AppLanguage.HI ? "कृपया अपना नाम, आयु और मोबाइल दर्ज करें।" : "Enter your full name, age, and valid mobile number."}
                    </p>
                  </div>

                  {/* 1. Name Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {st.fullNameLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. Ramesh Gurjar"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
                    />
                  </div>

                  {/* 2. Age Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {st.ageLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. 35"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
                    />
                  </div>

                  {/* 3. Phone Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {st.phoneLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold select-none">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ""));
                          setError(null);
                        }}
                        placeholder="e.g. 9876543210"
                        className={`w-full bg-slate-50 border text-slate-900 rounded-xl py-2.5 pl-11 pr-9 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-mono font-semibold transition-colors ${
                          phone.length === 0
                            ? "border-slate-200"
                            : isValidIndianPhone(phone)
                              ? "border-emerald-400 bg-emerald-50/30"
                              : "border-rose-300 bg-rose-50/30"
                        }`}
                      />
                      {phone.length > 0 && (
                        <span className="absolute right-3 top-2.5">
                          {isValidIndianPhone(phone)
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            : <AlertCircle className="h-4 w-4 text-rose-400" />
                          }
                        </span>
                      )}
                    </div>
                    {phone.length > 0 && !isValidIndianPhone(phone) && (
                      <p className="text-[10px] text-rose-500 font-semibold mt-0.5 pl-1">
                        {phone.length < 10
                          ? (language === AppLanguage.HI ? `अभी ${phone.length}/10 अंक दर्ज हैं` : `${phone.length}/10 digits entered`)
                          : (language === AppLanguage.HI ? "6, 7, 8 या 9 से शुरू होना चाहिए" : "Must start with 6, 7, 8, or 9")}
                      </p>
                    )}
                  </div>

                  {/* 4. Gender Selector option */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {language === AppLanguage.HI ? "लिंग" : "Gender"} <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Male", "Female", "Other"].map((gen) => {
                        const label = gen === "Male" 
                          ? (language === AppLanguage.HI ? "पुरुष" : "Male")
                          : gen === "Female"
                            ? (language === AppLanguage.HI ? "महिला" : "Female")
                            : (language === AppLanguage.HI ? "अन्य" : "Other");
                        return (
                          <button
                            key={gen}
                            type="button"
                            onClick={() => {
                              setGender(gen);
                              setError(null);
                            }}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                              gender === gen
                                ? "bg-orange-50 border-orange-500 text-orange-700 font-extrabold ring-1 ring-orange-400"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Basic Info & Send OTP */}
                  <button
                    type="button"
                    onClick={handleNextToOtp}
                    className="w-full text-white font-bold text-xs py-3.5 rounded-xl transition duration-150 shadow-sm flex items-center justify-center space-x-2 mt-2"
                    style={{ backgroundColor: "#b33d26" }}
                  >
                    <span>{language === AppLanguage.HI ? "ओटीपी भेजें और आगे बढ़ें" : "Send OTP & Proceed"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                </div>
              )}

              {subStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-slate-950 font-sans text-xs">
                      {language === AppLanguage.HI ? "चरण २: ओटीपी कोड सत्यापित करें" : "Step 2: Enter Verification OTP"}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      {language === AppLanguage.HI ? `हमने +91 ${phone} पर सत्यापन कोड भेजा है।` : `Validation code dispatched toward registered +91 ${phone}`}
                    </p>
                  </div>

                  <div className="space-y-2 border border-slate-100 bg-slate-50 p-3 rounded-2xl">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                      {st.otpLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        maxLength={4}
                        disabled={otpVerified}
                        value={otpInput}
                        onChange={(e) => {
                          setOtpInput(e.target.value.replace(/\D/g, ""));
                          setError(null);
                        }}
                        placeholder="••••"
                        className="flex-1 bg-white border border-slate-350 text-center text-slate-900 rounded-xl py-2 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-orange-500 tracking-widest font-mono disabled:opacity-70 disabled:bg-slate-100"
                      />
                      {!otpVerified ? (
                        <button
                          type="button"
                          onClick={() => {
                            handleVerifyOtp();
                          }}
                          className="bg-orange-650 hover:bg-orange-700 text-white text-xs font-bold px-4 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                        >
                          {st.verifyOtpBtn}
                        </button>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 flex items-center rounded-xl border border-emerald-200 select-none shrink-0 font-semibold">
                          {st.otpSuccess}
                        </span>
                      )}
                    </div>

                    {/* OTP Sent Status */}
                    {!otpVerified && generatedOtp && (
                      <div className="mt-2.5 space-y-2">
                        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-emerald-800">
                              {language === AppLanguage.HI
                                ? "OTP भेज दिया गया"
                                : language === AppLanguage.MW
                                  ? "OTP भेजियो गयो सा"
                                  : "OTP sent successfully"}
                            </p>
                            <p className="text-[9px] text-emerald-600 truncate">+91 {phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 px-0.5">
                          <span className="text-slate-400">
                            {language === AppLanguage.HI ? "5 मिनट में अवैध होगा" : "Expires in 5 minutes"}
                          </span>
                          {otpResendCountdown > 0 ? (
                            <span className="text-slate-400 font-mono">{language === AppLanguage.HI ? `दोबारा भेजें ${otpResendCountdown}s` : `Resend in ${otpResendCountdown}s`}</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const otp = generateOtp();
                                setGeneratedOtp(otp);
                                setOtpInput("");
                                setOtpResendCountdown(30);
                              }}
                              className="text-orange-700 font-bold hover:underline cursor-pointer"
                            >
                              {language === AppLanguage.HI ? "ओटीपी पुन: भेजें" : "Resend OTP"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setOtpSent(false);
                        setOtpInput("");
                        setSubStep(1);
                      }}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold py-3.5 rounded-xl transition cursor-pointer"
                    >
                      {language === AppLanguage.HI ? "विवरण बदलें" : "Edit Phone"}
                    </button>
                    <button
                      type="button"
                      disabled={!otpVerified}
                      onClick={() => {
                        setError(null);
                        setStep3OtpVerified(true);
                        setSubStep(3);
                      }}
                      className="flex-1 text-white font-bold text-xs py-3.5 rounded-xl transition duration-150 shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
                      style={{ backgroundColor: otpVerified ? "#b33d26" : undefined }}
                    >
                      <span>{language === AppLanguage.HI ? "स्थान चुनें" : "Select Location"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              )}

              {subStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-slate-950 font-sans text-xs">
                      {language === AppLanguage.HI ? "चरण ३: पंचायत क्षेत्राधिकारी मिलान एवं प्रोफाइल विवरण" : "Step 3: Profile Verification & Panchayat Area Matching"}
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      {language === AppLanguage.HI ? "कृपया अपना नाम, आयु, आधार, लिंग और राजस्थान क्षेत्र जिला/ ग्राम पंचायत दर्ज करें।" : "Enter your name, age, Aadhaar, gender and select block district/village."}
                    </p>
                  </div>

                  {/* 1. Full Name Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {st.fullNameLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. Ramesh Gurjar"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-semibold"
                    />
                  </div>

                  {/* 2. Age Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {st.ageLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. 35"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 3. Gender Dropdown */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {language === AppLanguage.HI ? "लिंग" : "Gender"} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                          setError(null);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
                      >
                        <option value="">{language === AppLanguage.HI ? "-- चुनें --" : "-- Select --"}</option>
                        <option value="Male">{language === AppLanguage.HI ? "पुरुष (Male)" : "Male"}</option>
                        <option value="Female">{language === AppLanguage.HI ? "महिला (Female)" : "Female"}</option>
                        <option value="Other">{language === AppLanguage.HI ? "अन्य (Other)" : "Other"}</option>
                      </select>
                    </div>

                    {/* 4. Aadhaar Card Number Input */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {language === AppLanguage.HI ? "आधार संख्या" : "Aadhaar Card"} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={aadhaarCard}
                        onChange={(e) => {
                          setAadhaarCard(e.target.value.replace(/\D/g, ""));
                          setError(null);
                        }}
                        placeholder="12-digit Aadhaar"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-mono font-bold tracking-wider"
                      />
                    </div>
                  </div>

                  {/* Step 3 Phone Number & OTP Verification option */}
                  <div className="space-y-2.5 border border-slate-100 bg-slate-50/55 p-3 rounded-2xl">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {language === AppLanguage.HI ? "मोबाइल नंबर" : "Phone Number"} <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold select-none">+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value.replace(/\D/g, ""));
                              setStep3OtpVerified(false);
                              setStep3OtpSent(false);
                              setStep3OtpInput("");
                              setError(null);
                            }}
                            placeholder="e.g. 9876543210"
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-mono font-semibold"
                          />
                        </div>
                        {!step3OtpVerified ? (
                          <button
                            type="button"
                            onClick={handleSendStep3Otp}
                            className="bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-bold px-3 rounded-xl border border-orange-200 transition-colors shrink-0 cursor-pointer"
                          >
                            {step3OtpSent ? (language === AppLanguage.HI ? "फिर भेजें" : "Resend") : (language === AppLanguage.HI ? "ओटीपी भेजें" : "Send OTP")}
                          </button>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 flex items-center rounded-xl border border-emerald-200 select-none shrink-0">
                            ✓ {language === AppLanguage.HI ? "सत्यापित" : "Verified"}
                          </span>
                        )}
                      </div>
                    </div>

                    {step3OtpSent && !step3OtpVerified && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/50 animate-fadeIn">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                          {language === AppLanguage.HI ? "४-अंकीय सत्यापन कोड" : "4-Digit OTP Code"} <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={step3OtpInput}
                            onChange={(e) => {
                              setStep3OtpInput(e.target.value.replace(/\D/g, ""));
                              setError(null);
                            }}
                            placeholder="••••"
                            className="flex-1 bg-white border border-slate-200 text-center text-slate-950 rounded-xl py-2 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-orange-500 tracking-widest font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyStep3Otp}
                            className="bg-orange-650 hover:bg-orange-700 text-white text-xs font-bold px-4 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                          >
                            {language === AppLanguage.HI ? "प्रमाणित करें" : "Verify Code"}
                          </button>
                        </div>
                        {/* OTP Sent Status - step 3 */}
                        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 mt-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-emerald-800">
                              {language === AppLanguage.HI ? "OTP भेज दिया गया" : "OTP sent successfully"}
                            </p>
                            <p className="text-[9px] text-emerald-600">+91 {phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-500 px-0.5 mt-1.5">
                          <span className="text-slate-400">{language === AppLanguage.HI ? "5 मिनट में अवैध" : "Expires in 5 min"}</span>
                          {step3OtpResendCountdown > 0 ? (
                            <span className="text-slate-400 font-mono">{language === AppLanguage.HI ? `दोबारा भेजें ${step3OtpResendCountdown}s` : `Resend in ${step3OtpResendCountdown}s`}</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const otp = generateOtp();
                                setStep3GeneratedOtp(otp);
                                setStep3OtpInput("");
                                setStep3OtpResendCountdown(30);
                              }}
                              className="text-orange-700 font-bold hover:underline cursor-pointer"
                            >
                              {language === AppLanguage.HI ? "पुन: भेजें" : "Resend"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. Searchable dropdown field for District */}
                  <SearchableCombobox
                    label={st.districtLabel}
                    options={RAJASTHAN_DISTRICTS}
                    value={district}
                    onChange={(val) => {
                      setDistrict(val);
                      setVillageName(""); // Reset village name strictly
                      setError(null);
                    }}
                    placeholder={language === AppLanguage.HI ? "सर्च करने के लिए जिला टाइप करें..." : "Type to filter Rajasthan districts..."}
                    required
                  />

                  {/* 6. Searchable dropdown field for Village, disabled until district select */}
                  <SearchableCombobox
                    label={st.villageLabel}
                    options={district ? getVillagesForDistrict(district) : []}
                    value={villageName}
                    onChange={(val) => {
                      setVillageName(val);
                      setError(null);
                    }}
                    placeholder={
                      !district 
                        ? (language === AppLanguage.HI ? "कृपया पहले ऊपर जिला चुनें..." : "Please select district first...")
                        : (language === AppLanguage.HI ? "सर्च करने के लिए ग्राम टाइप करें..." : "Type to filter verified villages...")
                    }
                    disabled={!district}
                    required
                  />

                  {/* 6. Official ID (Shown only for Gram Sachiv / Sarpanch admins) */}
                  {(selectedRole === UserRole.OFFICIAL || selectedRole === UserRole.ADMIN) && (
                    <div className="space-y-1 border-t border-slate-100 pt-3.5 mt-1.5 animate-fadeIn">
                      <label className="block text-xs font-bold text-orange-750 uppercase tracking-wide flex items-center space-x-1">
                        <span>{st.officialIdLabel}</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={officialId}
                        onChange={(e) => {
                          setOfficialId(e.target.value);
                          setError(null);
                        }}
                        placeholder={selectedRole === UserRole.OFFICIAL ? "e.g. SEC-9481-JAI" : "e.g. SARON-502-JPR"}
                        className="w-full bg-orange-50/25 border border-orange-200 text-slate-900 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-mono font-semibold"
                      />
                    </div>
                  )}

                  {/* Execution Verification and Submit button */}
                  <button
                    type="button"
                    onClick={handleCompleteRegistration}
                    disabled={isLoading}
                    className="w-full text-white font-bold text-xs py-4 rounded-xl transition duration-150 shadow-sm cursor-pointer flex items-center justify-center space-x-2 mt-4"
                    style={{ backgroundColor: "#b33d26" }}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>{language === AppLanguage.MW ? "जांच हो रही है सा..." : language === AppLanguage.HI ? "सत्यापित किया जा रहा है..." : "Panchayat mapping..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{st.finishBtn}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                </div>
              )}

              {/* Navigation Back Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-150/50">
                <button
                  type="button"
                  onClick={handleSubStepBack}
                  className="flex items-center text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer transition"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span>{st.backBtn}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Footer nic disclaimer */}
      <div className="text-center text-[10px] text-slate-400 font-mono space-y-1">
        <p>© 2026 NIC Rajasthan Local Self-Gov & Panchayati Raj Dept.</p>
      </div>

      {showSuccessModal && savedSuccessUser && (
        <div className="fixed inset-0 z-[100] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100 animate-scaleUp space-y-4 relative">
            {/* Success Visual Banner Ring */}
            <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="h-9 w-9 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-950 font-sans">
                {st.successTitle}
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal">
                {st.successDesc}
              </p>
            </div>

            {/* Profile Detail Badge */}
            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-left space-y-2 text-[11px]">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-450 font-bold uppercase text-[9px] tracking-wide">
                  {st.successName}
                </span>
                <span className="text-slate-900 font-bold">{savedSuccessUser.name}</span>
              </div>
              <div className="flex justify-between items-start pb-1.5 border-b border-slate-100">
                <span className="text-slate-450 font-bold uppercase text-[9px] tracking-wide mt-0.5 whitespace-nowrap">
                  {st.successDesignation}
                </span>
                <span className="text-slate-800 font-semibold text-right">
                  {savedSuccessUser.designation}
                </span>
              </div>
              <div className="flex justify-between items-start pb-1.5 border-b border-slate-100">
                <span className="text-slate-450 font-bold uppercase text-[9px] tracking-wide mt-0.5 whitespace-nowrap">
                  {st.successLocation}
                </span>
                <span className="text-slate-800 font-bold text-right">
                  {district} • {villageName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-450 font-bold uppercase text-[9px] tracking-wide">
                  {st.successPhone}
                </span>
                <span className="text-slate-900 font-mono font-bold">
                  +91 {phone}
                </span>
              </div>
            </div>

            {/* CTA to portal */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onLoginSuccess(savedSuccessUser);
              }}
              className="w-full text-white font-bold text-xs py-3 rounded-xl transition shadow-md hover:opacity-90 flex items-center justify-center space-x-1.5 cursor-pointer"
              style={{ backgroundColor: "#b33d26" }}
            >
              <span>{st.successProceed}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
