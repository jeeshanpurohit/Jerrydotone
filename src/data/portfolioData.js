/**
 * Jeeshan Purohit Portfolio Master Dataset
 * Extracted from ATS Resume, CV, and Project Archives
 */

export const personalInfo = {
  name: "JEESHAN PUROHIT",
  displayName: "Jeeshan Purohit",
  role: "MULTIDISCIPLINARY VISUAL DESIGNER // CREATIVE TECHNOLOGIST",
  subRole: "Sr. Associate, Marketing @ Metronix | B.Tech CSE | Founder, OCULUS JIET",
  status: "AVAILABLE FOR SELECT PROJECTS • SPECIALTY: BRAND IDENTITY, MOTION & UI/UX",
  email: "jeeshan233p@gmail.com",
  phone: "+91-9413564618",
  location: "Jaipur / Jodhpur, Rajasthan, India",
  behance: "https://behance.net/Jeeshanpurohit",
  linkedin: "https://linkedin.com/in/jeeshanpurohit",
  github: "https://github.com/jeeshanpurohit",
  instagram: "https://instagram.com/jeeshan.one",
  resumePdf: "/assets/Jeeshan_Purohit_Resume_ATS.pdf",
  cvPdf: "/assets/Jeeshan_Purohit_CV_ATS.pdf",
  photo: "/assets/my_website_face.png",
  maskImage: "/assets/my_website_spidey.png",
  faceHeroImage: "/assets/my_website_face.png",
  spideyHeroImage: "/assets/my_website_spidey.png",
  bioHeadline: "Multidisciplinary Visual Designer with a B.Tech. in Computer Science and Engineering, passionate about blending creativity and technology.",
  bioFull: [
    "I'm a multidisciplinary Visual Designer with a B.Tech. in Computer Science and Engineering from JIET Jodhpur (7 CGPA), passionate about blending creativity and technology. My work spans graphic design, motion graphics, video editing, photography, videography, and 2D animation, with deep explorations into UI/UX architecture and creative direction.",
    "I founded my college's official Photography Club (OCULUS JIET), awarded Best Club of the Year (2023-2024), reflecting my drive to build creative communities and lead cross-functional creative squads.",
    "From spearheading brand identity and content infrastructure at Metronix Entertainment LLP to developing 2D animations and scientific simulations for IIT Roorkee Virtual Labs, I bring a strong sense of storytelling, bold visuals, and engineering precision to every project."
  ]
};

export const coreMetrics = [
  { label: "EXPERIENCE", value: "04+ YEARS", sub: "Design, Motion & Tech" },
  { label: "ORGANIZATIONS", value: "09+ TEAMS", sub: "Corporate & Flagship Events" },
  { label: "ACCOLADES", value: "08+ HONORS", sub: "Awards & Certifications" },
  { label: "CORE TOOLKIT", value: "ADOBE + FIGMA", sub: "Motion, 2D & UI/UX" }
];

export const brandIdentities = {
  main: {
    name: "Jerrydotone",
    slug: "jerrydotone",
    discipline: "UX Case Studies & Personal Brand",
    role: "Brand Strategy, Content & Portfolio",
    logo: "/assets/logos/Jerrydotone.svg",
    description: "Brand building, marketing strategies, UX case studies, original content, and the personal portfolio monolith.",
    category: "web",
    badgeColor: "var(--primary)"
  },
  photography: {
    name: "jerrydotdng",
    slug: "jerrydotdng",
    discipline: "Photography // Visual Capture & RAW Curation",
    role: "Visual Capture & Street Curation",
    logo: "/assets/logos/Jerrydotdng.svg",
    description: "Visual documentation, street narratives, architectural geometry, and conclave moments captured in high-fidelity RAW DNG format.",
    category: "photography",
    badgeColor: "var(--secondary)"
  },
  video: {
    name: "Jerrydotmov",
    slug: "jerrydotmov",
    discipline: "Video Editing // Cinema & Motion Direction",
    role: "Cinema & 60fps Motion Direction",
    logo: "/assets/logos/Jerrydotmov.svg",
    description: "High-octane commercial after-movies, festival promo reels, audio synchronization, and 60fps kinetic motion graphics.",
    category: "motion",
    badgeColor: "var(--tertiary)"
  },
  graphicDesign: {
    name: "Jerrydotart",
    slug: "jerrydotart",
    discipline: "Graphic Design // Brand Identity & Vectors",
    role: "Brand Identity & Graphic Design",
    logo: "/assets/logos/Jerrydotart.svg",
    description: "Typography systems, brand equity frameworks, vector identity books, and comprehensive visual collateral.",
    category: "brand",
    badgeColor: "var(--accent)"
  }
};

export const personaCards = [
  {
    id: "marketing-brand",
    theme: "card-theme-orange",
    tag: "01",
    user: "Jeeshan's",
    subtitle: "Brand Strategy & Marketing",
    brandSlug: "jerrydotart",
    brandName: "Jerrydotart",
    logo: "/assets/logos/Jerrydotart.svg",
    footerText: "Brand Books & Vectors",
    previewObj: {
      label: "MARKETING LEAD",
      title: "Plutus Adventure Park & Metronix",
      badge: "Jerrydotart"
    },
    bookmarkObj: {
      icon: "LEAD",
      text: "Metronix Marketing Lead"
    },
    statObj: {
      num: "3 Hubs",
      label: "Flagship Launch"
    }
  },
  {
    id: "motion-visual",
    theme: "card-theme-crimson",
    tag: "02",
    user: "Jeeshan's",
    subtitle: "Motion Graphics & 2D Animation",
    brandSlug: "jerrydotmov",
    brandName: "Jerrydotmov",
    logo: "/assets/logos/Jerrydotmov.svg",
    footerText: "2D Animation & Scientific Sim",
    previewObj: {
      label: "2D SIMULATION",
      title: "IIT Roorkee Virtual Labs",
      badge: "Jerrydotmov"
    },
    bookmarkObj: {
      icon: "AWARD",
      text: "Excellence Award 2025"
    },
    statObj: {
      num: "10K+",
      label: "Learners Reached"
    }
  },
  {
    id: "video-cinema",
    theme: "card-theme-teal",
    tag: "03",
    user: "Jeeshan's",
    subtitle: "Video Editing & After-Films",
    brandSlug: "jerrydotmov",
    brandName: "Jerrydotmov",
    logo: "/assets/logos/Jerrydotmov.svg",
    footerText: "After-Movies & Major MUNs",
    previewObj: {
      label: "CONCLAVE MEDIA",
      title: "Resonance & Conclave MUNs",
      badge: "Jerrydotmov"
    },
    bookmarkObj: {
      icon: "MEDIA",
      text: "Resonance Media Head"
    },
    statObj: {
      num: "33+",
      label: "Major & Minor Events"
    }
  },
  {
    id: "photography-studio",
    theme: "card-theme-orange",
    tag: "04",
    user: "Jeeshan's",
    subtitle: "Photography & Creative Community",
    brandSlug: "jerrydotdng",
    brandName: "jerrydotdng",
    logo: "/assets/logos/Jerrydotdng.svg",
    footerText: "Street & Architecture RAW",
    previewObj: {
      label: "CLUB FOUNDER",
      title: "OCULUS JIET Photography Club",
      badge: "jerrydotdng"
    },
    bookmarkObj: {
      icon: "FOUNDER",
      text: "Best Club Award Winner"
    },
    statObj: {
      num: "1st",
      label: "President & Founder"
    }
  }
];

export const projectsList = [
  {
    id: "metronix-plutus",
    code: "BRAND ARCHITECTURE // ADVENTURE CHAIN",
    number: "001",
    title: "METRONIX & PLUTUS WORLD BRAND IDENTITY",
    category: "brand",
    brandName: "Jerrydotart",
    brandSlug: "jerrydotart",
    brandLogo: "/assets/logos/Jerrydotart.svg",
    brandDiscipline: "Graphic Design // Brand Identity",
    description: "End-to-end brand guidelines, visual identity system, and 5-year equity framework for Metronix's flagship adventure park chain across Rohtak, Murthal, and Panipat.",
    longDesc: "Spearheaded Metronix Entertainment's complete brand identity and content infrastructure from scratch. Developed Behance-level visual assets, pitch decks for hospitality/club verticals in Jaipur, and comprehensive brand architecture defining typography, color harmonies, and signage.",
    tags: ["BRAND IDENTITY", "ILLUSTRATOR", "PHOTOSHOP", "MARKETING", "PITCH DECKS"],
    featured: true,
    status: "FLAGSHIP",
    demoUrl: "https://behance.net/Jeeshanpurohit",
    metrics: "3 Major Hubs Launched"
  },
  {
    id: "iit-roorkee-sims",
    code: "SCIENTIFIC SIMULATION // 2D ANIMATION",
    number: "002",
    title: "IIT ROORKEE CHEMISTRY VIRTUAL LABS",
    category: "motion",
    brandName: "Jerrydotmov",
    brandSlug: "jerrydotmov",
    brandLogo: "/assets/logos/Jerrydotmov.svg",
    brandDiscipline: "Motion Graphics // 2D Scientific Animation",
    description: "Pedagogically accurate scientific simulations and interactive 2D animations translating complex chemical experiments into engaging, accessible e-learning modules.",
    longDesc: "Awarded Certificate of Excellence from IIT Roorkee Virtual Labs for streamlined animation workflows, rigorous academic accuracy, and user-centric pedagogical design using After Effects and Illustrator.",
    tags: ["AFTER EFFECTS", "ILLUSTRATOR", "2D ANIMATION", "SIMULATION", "E-LEARNING"],
    featured: true,
    status: "EXCELLENCE AWARD",
    demoUrl: "https://behance.net/Jeeshanpurohit",
    metrics: "Certificate of Excellence"
  },
  {
    id: "vsupportu-branding",
    code: "HOSPITALITY BRANDING // SOCIAL CREATIVES",
    number: "003",
    title: "VSUPPORTU HOSPITALITY & LIFESTYLE CREATIVES",
    category: "brand",
    brandName: "Jerrydotart",
    brandSlug: "jerrydotart",
    brandLogo: "/assets/logos/Jerrydotart.svg",
    brandDiscipline: "Graphic Design // Social Media & Video",
    description: "Brand consistency and visual direction for hospitality and lifestyle clients across digital platforms, high-performing social creatives, and short-form video assets.",
    longDesc: "Designed high-performing social media creatives and motion graphics, boosting engagement and campaign reach. Produced short-form video content and marketing assets ensuring timely delivery.",
    tags: ["GRAPHIC DESIGN", "MOTION GRAPHICS", "VIDEO CONTENT", "PHOTOSHOP"],
    featured: true,
    status: "ASSOCIATE ROLE",
    demoUrl: "https://behance.net/Jeeshanpurohit",
    metrics: "Multi-Platform Reach"
  },
  {
    id: "flagship-muns",
    code: "EVENT BRANDING // MOTION DESIGN",
    number: "004",
    title: "FLAGSHIP MUNS & CONCLAVE IDENTITY SYSTEMS",
    category: "brand",
    brandName: "Jerrydotart",
    brandSlug: "jerrydotart",
    brandLogo: "/assets/logos/Jerrydotart.svg",
    brandDiscipline: "Graphic Design // Motion Graphics & Video",
    description: "Complete visual branding, animated logos, brochures, placards, ID cards, and opening ceremony visuals for TVSMUN 2024, Solidarieta Conclave 2024 & 2026, and JIETMUN 2023.",
    longDesc: "Delivered high-quality opening ceremony visuals, after-films, and design assets using Illustrator, Premiere Pro, and After Effects, enhancing event engagement and audience experience.",
    tags: ["ILLUSTRATOR", "AFTER EFFECTS", "PREMIERE PRO", "EVENT BRANDING", "ANIMATION"],
    featured: true,
    status: "COMPLETED",
    demoUrl: "https://behance.net/Jeeshanpurohit",
    metrics: "4 Flagship Conclaves"
  },
  {
    id: "ecommerce-nike-ui",
    code: "UI/UX DESIGN // WEB INTERFACES",
    number: "005",
    title: "E-COMMERCE & NIKE UI/UX CASE STUDY",
    category: "web",
    brandName: "Jerrydotone",
    brandSlug: "jerrydotone",
    brandLogo: "/assets/logos/Jerrydotone.svg",
    brandDiscipline: "UI/UX Design // Web Interface",
    description: "Interactive E-Commerce website UI built with HTML, CSS, and JavaScript, paired with a comprehensive Nike concept webpage designed in Dark and Light mode in Figma.",
    longDesc: "Explores responsive layouts, micro-interactions, dark/light theme switching, and seamless shopping cart user journeys aligned with modern UI/UX design heuristics.",
    tags: ["FIGMA", "HTML", "CSS", "JAVASCRIPT", "UI/UX DESIGN"],
    featured: false,
    status: "PROTOTYPE",
    demoUrl: "https://github.com/jeeshanpurohit",
    metrics: "Figma Dark/Light Mode"
  },
  {
    id: "photo-encryption",
    code: "COMPUTATIONAL TECH // PYTHON",
    number: "006",
    title: "COLOR MATRIX PHOTO ENCRYPTION MODEL",
    category: "web",
    brandName: "Jerrydotone",
    brandSlug: "jerrydotone",
    brandLogo: "/assets/logos/Jerrydotone.svg",
    brandDiscipline: "Computer Science // Python Cryptography",
    description: "A computational photo encryption model that encrypts image pixel data in distinct color spectra and encodes them in varied cryptographic styles.",
    longDesc: "Engineered using Python image processing and data libraries, demonstrating cross-discipline integration of computer science engineering with visual imaging.",
    tags: ["PYTHON", "IMAGE PROCESSING", "CRYPTOGRAPHY", "DATA SCIENCE"],
    featured: false,
    status: "ACADEMIC PROJECT",
    demoUrl: "https://github.com/jeeshanpurohit",
    metrics: "B.Tech CSE Project"
  },
  {
    id: "oculus-photography",
    code: "VISUAL ARTS & LEADERSHIP // EXHIBITION",
    number: "007",
    title: "OCULUS JIET PHOTOGRAPHY & STREET NARRATIVES",
    category: "photography",
    brandName: "jerrydotdng",
    brandSlug: "jerrydotdng",
    brandLogo: "/assets/logos/Jerrydotdng.svg",
    brandDiscipline: "Photography // Visual Curation & Community",
    description: "Curated fine-art and documentary photography series capturing architectural geometry, street culture, and high-energy college conclaves.",
    longDesc: "Founded the club in March 2023 and led it to win Best Club of the Year (2023-2024), hosting workshops, exhibitions, and producing after-films.",
    tags: ["PHOTOGRAPHY", "LIGHTROOM", "RAW CURATION", "AFTER-FILMS", "LEADERSHIP"],
    featured: false,
    status: "AWARDED CLUB",
    demoUrl: "https://behance.net/Jeeshanpurohit",
    metrics: "Best Club of the Year"
  },
  {
    id: "commercial-reels",
    code: "MOTION GRAPHICS & COMMERCIAL VIDEO",
    number: "008",
    title: "COMMERCIAL REELS & AFTER-MOVIES ARCHIVE",
    category: "motion",
    brandName: "Jerrydotmov",
    brandSlug: "jerrydotmov",
    brandLogo: "/assets/logos/Jerrydotmov.svg",
    brandDiscipline: "Video Editing // Commercial Cinema",
    description: "High-octane after-movies, festival promo reels, and client brand commercials produced with professional storytelling, rhythm, and audio synchronization.",
    longDesc: "Seamless transition design, audio synchronization, kinetic typography, and color grading tailored for high engagement across digital channels.",
    tags: ["PREMIERE PRO", "AFTER EFFECTS", "SOUND DESIGN", "COLOR GRADING"],
    featured: false,
    status: "COMMERCIAL",
    demoUrl: "https://behance.net/Jeeshanpurohit",
    metrics: "33+ Event Edits"
  }
];

export const servicesList = [
  {
    number: "01",
    title: "BRAND IDENTITY & STRATEGY",
    tagline: "Behance-level visual systems, comprehensive brand books, and market equity frameworks.",
    description: "End-to-end brand guidelines, typography systems, color harmonies, vector iconography, and corporate brand books built from scratch to establish strong brand equity.",
    points: [
      "Complete Brand Guidelines & Visual Systems",
      "Behance-Level Brand Books & Pitch Decks",
      "Creative Brand Identification & Market Positioning",
      "Vector Collateral, Brochures & Print Collateral"
    ],
    deliverables: "Master Vector Brand Book, Style Guidelines, Typography & Color Hierarchy, Marketing Deck"
  },
  {
    number: "02",
    title: "MOTION GRAPHICS & 2D ANIMATION",
    tagline: "Pedagogical simulations, kinetic typography, and broadcast-quality 2D animation.",
    description: "Translating complex narratives and scientific mechanisms into engaging, high-fidelity 2D animations in After Effects and Illustrator.",
    points: [
      "Scientific Simulation & Educational E-Learning",
      "Kinetic Logo Animations & Intro Sequences",
      "After Effects Motion Choreography",
      "Vector Asset Illustration for Animation"
    ],
    deliverables: "High-Resolution Animation Sequences, Explainer Content, Lottie/MP4 Deliverables"
  },
  {
    number: "03",
    title: "COMMERCIAL VIDEO EDITING",
    tagline: "High-octane after-movies, festival promo reels, audio sync, and rhythmic storytelling.",
    description: "Full post-production pipeline in Adobe Premiere Pro and After Effects for event after-films, commercial reels, and digital ad campaigns.",
    points: [
      "Narrative & Event After-Movie Editing",
      "Short-Form Video Optimization (Instagram Reels & YouTube)",
      "Dynamic Audio Synchronization & Sound Design",
      "Color Grading & Seamless Transition Craft"
    ],
    deliverables: "Master Cut Reels, 4K After-Movies, Social Cuts, Synchronized Audio Mix"
  },
  {
    number: "04",
    title: "UI/UX & WEB INTERFACE DESIGN",
    tagline: "User-centric wireframing, Figma design systems, dark/light modes, and interactive web.",
    description: "Figma wireframes, high-fidelity interactive prototypes, dark & light mode designs, and clean frontend web architectures combining HTML, CSS, and JavaScript.",
    points: [
      "Information Architecture & User Journeys",
      "Figma Component Libraries & Variables",
      "Dark & Light Mode UI Interfaces",
      "Front-End Implementation (HTML, CSS, JS)"
    ],
    deliverables: "Figma Component Library, Interactive Prototype, Usability Report, Responsive Code"
  }
];

export const experienceList = [
  {
    id: "metronix",
    period: "JULY 2026 - PRESENT",
    role: "SR. ASSOCIATE, MARKETING & BRAND LEAD",
    company: "METRONIX ENTERTAINMENT LLP",
    location: "JAIPUR, RAJASTHAN",
    type: "FULL-TIME",
    category: "brand",
    description: "Spearheaded Metronix Entertainment's complete brand identity and content infrastructure: brand guidelines, visual system, and a Behance-level brand book, establishing the company's design language from scratch.",
    highlights: [
      "Led the full brand and marketing buildout for Plutus World, Metronix's flagship adventure-park chain (Rohtak, Murthal, Panipat), including competitor research, a 5-year brand equity framework, and location-specific launch campaigns.",
      "Developed a client-acquisition pitch portfolio to position Metronix as a marketing partner for Jaipur's cafe and club vertical, opening a new business line for the company."
    ],
    tags: ["Brand Identity", "Brand Guidelines", "Marketing Strategy", "Pitch Decks", "Adobe Illustrator", "Photoshop"]
  },
  {
    id: "vsupportu",
    period: "SEPTEMBER 2025 - JUNE 2026",
    role: "GRAPHIC DESIGNER ASSOCIATE",
    company: "VSUPPORTU",
    location: "JODHPUR, RAJASTHAN",
    type: "ASSOCIATE",
    category: "brand",
    description: "Led brand consistency and visual direction for hospitality and lifestyle clients across digital platforms.",
    highlights: [
      "Designed high-performing social media creatives and motion graphics, boosting engagement and campaign reach.",
      "Produced short-form video content and marketing assets, ensuring timely delivery and platform optimization across Instagram, YouTube, and web."
    ],
    tags: ["Visual Direction", "Motion Graphics", "Social Media Creatives", "Video Content", "Branding"]
  },
  {
    id: "coozmoo",
    period: "FEBRUARY 2025 - APRIL 2025",
    role: "GRAPHIC DESIGN TRAINEE / INTERN",
    company: "COOZMOO DIGITAL SOLUTIONS",
    location: "JODHPUR, RAJASTHAN",
    type: "TRAINEE",
    category: "design",
    description: "Designed digital assets aligned with brand guidelines for social media, marketing, and promotional campaigns using Adobe Creative Cloud.",
    highlights: [
      "Created carousels, Meta ads, Instagram posts, envelope and brochure designs utilizing Photoshop, Illustrator, and InDesign.",
      "Collaborated with cross-functional teams to edit video content in Premiere Pro with professional-grade storytelling, transitions, timing, and audio sync.",
      "Produced motion graphics and 2D animation in After Effects to support global-standard promotional and explainer content."
    ],
    tags: ["Photoshop", "Illustrator", "InDesign", "Premiere Pro", "After Effects", "2D Animation", "Meta Ads"]
  },
  {
    id: "iit-roorkee",
    period: "MAY 2024 - OCTOBER 2024",
    role: "CHEMISTRY VIRTUAL LABS DEVELOPER INTERN",
    company: "IIT ROORKEE VIRTUAL LABS",
    location: "JODHPUR / ROORKEE",
    type: "INTERNSHIP",
    category: "motion",
    description: "Developed interactive 2D animations and scientific simulations using Adobe After Effects and Illustrator for Chemistry e-learning modules.",
    highlights: [
      "Translated complex chemical experiments into visually accurate and pedagogically effective animations, enhancing virtual lab accessibility for thousands of students.",
      "Streamlined animation workflows and collaborated with academic teams to ensure scientific accuracy and user-centric pedagogical design.",
      "Created highly scalable chemistry lab vectors and interactive simulation components. Received Certificate of Excellence."
    ],
    tags: ["2D Animation", "Scientific Simulations", "After Effects", "Illustrator", "E-Learning", "Excellence Award"]
  },
  {
    id: "ideaforage",
    period: "APRIL 2024 - MAY 2024",
    role: "FREELANCE VIDEO EDITOR",
    company: "IDEAFORAGE FOUNDATIONS",
    location: "JODHPUR, RAJASTHAN",
    type: "FREELANCE",
    category: "motion",
    description: "Delivered dynamic video editing solutions for gaming modules and corporate digital presence.",
    highlights: [
      "Created compelling game promotional videos with stylized motion and rhythm.",
      "Produced official company introduction videos showcasing core offerings and product vision."
    ],
    tags: ["Premiere Pro", "Game Videos", "Corporate Intro", "Motion Graphics"]
  },
  {
    id: "tcc",
    period: "AUGUST 2023 - SEPTEMBER 2023",
    role: "GRAPHIC DESIGN & VIDEO EDITING INTERN",
    company: "TCC - THE CONTENT CREATORS",
    location: "JODHPUR, RAJASTHAN",
    type: "INTERNSHIP",
    category: "design",
    description: "Designed targeted digital advertising and social-first video content for boutique lifestyle clients.",
    highlights: [
      "Created ad campaigns for fashion designers and sports agencies across regional and digital markets.",
      "Edited high-retention reels including clothing brand features, animated logo reveals, and promotional intros."
    ],
    tags: ["Fashion Branding", "Reels Editing", "Sports Agencies", "Logo Animation"]
  },
  {
    id: "hdlc",
    period: "MAY 2023 - JUNE 2023",
    role: "DATA SCIENCE INTERN",
    company: "HDLC TECHNOLOGIES",
    location: "JODHPUR, RAJASTHAN",
    type: "INTERNSHIP",
    category: "tech",
    description: "Hands-on engineering internship applying Python for data analysis, modeling, and automated data processing.",
    highlights: [
      "Worked hands-on with Python for data analysis, data structures, and algorithmic modeling.",
      "Built a foundational understanding of advanced Python libraries and structured data-handling pipelines."
    ],
    tags: ["Python", "Data Science", "Data Modeling", "Algorithms"]
  },
  {
    id: "oculus-club",
    period: "MARCH 2023 - SEPTEMBER 2024 / 2022 - 2025",
    role: "FOUNDER & PRESIDENT // CREATIVE DIRECTOR",
    company: "OCULUS JIET PHOTOGRAPHY CLUB",
    location: "JODHPUR, RAJASTHAN",
    type: "LEADERSHIP",
    category: "leadership",
    description: "Founded the official photography club of JIET in March 2023; served as President, growing it into the premier creative organization on campus.",
    highlights: [
      "Awarded Best Club of the Year (2023-2024) across the entire institution for outstanding leadership and event production.",
      "Led end-to-end media operations: photography, videography, after-films, reels, thumbnails, and social media brand management.",
      "Directed intro animations and motion designs for major campus festivals; mentored junior creatives."
    ],
    tags: ["Leadership", "Club Founder", "Photography", "Videography", "After-Films", "Best Club Award"]
  },
  {
    id: "muns-and-events",
    period: "2021 - PRESENT",
    role: "GRAPHIC DESIGNER, VIDEO EDITOR & MOTION DESIGNER",
    company: "FREELANCE & FLAGSHIP PRIVATE MUNS",
    location: "JODHPUR, RAJASTHAN",
    type: "FREELANCE",
    category: "brand",
    description: "Visual branding, motion design, and event media production for major Model United Nations and cultural festivals.",
    highlights: [
      "TVSMUN (July 2024): Designed official Instagram branding, placards, brochures, 2D animation, and delegate ID cards.",
      "Solidarieta Conclave MUN (2024 & 2026): Designed the Instagram presence, promotional brochures, placards, and intro videos.",
      "JIETMUN (2023): Created and edited reels, intro sequences, about-MUN content, 2D animation, and the official after-film.",
      "Resonance Cultural Fest (2023 - 2024): Appointed Media Head for JIET's annual flagship fest; recognized as most creative member of the Student Council Media Team.",
      "Palladium MUN 1st Edition: Received High Commendation Award in the International Press committee as official photographer."
    ],
    tags: ["TVSMUN", "Solidarieta Conclave", "JIETMUN", "Resonance Fest", "Event Branding", "High Commendation"]
  }
];

export const educationList = [
  {
    institution: "Jodhpur Institute of Engineering & Technology (JIET)",
    degree: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
    period: "August 2021 - May 2025",
    grade: "7.0 CGPA",
    location: "Jodhpur, Rajasthan",
    description: "Core coursework in Computer Science, Data Structures, Software Engineering, Python, and Web Development. Founded OCULUS Photography Club and served as Student Council Media Lead."
  },
  {
    institution: "Vidhyashram International School",
    degree: "Senior Secondary (12th CBSE): Physics, Chemistry, Math (PCM)",
    period: "2020 - 2021",
    grade: "7.4 CGPA (74%)",
    location: "Jodhpur, Rajasthan",
    description: "Focus on Mathematics, Physics, and Chemistry."
  },
  {
    institution: "Vidhyashram International School",
    degree: "Secondary School (10th CBSE)",
    period: "2018 - 2019",
    grade: "72%",
    location: "Jodhpur, Rajasthan",
    description: "Foundational academic curriculum with distinction in arts and sciences."
  }
];

export const certificationsList = [
  {
    id: "cert-accenture",
    title: "Digital Skills: User Experience (UX)",
    issuer: "Accenture (FutureLearn)",
    category: "Design",
    details: "Certificate of Achievement covering UX design principles, information architecture, wireframing, interactive prototyping, and usability testing."
  },
  {
    id: "cert-udemy",
    title: "Complete Web Design: Figma to Webflow to Freelancing",
    issuer: "Udemy",
    category: "Design",
    details: "Comprehensive training in visual design, responsive layouts, design systems, Figma workflows, and Webflow implementation."
  },
  {
    id: "cert-iit",
    title: "Certificate of Excellence",
    issuer: "IIT Roorkee Virtual Labs (2025)",
    category: "Simulation & Animation",
    details: "Recognized for outstanding contributions in creative development, 2D animation, and scientific simulation content for Chemistry Virtual Labs."
  },
  {
    id: "cert-best-club",
    title: "Best College Club of the Year (2023-2024)",
    issuer: "JIET Jodhpur",
    category: "Leadership",
    details: "Awarded as Founder and President of OCULUS JIET Photography Club for exceptional leadership, community building, and creative media management."
  },
  {
    id: "cert-photographer",
    title: "Best Photographer Felicitation",
    issuer: "JIET Jodhpur",
    category: "Photography",
    details: "Felicitated by the college as Best Photographer for outstanding co-curricular contributions and campus media leadership."
  },
  {
    id: "cert-mun-award",
    title: "High Commendation Award",
    issuer: "Palladium MUN (1st Edition)",
    category: "Media & Journalism",
    details: "Awarded High Commendation as a delegate in the International Press committee for photojournalism and creative coverage."
  },
  {
    id: "cert-appreciation",
    title: "Certificates of Appreciation",
    issuer: "JIET & Major Conclaves",
    category: "Event Media",
    details: "Reckon Hackathon 5.0 (2024), Solidarieta Conclave (2024), Resonance Cultural Fest (2023), Virtual Labs IIT Roorkee (2022), Freshers (2022)."
  }
];

export const technicalSkills = {
  toolkit: [
    { name: "Adobe Photoshop", category: "Graphic Design", level: "Expert" },
    { name: "Adobe Illustrator", category: "Vector & Branding", level: "Expert" },
    { name: "Adobe Premiere Pro", category: "Video Editing", level: "Expert" },
    { name: "Adobe After Effects", category: "Motion Graphics & 2D", level: "Advanced" },
    { name: "Adobe InDesign", category: "Layout & Print", level: "Advanced" },
    { name: "Figma", category: "UI/UX & Prototyping", level: "Advanced" },
    { name: "Webflow", category: "Web Design", level: "Proficient" },
    { name: "HTML5 & CSS3", category: "Web Engineering", level: "Proficient" },
    { name: "JavaScript", category: "Web Engineering", level: "Proficient" },
    { name: "Python", category: "Data Science & Scripting", level: "Proficient" },
    { name: "Jira & Aha!", category: "Product & Project Mgmt", level: "Proficient" },
    { name: "Notion", category: "Productivity & Systems", level: "Advanced" }
  ],
  capabilities: [
    { name: "Brand Identity Design", category: "Design", level: "Mastery" },
    { name: "UI/UX Architecture", category: "Design", level: "Advanced" },
    { name: "Motion Graphic Design", category: "Motion", level: "Advanced" },
    { name: "2D Animation", category: "Motion", level: "Advanced" },
    { name: "Commercial Video Editing", category: "Video", level: "Expert" },
    { name: "Visual Design & Typography", category: "Design", level: "Expert" },
    { name: "Scientific Simulation", category: "Motion", level: "Specialist" },
    { name: "Photography & Videography", category: "Media", level: "Expert" },
    { name: "Creative Brand Identification", category: "Strategy", level: "Advanced" },
    { name: "Product & Project Management", category: "Leadership", level: "Advanced" },
    { name: "Team Leadership", category: "Leadership", level: "Proven" }
  ],
  languages: [
    { lang: "Hindi", level: "Native / Proficient" },
    { lang: "Marwari", level: "Native / Proficient" },
    { lang: "English", level: "Conversational / Professional" },
    { lang: "French", level: "Beginner" }
  ]
};
