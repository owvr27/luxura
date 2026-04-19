export const en = {
  common: {
    appName: 'GreenBin',
    languageToggle: 'AR',
    currentLanguage: 'English',
    comingSoon: 'More translated screens can plug into this structure next.',
    getStarted: 'Get Started',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    continue: 'Continue',
    loading: 'Loading...',
    points: 'points',
    tryAgain: 'Try Again',
  },
  navigation: {
    onboarding: 'Welcome',
    login: 'Login',
    register: 'Create Account',
    home: 'Home',
    profile: 'Profile',
    history: 'History',
    verify: 'Verify',
    map: 'Map',
    help: 'Help / Smart Assistant',
  },
  screens: {
    splash: {
      title: 'GreenBin',
      description:
        'A clean graduation-project demo for recycling awareness, verification, and smart-bin discovery.',
      badge: 'Eco-friendly demo',
      action: 'Continue',
    },
    onboarding: {
      title: 'Build greener habits every day',
      description:
        'Learn how rewards, waste sorting, and cleaner surroundings work together to make recycling simple and meaningful.',
      heroEyebrow: 'GreenBin Awareness',
      rewardTitle: 'Rewards that build good habits',
      rewardBody:
        'Points and rewards give people a reason to recycle consistently. Small incentives turn everyday actions into lasting environmental routines.',
      rewardPointOne: 'Rewards make recycling feel visible and motivating.',
      rewardPointTwo: 'Consistent habits lead to cleaner neighborhoods over time.',
      classificationTitle: 'Know your waste classification',
      classificationBody:
        'Sorting waste correctly helps recyclable materials stay useful and keeps harmful waste away from regular disposal streams.',
      classificationPointOne: 'Organic waste includes food scraps and garden materials.',
      classificationPointTwo: 'Recyclables include paper, plastic, glass, and metal when clean.',
      classificationPointThree: 'Hazardous waste needs special handling to protect people and nature.',
      cleanlinessTitle: 'Clean spaces protect the environment',
      cleanlinessBody:
        'Keeping streets, homes, and public bins clean reduces pollution, protects wildlife, and supports healthier communities.',
      cleanlinessPointOne: 'Cleaner surroundings reduce odors, pests, and visual pollution.',
      cleanlinessPointTwo: 'Responsible disposal helps keep soil and water safer.',
    },
    login: {
      title: 'Welcome back',
      description:
        'Sign in with your email and password to continue your recycling journey.',
      badge: 'Simple login',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      submit: 'Login',
      helper:
        'No real backend yet. Login checks only the account you registered inside the app.',
      noAccount: "Don't have an account?",
      createAccountLink: 'Create one here',
      success: 'Mock login succeeded. You can continue to the app.',
      accountNotFound: 'No registered account was found for this email.',
      wrongPassword: 'The password is incorrect for this account.',
      continueToHome: 'Go to Home',
      submitting: 'Signing you in...',
    },
    register: {
      title: 'Create your GreenBin account',
      description:
        'Start with a simple account so you can join rewards, awareness challenges, and cleaner habits.',
      badge: 'Beginner-friendly setup',
      fullNamePlaceholder: 'Enter your full name',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Create a password',
      confirmPasswordPlaceholder: 'Confirm your password',
      submit: 'Create Account',
      helper: 'This registration is local only for now and does not connect to a server.',
      haveAccount: 'Already have an account?',
      loginLink: 'Go to login',
      success: 'Mock account created successfully.',
      accountExists: 'An account with this email already exists in the app.',
      continueToLogin: 'Continue to Login',
      submitting: 'Creating your account...',
    },
    home: {
      title: 'Smart recycling overview',
      description:
        'This home screen gives the user a clean awareness-focused overview of how the GreenBin system works, why it matters, and how recycling supports healthier communities.',
      badge: 'Educational dashboard',
      welcomeTitle: 'Welcome back',
      summaryPoints: 'Total points earned',
      summaryHistory: 'Successful verifications',
      overviewTitle: 'What this app helps you do',
      overviewBody:
        'GreenBin combines awareness, verification, and location guidance in one place. Instead of crowding the main screen with navigation buttons, the home experience now focuses on explaining the project clearly so it is easier to present, understand, and use during a graduation demo.',
      systemBadge: 'Section 1',
      systemTitle: 'How the smart recycling system works',
      systemBody:
        'The user starts by placing waste inside a smart bin. The system then identifies the material type, such as plastic, metal, or paper, and measures the weight of the waste to understand the value of the recycling action more accurately. After that, the smart bin or connected system generates a QR code or a manual code for the user. The user opens the app, goes to the Verify screen, and either scans the QR code or enters the manual code. Once the code is accepted, the recycling action is confirmed and points are awarded based on the material type and the measured weight. This workflow helps connect physical recycling behavior with a clear digital reward experience.',
      systemPointOne:
        'Material recognition and weight measurement make the verification flow feel more realistic and useful.',
      systemPointTwo:
        'QR and manual codes give users two simple ways to complete the recycling process in the app.',
      systemPointThree:
        'Points create motivation and make environmental action visible, trackable, and rewarding.',
      cleanlinessBadge: 'Section 2',
      cleanlinessTitle: 'Environmental cleanliness and public health',
      cleanlinessBody:
        'Clean environments matter because waste that stays in streets, public spaces, and collection areas can quickly become a source of pollution. When waste builds up, it creates unpleasant smells, visual pollution, and a poor public image for neighborhoods and cities. More importantly, unmanaged waste can attract insects and pests, spread bacteria, and increase health risks for nearby residents. Cleaner streets and better waste collection systems support safer daily life, reduce exposure to harmful materials, and help communities feel more organized and healthy. Smart waste collection improves this process by encouraging proper disposal and making collection more efficient.',
      cleanlinessPointOne:
        'Reducing waste buildup helps lower bad smells, visual pollution, and discomfort in public spaces.',
      cleanlinessPointTwo:
        'Cleaner collection points can reduce pest activity and support better public health conditions.',
      cleanlinessPointThree:
        'Smart waste systems help cities manage cleanliness in a more organized and sustainable way.',
      recyclingBadge: 'Section 3',
      recyclingTitle: 'Why recycling matters for sustainability',
      recyclingBody:
        'Recycling plastic, metal, and paper is important because these materials still have value after their first use. Plastic is especially dangerous when it is ignored because it does not decompose easily and can remain in the environment for a very long time. Recycling reduces the amount of waste sent to landfills, protects natural resources, and lowers the loss of useful materials that can be processed again. It can also support the economy by creating value from collected waste, encouraging sorting systems, and reducing pressure on raw resource extraction. In the long term, recycling supports sustainability by helping communities use materials more responsibly instead of treating everything as disposable waste.',
      recyclingPointOne:
        'Plastic needs special attention because it stays in the environment for long periods if not managed well.',
      recyclingPointTwo:
        'Recycling saves useful materials and protects resources such as energy, paper sources, and metals.',
      recyclingPointThree:
        'A strong recycling culture supports sustainability, awareness, and circular economic value.',
    },
    verify: {
      title: 'Verify with QR code',
      description:
        'Point your camera at one of the supported GreenBin mock QR codes to test the verification flow.',
      helper:
        'Supported QR values: QR-PLA-10, QR-MET-20, and QR-PAP-15.',
      manualTitle: 'Manual code verification',
      manualDescription:
        'You can also type a code manually when scanning is not available during the demo.',
      manualPlaceholder: 'Enter manual verification code',
      manualSubmit: 'Verify Manual Code',
      manualHelper:
        'Supported manual codes: P1A2K, M4T9Q, and R7P3L.',
      requestPermission: 'Allow Camera Access',
      permissionTitle: 'Camera permission is needed',
      permissionDescription:
        'The QR scanner needs camera access before it can scan a code.',
      readyLabel: 'Scanner ready',
      scanningLabel: 'Align the QR code inside the frame',
      scanAgain: 'Scan Another Code',
      successTitle: 'Verification successful',
      invalidTitle: 'Invalid code',
      successMessage:
        'The scanned or entered code matches the mock verification dataset. This successful action is now saved in your local history.',
      invalidMessage:
        'This code is not recognized. Use one of the supported QR values or manual codes for this demo.',
      scannedValueLabel: 'Scanned value',
      historySaved: 'This successful verification has been added to your local history.',
      materialLabel: 'Material type',
      materials: {
        plastic: 'Plastic',
        metal: 'Metal',
        paper: 'Paper',
      },
      pointsEarnedLabel: 'Points earned',
      relatedBinLabel: 'Related bin',
      openHistory: 'View History',
      savingHistory: 'Saving verification to local history...',
      manualSubmitting: 'Checking manual code...',
    },
    map: {
      title: 'Smart bin map',
      description:
        'This screen uses a real map with your current location and mock smart-bin markers.',
      helper:
        'In Expo Go, Android uses Google Maps behavior, while iOS uses Apple Maps unless you later add Google Maps native setup in a custom build.',
      nearestTitle: 'Nearest smart bin',
      distanceLabel: 'Distance',
      loading: 'Getting your current location...',
      permissionDescription:
        'Allow location access to calculate the nearest smart bin from your real position.',
      retryLocation: 'Try Location Again',
      locationUnavailable:
        'We could not read your location right now. Please check device location settings and try again.',
      nearestMarkerLabel: 'Nearest smart bin',
      smartBinMarkerLabel: 'Smart bin marker',
      allLocationsTitle: 'All smart bin locations',
      allLocationsDescription:
        'Open this list to review all available mock smart-bin locations across Egypt without hiding the map.',
      showLocations: 'Show Locations',
      hideLocations: 'Hide Locations',
      legendTitle: 'How this works',
      legendBody:
        'Green markers show mock smart-bin locations. The highlighted marker is the nearest bin based on your current device location.',
    },
    history: {
      title: 'Verification history',
      description:
        'Review previous successful verification actions stored locally on this device.',
      emptyTitle: 'No history yet',
      emptyBody:
        'Successful verification actions will appear here after you scan a valid QR code or verify a valid manual code.',
      pointsLabel: 'points',
      methodLabel: 'Method',
      methodQr: 'QR scan',
      methodManual: 'Manual code',
      materialLabel: 'Material',
      binLabel: 'Related bin',
      codeLabel: 'Scanned code',
      emptyAction: 'Open Verify Screen',
    },
    profile: {
      title: 'My profile',
      description:
        'Review your account details, total points, and simple profile information stored on this device.',
      userNameLabel: 'User name',
      emailLabel: 'Email',
      totalPointsLabel: 'Total points',
      editTitle: 'Edit profile',
      fullNamePlaceholder: 'Update your full name',
      saveButton: 'Save Changes',
      saveSuccess: 'Your profile was updated successfully.',
      logoutButton: 'Logout',
      saving: 'Saving your profile...',
      loggingOut: 'Logging out...',
      securityTitle: 'Local app lock',
      securityDescription:
        'You can optionally protect the app with a simple 4-digit PIN. When the app is reopened after going to the background, the user will need to enter the saved PIN before returning to the drawer screens.',
      securityStatusLabel: 'Current status',
      securityEnabled: 'PIN lock is enabled',
      securityDisabled: 'PIN lock is disabled',
      securityHint: 'A local PIN is already configured for this device.',
      pinLabel: '4-digit PIN',
      pinPlaceholder: 'Enter 4 digits',
      pinConfirmLabel: 'Confirm PIN',
      pinConfirmPlaceholder: 'Re-enter the same 4 digits',
      pinValidation: 'Please enter a 4-digit PIN.',
      pinMismatch: 'The PIN and confirmation do not match.',
      pinSaved: 'Local app lock has been enabled successfully.',
      pinDisabled: 'Local app lock has been turned off successfully.',
      securitySaving: 'Saving security settings...',
      enablePinButton: 'Enable PIN Lock',
      disablePinButton: 'Disable PIN Lock',
    },
    help: {
      badge: 'Built-in assistant',
      title: 'Help / Smart Assistant',
      description:
        'This screen works like a simple built-in smart assistant conversation. Choose questions below and continue the chat without leaving the same screen.',
      greeting: 'Hello, how can I help you today?',
      assistantTitle: 'How can I help you today?',
      assistantBody:
        'Choose one of the guided questions below. Each question will be added to the conversation and answered inside the same chat thread.',
      followUpPrompt: 'I am ready to help with another question. Please choose one of the options below.',
      choicePrompt: 'Choose a question',
      askAnotherQuestion: 'Ask Another Question',
      showQuestionsAgain: 'Show Question Choices Again',
      questions: {
        recycle: {
          question: 'What is recycling?',
          answer:
            'Recycling is the process of collecting used materials such as plastic, paper, and metal, then preparing them so they can be used again instead of being thrown away permanently. This reduces waste, helps protect natural resources, and encourages a more responsible way of dealing with daily consumption. In the context of GreenBin, recycling is not only an environmental action but also a measurable activity that can be verified and rewarded through the app.',
        },
        code: {
          question: 'How do I use the code?',
          answer:
            'After the user places waste in the smart bin, the system can generate a QR code or a manual code to represent that recycling action. The user then opens the Verify screen in the app and either scans the QR code or types the manual code into the verification form. If the code is valid, the app confirms the action, shows a success message, and saves the result to the local history screen with its related details.',
        },
        points: {
          question: 'How are points calculated?',
          answer:
            'In this demo, points are calculated with local mock logic so the experience stays simple and Expo-compatible. The idea behind the system is that points should reflect the value of the recycling action based on the material type and the measured weight. For example, heavier or more valuable recyclable materials could earn more points than lighter or less useful items. Even though the current app uses mock values, the user experience already demonstrates how rewards can be linked to real environmental behavior.',
        },
        plastic: {
          question: 'Why is plastic dangerous for the environment?',
          answer:
            'Plastic is dangerous because it does not decompose easily and can remain in the environment for many years. When it accumulates in streets, waterways, or open land, it contributes to pollution and can harm animals, ecosystems, and the visual quality of public spaces. Poorly managed plastic waste also increases the burden on cities and makes cleanup more difficult. That is why sorting and recycling plastic correctly is an important part of sustainable waste management.',
        },
        classification: {
          question: 'Why is waste classification important?',
          answer:
            'Waste classification is important because not all waste should be handled in the same way. When recyclable materials are separated correctly from organic or harmful waste, they stay cleaner and become easier to process again. Good classification improves efficiency, reduces contamination, and helps smart systems produce more accurate results when identifying material type. In a project like GreenBin, classification is also important because it supports fairer verification and better reward logic.',
        },
        map: {
          question: 'How do I use the map?',
          answer:
            'The map screen uses your current device location and displays smart bin markers on a real map. It also calculates the nearest bin and highlights it clearly so the user can understand where to go next. This makes the app more practical because it connects awareness and verification with actual physical locations. In a graduation project demo, the map helps explain how users can move from learning about recycling to finding the nearest smart collection point.',
        },
        methods: {
          question: 'What is the difference between QR verification and manual code verification?',
          answer:
            'QR verification is designed for speed and convenience because the user simply scans the code using the camera. Manual code verification is a fallback option that allows the same recycling action to be confirmed when scanning is not possible, such as during testing or in limited camera situations. Both methods lead to the same result when the code is valid: the app confirms the action, awards points, and saves the record to history. The difference is mainly in how the user enters the code.',
        },
        invalidCode: {
          question: 'What should I do if the code does not work?',
          answer:
            'If the code does not work, the first step is to check that it was entered correctly or that the QR code was scanned clearly. For demo testing, the app currently expects specific mock code patterns, so an unknown value will show an error message. The user can try scanning again, re-entering the code carefully, or using the other verification method if available. This behavior helps explain how a real system would guide the user when a verification attempt fails.',
        },
        cleanliness: {
          question: 'How does this app help environmental cleanliness?',
          answer:
            'The app helps environmental cleanliness by encouraging better waste behavior through education, verification, and motivation. It explains why clean surroundings matter, gives users a reason to classify waste properly, and connects recycling actions to visible rewards. It also helps users find smart bins and keep a history of successful actions. Together, these features support cleaner public areas, better waste awareness, and stronger participation in responsible disposal habits.',
        },
        smartCities: {
          question: 'Why is this project important for smart cities in Egypt?',
          answer:
            'This project is important for smart cities in Egypt because it combines awareness, digital verification, reward thinking, and location-based services in one simple experience. Smart cities need practical systems that help residents participate in cleaner and more organized public life, not just infrastructure alone. GreenBin shows how a local recycling workflow could be tracked, encouraged, and presented in a way that supports sustainability, citizen engagement, and modern urban development goals. It also makes the concept easy to explain in an academic or graduation setting.',
        },
      },
    },
    pinLock: {
      badge: 'Local security',
      title: 'Unlock GreenBin',
      description:
        'This device has a local app lock enabled. Enter the saved 4-digit PIN to continue to the drawer screens.',
      pinLabel: 'PIN code',
      pinPlaceholder: 'Enter your PIN',
      pinValidation: 'Please enter your 4-digit PIN.',
      invalidPin: 'The PIN is incorrect. Please try again.',
      unlockButton: 'Unlock App',
      unlocking: 'Unlocking...',
    },
  },
  validation: {
    required: 'This field is required.',
    invalidEmail: 'Please enter a valid email address.',
    passwordShort: 'Password must be at least 6 characters.',
    nameShort: 'Name must be at least 2 characters.',
    passwordMismatch: 'Passwords do not match.',
  },
};
