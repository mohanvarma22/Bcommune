// FIX: Imported ApplicantDetails, Job, Company and AIAssistantAnalysis to resolve type errors.
import type { User, Job, Conversation, Story, Startup, Event, ApplicantStatus, MessageTemplate, Comment, EmailTemplate, SharedDashboard, Venture, Signal, Feedback, Company, Notification, ApplicantDetails, AIAssistantAnalysis } from './types';

export const MOCK_CURRENT_USER_ID = 'user-1';

// --- USERS (40 total) ---
export const MOCK_USERS: User[] = [
  // Existing Users (1-20)
  {
    id: 'user-1',
    name: 'Alex Chen',
    title: 'Founder & AI Developer',
    location: 'San Francisco, CA',
    avatarUrl: 'https://picsum.photos/seed/user1/200',
    email: 'alex.chen@example.com',
    phone: '(555) 123-4567',
    emailVerified: true,
    phoneVerified: true,
    vision: "To build AI tools that empower creative professionals and automate tedious tasks, allowing humans to focus on high-level strategy and innovation. I believe in a future where AI is a collaborative partner in every creative process.",
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Machine Learning', 'UI/UX Design', 'Product Management', 'Next.js', 'Google Cloud'],
    experience: [
      { role: 'Founder & CEO', company: 'Visionary AI', period: '2022 - Present', description: 'Leading the development of a new AI-powered creative suite.' },
      { role: 'Senior Software Engineer', company: 'OmniCorp', period: '2020 - 2022', description: 'Led the development of a new AI-powered analytics platform, improving data processing efficiency by 40%.' },
      { role: 'Frontend Developer', company: 'Tech Solutions', period: '2018 - 2020', description: 'Built and maintained responsive user interfaces for various client projects, resulting in a 15% increase in user engagement.' },
    ],
    portfolio: [
        { name: 'Project Titan', description: 'An open-source machine learning library for natural language processing.', url: 'https://github.com', isFeatured: true, imageUrl: 'https://picsum.photos/seed/project1/1200/800' },
        { name: 'Creative Engine', description: 'A web-based platform for artists to collaborate on digital art.', url: 'https://github.com', imageUrl: 'https://picsum.photos/seed/project2/1200/800' },
    ],
    education: [
      { institution: 'Stanford University', degree: 'M.S. in Computer Science, AI Specialization', period: '2016 - 2018' },
      { institution: 'University of California, Berkeley', degree: 'B.S. in Electrical Engineering & Computer Science', period: '2012 - 2016' },
    ],
    certifications: [
        { name: 'Google Certified Professional - Machine Learning Engineer', issuer: 'Google Cloud', date: '2021' },
    ],
    languages: [ { name: 'English', proficiency: 'Native' }, { name: 'Mandarin Chinese', proficiency: 'Fluent' } ],
    connections: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-16', 'user-19'],
    companyIds: ['company-1'],
  },
   {
    id: 'user-2',
    name: 'Brenda Smith',
    title: 'Growth Marketer & Community Builder',
    location: 'Austin, TX',
    avatarUrl: 'https://picsum.photos/seed/user2/200',
    email: 'brenda.smith@example.com',
    phone: '(555) 234-5678',
    emailVerified: true,
    phoneVerified: true,
    vision: "I believe in building authentic communities around products that people love. My passion lies in connecting users, fostering engagement, and driving sustainable growth through data-driven marketing strategies.",
    skills: ['SEO', 'Content Marketing', 'Community Management', 'Data Analysis', 'PPC Campaigns', 'Social Media Strategy', 'HubSpot'],
    experience: [
      { role: 'Head of Growth', company: 'Momentum Growth', period: '2019 - Present', description: 'Grew organic traffic by 300% and user base from 10k to 250k through targeted content and community initiatives.' },
      { role: 'Digital Marketing Manager', company: 'Connectify', period: '2017 - 2019', description: 'Managed a $500k annual ad budget, achieving a 20% reduction in CPA.' },
    ],
    portfolio: [ { name: 'Momentum Growth Blog', description: 'Led the content strategy for the Sproutly blog, now a top resource in the industry.', url: 'https://example.com' } ],
    education: [ { institution: 'University of Texas at Austin', degree: 'B.A. in Marketing', period: '2013 - 2017' } ],
    certifications: [],
    languages: [ { name: 'English', proficiency: 'Native' } ],
    connections: ['user-1', 'user-3', 'user-15', 'user-20'],
    companyIds: ['company-9'],
  },
  {
    id: 'user-3',
    name: 'Carlos Gomez',
    title: 'Senior Product Designer',
    location: 'Remote',
    avatarUrl: 'https://picsum.photos/seed/user3/200',
    email: 'carlos.gomez@example.com',
    phone: '(555) 345-6789',
    vision: "My goal is to design intuitive and beautiful products that solve real-world problems. I thrive on user feedback and am passionate about creating experiences that feel effortless and delightful.",
    skills: ['Figma', 'UI/UX Design', 'User Research', 'Prototyping', 'Design Systems', 'HTML/CSS', 'Webflow'],
    experience: [
      { role: 'Senior Product Designer', company: 'PixelStorm Creative', period: '2020 - Present', description: 'Led the redesign of the main dashboard, resulting in a 30% increase in user satisfaction scores.' },
      { role: 'UX/UI Designer', company: 'Innovate Inc.', period: '2018-2020', description: 'Worked on various client projects, creating wireframes, mockups, and high-fidelity prototypes.'}
    ],
    portfolio: [ { name: 'Portfolio Website', description: 'My personal portfolio showcasing my design work and process.', url: 'https://carlosgomez.design', isFeatured: true, imageUrl: 'https://picsum.photos/seed/project3/1200/800' } ],
    education: [ { institution: 'Rhode Island School of Design', degree: 'B.F.A. in Graphic Design', period: '2014 - 2018' } ],
    certifications: [],
    languages: [ { name: 'English', proficiency: 'Native' }, { name: 'Spanish', proficiency: 'Native' } ],
    connections: ['user-1', 'user-2', 'user-9', 'user-12', 'user-14'],
  },
  {
    id: 'user-4',
    name: 'Diana Prince',
    title: 'Aspiring Founder',
    location: 'Miami, FL',
    avatarUrl: 'https://picsum.photos/seed/user4/200',
    email: 'diana.prince@example.com',
    phone: '(555) 456-7890',
    vision: "I'm exploring new ideas in the sustainable tech space and looking for a technical co-founder to help bring a vision to life. I want to build a product that has a positive impact on the planet.",
    skills: ['Business Strategy', 'Fundraising', 'Market Research', 'Team Leadership', 'Pitching'],
    experience: [ { role: 'Product Manager', company: 'GreenShift', period: '2018 - 2022', description: 'Launched three successful product lines focused on sustainable materials.' } ],
    portfolio: [],
    education: [ { institution: 'University of Miami', degree: 'M.B.A.', period: '2016 - 2018' } ],
    certifications: [],
    languages: [ { name: 'English', proficiency: 'Native' } ],
    connections: ['user-1', 'user-5'],
  },
  {
    id: 'user-5', name: 'Evelyn Reed', title: 'Partner at Horizon Ventures', location: 'New York, NY', avatarUrl: 'https://picsum.photos/seed/user5/200',
    email: 'evelyn.reed@horizon.vc', phone: '(555) 567-8901', vision: "Investing in visionary founders building the next generation of deep tech and AI.",
    skills: ['Venture Capital', 'Due Diligence', 'Term Sheets', 'Board Management', 'Fundraising'],
    experience: [{ role: 'Partner', company: 'Horizon Ventures', period: '2018 - Present', description: 'Lead investments in Series A and Seed stage startups in AI/ML and SaaS.' }],
    portfolio: [], education: [{ institution: 'Harvard Business School', degree: 'M.B.A.', period: '2014-2016' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-1', 'user-4']
  },
  {
    id: 'user-6', name: 'Frank Wu', title: 'Senior Backend Engineer', location: 'Remote (US)', avatarUrl: 'https://picsum.photos/seed/user6/200',
    email: 'frank.wu@example.com', phone: '(555) 678-9012', vision: "Building scalable, resilient, and performant distributed systems. I'm passionate about clean architecture and the Go ecosystem.",
    skills: ['Go (Golang)', 'Microservices', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'gRPC'],
    experience: [{ role: 'Senior Backend Engineer', company: 'Fintech Innovators', period: '2021 - Present', description: 'Designing and building core banking APIs using Go and microservices architecture.' }],
    portfolio: [], education: [{ institution: 'Georgia Institute of Technology', degree: 'B.S. in Computer Science', period: '2013-2017' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-1', 'user-7']
  },
  {
    id: 'user-7', name: 'Grace Lee', title: 'Data Scientist', location: 'Seattle, WA', avatarUrl: 'https://picsum.photos/seed/user7/200',
    email: 'grace.lee@example.com', phone: '(555) 789-0123', vision: "Leveraging data to uncover insights, drive product decisions, and create intelligent systems.",
    skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL', 'Data Visualization', 'Statistics'],
    experience: [{ role: 'Data Scientist', company: 'OmniCorp', period: '2019 - Present', description: 'Developed recommendation algorithms that increased user engagement by 25%.' }],
    portfolio: [], education: [{ institution: 'University of Washington', degree: 'M.S. in Data Science', period: '2017-2019' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-6', 'user-8', 'user-16']
  },
  {
    id: 'user-8', name: 'Henry Ishida', title: 'Senior Product Manager', location: 'San Francisco, CA', avatarUrl: 'https://picsum.photos/seed/user8/200',
    email: 'henry.ishida@example.com', phone: '(555) 890-1234', vision: "Leading cross-functional teams to build products users love. I bridge the gap between user needs, business goals, and technical feasibility.",
    skills: ['Product Roadmapping', 'Agile Methodologies', 'User Stories', 'A/B Testing', 'Jira', 'Market Analysis'],
    experience: [{ role: 'Senior Product Manager', company: 'Nexus B2B', period: '2020 - Present', description: 'Own the product roadmap for our flagship B2B SaaS product.' }],
    portfolio: [], education: [{ institution: 'Carnegie Mellon University', degree: 'B.S. in Information Systems', period: '2012-2016' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Japanese', proficiency: 'Conversational' }], connections: ['user-1', 'user-7', 'user-12']
  },
  {
    id: 'user-9', name: 'Isabella Rossi', title: 'Junior Frontend Developer', location: 'Boston, MA', avatarUrl: 'https://picsum.photos/seed/user9/200',
    email: 'isabella.rossi@example.com', phone: '(555) 901-2345', vision: "Eager to learn and contribute to building beautiful, responsive, and accessible user interfaces. Passionate about React and modern web technologies.",
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'REST APIs'],
    experience: [{ role: 'Web Development Intern', company: 'Local Startup', period: 'Summer 2023', description: 'Assisted in building new features for the company website using React.' }],
    portfolio: [], education: [{ institution: 'Northeastern University', degree: 'B.S. in Computer Science', period: '2020-2024' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-3']
  },
  {
    id: 'user-10', name: 'Jack Thompson', title: 'DevOps Engineer', location: 'Raleigh, NC', avatarUrl: 'https://picsum.photos/seed/user10/200',
    email: 'jack.thompson@example.com', phone: '(555) 012-3456', vision: "Automating infrastructure and streamlining the development lifecycle to enable teams to ship code faster and more reliably.",
    skills: ['AWS', 'Terraform', 'CI/CD', 'Jenkins', 'Docker', 'Kubernetes', 'Ansible'],
    experience: [{ role: 'DevOps Engineer', company: 'Nexus B2B', period: '2019 - Present', description: 'Maintain and improve the CI/CD pipeline, reducing deployment times by 60%.' }],
    portfolio: [], education: [{ institution: 'North Carolina State University', degree: 'B.S. in Computer Engineering', period: '2014-2018' }], certifications: [{name: 'AWS Certified DevOps Engineer', issuer: 'Amazon Web Services', date: '2021'}],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-6']
  },
  {
    id: 'user-11', name: 'Kenji Tanaka', title: 'Mobile Engineer', location: 'Los Angeles, CA', avatarUrl: 'https://picsum.photos/seed/user11/200',
    email: 'kenji.tanaka@example.com', phone: '(555) 112-2334', vision: "Crafting delightful and performant native mobile experiences for both iOS and Android.",
    skills: ['Swift', 'Kotlin', 'iOS', 'Android', 'SwiftUI', 'Jetpack Compose', 'Firebase'],
    experience: [{ role: 'Mobile Engineer', company: 'Fintech Innovators', period: '2022 - Present', description: 'Building the next-generation mobile banking app from scratch.' }],
    portfolio: [], education: [{ institution: 'University of Southern California', degree: 'B.S. in Computer Science', period: '2016-2020' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-6']
  },
  {
    id: 'user-12', name: 'Laura Nielsen', title: 'UX Researcher', location: 'Chicago, IL', avatarUrl: 'https://picsum.photos/seed/user12/200',
    email: 'laura.nielsen@example.com', phone: '(555) 223-3445', vision: "Being the voice of the user, using qualitative and quantitative data to inform product strategy and design.",
    skills: ['User Interviews', 'Survey Design', 'Usability Testing', 'Persona Development', 'Journey Mapping'],
    experience: [{ role: 'UX Researcher', company: 'PixelStorm Creative', period: '2021 - Present', description: 'Conduct foundational research that informs new product initiatives.' }],
    portfolio: [], education: [{ institution: 'University of Chicago', degree: 'M.A. in Human-Computer Interaction', period: '2019-2021' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-3', 'user-8']
  },
  {
    id: 'user-13', name: 'Michael Brown', title: 'Cybersecurity Analyst', location: 'Washington D.C.', avatarUrl: 'https://picsum.photos/seed/user13/200',
    email: 'michael.brown@example.com', phone: '(555) 334-4556', vision: "Protecting digital assets and infrastructure from evolving threats through proactive defense and rapid incident response.",
    skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Incident Response', 'Cryptography'],
    experience: [{ role: 'Cybersecurity Analyst', company: 'DeFi Secure', period: '2020 - Present', description: 'Monitor for threats and respond to security incidents for our blockchain clients.' }],
    portfolio: [], education: [{ institution: 'Virginia Tech', degree: 'B.S. in Cybersecurity', period: '2016-2020' }], certifications: [{name: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council', date: '2021'}],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-19']
  },
  {
    id: 'user-14', name: 'Nina Patel', title: 'Technical Writer', location: 'Remote', avatarUrl: 'https://picsum.photos/seed/user14/200',
    email: 'nina.patel@example.com', phone: '(555) 445-5667', vision: "Making complex technical concepts easy to understand for developers and end-users through clear and concise documentation.",
    skills: ['API Documentation', 'Markdown', 'Git', 'Docusaurus', 'Technical Writing'],
    experience: [{ role: 'Technical Writer', company: 'Nexus B2B', period: '2022 - Present', description: 'Create and maintain the public API documentation for our products.' }],
    portfolio: [], education: [{ institution: 'Purdue University', degree: 'B.A. in Professional Writing', period: '2018-2022' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-3']
  },
  {
    id: 'user-15', name: 'Oscar Davies', title: 'Sales Director', location: 'New York, NY', avatarUrl: 'https://picsum.photos/seed/user15/200',
    email: 'oscar.davies@example.com', phone: '(555) 556-6778', vision: "Building high-performing sales teams and driving revenue growth in the B2B SaaS space.",
    skills: ['Sales Strategy', 'Team Leadership', 'Salesforce', 'Enterprise Sales', 'Negotiation'],
    experience: [{ role: 'Sales Director', company: 'Nexus B2B', period: '2018 - Present', description: 'Grew annual recurring revenue from $2M to $15M.' }],
    portfolio: [], education: [{ institution: 'New York University', degree: 'B.S. in Business Administration', period: '2010-2014' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-2']
  },
  {
    id: 'user-16', name: 'Priya Sharma', title: 'Machine Learning Engineer', location: 'Toronto, ON', avatarUrl: 'https://picsum.photos/seed/user16/200',
    email: 'priya.sharma@example.com', phone: '(555) 667-7889', vision: "Designing, building, and deploying machine learning models that solve real-world problems at scale.",
    skills: ['Python', 'PyTorch', 'MLOps', 'Kubeflow', 'Natural Language Processing', 'Computer Vision'],
    experience: [{ role: 'Machine Learning Engineer', company: 'Visionary AI', period: '2023 - Present', description: 'Developing and deploying generative models for our creative suite.' }],
    portfolio: [], education: [{ institution: 'University of Toronto', degree: 'M.S. in Applied Computing', period: '2021-2023' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-1', 'user-7']
  },
  {
    id: 'user-17', name: 'Quentin Bell', title: 'QA Engineer', location: 'Remote', avatarUrl: 'https://picsum.photos/seed/user17/200',
    email: 'quentin.bell@example.com', phone: '(555) 778-8990', vision: "Ensuring software quality through rigorous testing and robust automation frameworks.",
    skills: ['Selenium', 'Cypress', 'Jest', 'Test Planning', 'Bug Tracking', 'Automated Testing'],
    experience: [{ role: 'QA Engineer', company: 'OmniCorp', period: '2021 - Present', description: 'Developed and maintained the automated testing suite for a major e-commerce platform.' }],
    portfolio: [], education: [{ institution: 'University of Phoenix', degree: 'B.S. in Information Technology', period: '2017-2021' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-18', name: 'Rachel Green', title: 'Talent Acquisition Lead', location: 'San Francisco, CA', avatarUrl: 'https://picsum.photos/seed/user18/200',
    email: 'rachel.green@example.com', phone: '(555) 889-9001', vision: "Connecting top talent with innovative companies to build world-class teams.",
    skills: ['Recruiting', 'Sourcing', 'Interviewing', 'Onboarding', 'Applicant Tracking Systems'],
    experience: [{ role: 'Talent Acquisition Lead', company: 'Visionary AI', period: '2022 - Present', description: 'Leading all hiring efforts to grow our founding team.' }],
    portfolio: [], education: [{ institution: 'University of California, Davis', degree: 'B.A. in Communications', period: '2014-2018' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-1']
  },
  {
    id: 'user-19', name: 'Samuel Jones', title: 'Solidity Developer', location: 'Remote (Global)', avatarUrl: 'https://picsum.photos/seed/user19/200',
    email: 'samuel.jones@example.com', phone: '(555) 990-0112', vision: "Building secure, efficient, and decentralized applications on the Ethereum blockchain.",
    skills: ['Solidity', 'Hardhat', 'Ethers.js', 'Smart Contracts', 'DeFi', 'NFTs', 'The Graph'],
    experience: [{ role: 'Solidity Developer', company: 'DeFi Secure', period: '2021 - Present', description: 'Develop and audit smart contracts for decentralized finance protocols.' }],
    portfolio: [{ name: 'DAO Voting System', description: 'An open-source, gas-efficient voting system for DAOs.', url: 'https://github.com' }],
    education: [{ institution: 'Self-taught', degree: 'Blockchain Development', period: '2020 - Present' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-1', 'user-13']
  },
  {
    id: 'user-20', name: 'Tina Fay', title: 'Content Strategist', location: 'Chicago, IL', avatarUrl: 'https://picsum.photos/seed/user20/200',
    email: 'tina.fay@example.com', phone: '(555) 001-1223', vision: "Crafting compelling narratives and content strategies that build brands and engage audiences.",
    skills: ['Content Strategy', 'Copywriting', 'SEO', 'Brand Voice', 'Content Calendars', 'Analytics'],
    experience: [{ role: 'Content Strategist', company: 'Momentum Growth', period: '2021 - Present', description: 'Develop content strategies for B2B SaaS clients, increasing organic leads by an average of 40%.' }],
    portfolio: [], education: [{ institution: 'University of Illinois Urbana-Champaign', degree: 'B.S. in Journalism', period: '2016-2020' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: ['user-2']
  },
  // --- NEW USERS (21-40) ---
  {
    id: 'user-21', name: 'Victor Orlov', title: 'Principal Data Engineer', location: 'Berlin, Germany', avatarUrl: 'https://picsum.photos/seed/user21/200',
    email: 'victor.orlov@example.com', phone: '(555) 121-2121', vision: "Building robust, scalable data pipelines that serve as the backbone for analytics and machine learning.",
    skills: ['Data Engineering', 'Apache Spark', 'Airflow', 'Kafka', 'AWS', 'SQL', 'Python'],
    experience: [{ role: 'Principal Data Engineer', company: 'DataBricks', period: '2020 - Present', description: 'Architecting and implementing large-scale ETL pipelines for enterprise customers.' }],
    portfolio: [], education: [{ institution: 'Technical University of Munich', degree: 'M.S. in Informatics', period: '2016-2018' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Fluent' }, { name: 'German', proficiency: 'Fluent' }, { name: 'Russian', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-22', name: 'Wendy Zhou', title: 'Product Marketing Lead', location: 'Singapore', avatarUrl: 'https://picsum.photos/seed/user22/200',
    email: 'wendy.zhou@example.com', phone: '(555) 222-2222', vision: "Crafting compelling product narratives and executing go-to-market strategies that resonate with users and drive adoption.",
    skills: ['Product Marketing', 'Go-to-Market Strategy', 'Sales Enablement', 'Content Marketing', 'Competitive Analysis'],
    experience: [{ role: 'Product Marketing Lead', company: 'Nexus B2B', period: '2019 - Present', description: 'Led GTM strategy for three major product launches, resulting in 200% ARR growth.' }],
    portfolio: [], education: [{ institution: 'National University of Singapore', degree: 'B.B.A. in Marketing', period: '2013-2017' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Mandarin', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-23', name: 'Xavier King', title: 'UX Writer & Content Designer', location: 'London, UK', avatarUrl: 'https://picsum.photos/seed/user23/200',
    email: 'xavier.king@example.com', phone: '(555) 333-3333', vision: "Designing with words to create clear, concise, and human-centered user experiences. I believe language is the most important part of the UI.",
    skills: ['UX Writing', 'Content Design', 'Microcopy', 'Figma', 'Content Strategy', 'Voice and Tone'],
    experience: [{ role: 'Senior UX Writer', company: 'Fintech Innovators', period: '2021 - Present', description: 'Developed the content style guide and own all in-product copy, improving user onboarding completion by 15%.' }],
    portfolio: [], education: [{ institution: 'University of Oxford', degree: 'B.A. in English Literature', period: '2015-2018' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-24', name: 'Yara Ahmed', title: 'Systems Engineer (Rust)', location: 'Remote', avatarUrl: 'https://picsum.photos/seed/user24/200',
    email: 'yara.ahmed@example.com', phone: '(555) 444-4444', vision: "Building memory-safe, high-performance systems software for the next generation of computing, with a focus on blockchain and distributed systems.",
    skills: ['Rust', 'Systems Programming', 'Blockchain', 'Performance Optimization', 'C++', 'Solidity'],
    experience: [{ role: 'Rust Developer', company: 'DeFi Secure', period: '2022 - Present', description: 'Developing core components of a new Layer 2 scaling solution using Rust.' }],
    portfolio: [], education: [{ institution: 'Cairo University', degree: 'B.S. in Computer Engineering', period: '2017-2021' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Fluent' }, { name: 'Arabic', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-25', name: 'Zane Miller', title: 'Site Reliability Engineer (SRE)', location: 'Denver, CO', avatarUrl: 'https://picsum.photos/seed/user25/200',
    email: 'zane.miller@example.com', phone: '(555) 555-5555', vision: "Automating away toil and building resilient, observable systems that scale. My goal is to make systems so reliable, they're boring.",
    skills: ['SRE', 'Prometheus', 'Grafana', 'Kubernetes', 'Terraform', 'Go (Golang)', 'Observability'],
    experience: [{ role: 'SRE', company: 'OmniCorp', period: '2019 - Present', description: 'Maintain 99.99% uptime for a critical, high-traffic service through automation and improved monitoring.' }],
    portfolio: [], education: [{ institution: 'University of Colorado Boulder', degree: 'B.S. in Computer Science', period: '2014-2018' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-26', name: 'Alice Walker', title: 'General Counsel', location: 'New York, NY', avatarUrl: 'https://picsum.photos/seed/user26/200',
    email: 'alice.walker@example.com', phone: '(555) 666-6666', vision: "Providing pragmatic legal guidance to help high-growth startups navigate complex regulatory landscapes and achieve their business goals.",
    skills: ['Corporate Law', 'Venture Capital', 'Fundraising', 'Compliance', 'IP Law', 'Contracts'],
    experience: [{ role: 'General Counsel', company: 'Horizon Ventures', period: '2019 - Present', description: 'Advise portfolio companies on legal strategy, from formation to exit.' }],
    portfolio: [], education: [{ institution: 'Columbia Law School', degree: 'J.D.', period: '2014-2017' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-27', name: 'Bob Ross', title: 'AR/VR Developer', location: 'Seattle, WA', avatarUrl: 'https://picsum.photos/seed/user27/200',
    email: 'bob.ross@example.com', phone: '(555) 777-7777', vision: "Creating immersive and interactive experiences in augmented and virtual reality that blend the digital and physical worlds.",
    skills: ['Unity', 'C#', 'VR/AR Development', '3D Modeling', 'Blender', 'Unreal Engine'],
    experience: [{ role: 'XR Developer', company: 'Aperture Robotics', period: '2021 - Present', description: 'Building AR applications for industrial training and remote assistance.' }],
    portfolio: [], education: [{ institution: 'DigiPen Institute of Technology', degree: 'B.S. in Computer Science in Real-Time Interactive Simulation', period: '2016-2020' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-28', name: 'Chloe Kim', title: 'Senior Cloud Architect', location: 'Austin, TX', avatarUrl: 'https://picsum.photos/seed/user28/200',
    email: 'chloe.kim@example.com', phone: '(555) 888-8888', vision: "Designing and implementing secure, scalable, and cost-effective cloud infrastructure to support modern applications.",
    skills: ['AWS', 'Azure', 'Google Cloud', 'Infrastructure as Code', 'Terraform', 'Kubernetes'],
    experience: [{ role: 'Cloud Architect', company: 'Momentum Growth', period: '2020 - Present', description: 'Migrated client infrastructure to a multi-cloud environment, reducing costs by 20%.' }],
    portfolio: [], education: [{ institution: 'KAIST', degree: 'B.S. in Computer Science', period: '2014-2018' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Fluent' }, { name: 'Korean', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-29', name: 'David Chen', title: 'Business Analyst', location: 'Chicago, IL', avatarUrl: 'https://picsum.photos/seed/user29/200',
    email: 'david.chen@example.com', phone: '(555) 999-9999', vision: "Translating business needs into technical requirements and using data to drive strategic decisions and process improvements.",
    skills: ['Business Analysis', 'SQL', 'Tableau', 'Requirements Gathering', 'Agile', 'Data Visualization'],
    experience: [{ role: 'Business Analyst', company: 'Nexus B2B', period: '2021 - Present', description: 'Analyze sales data to identify trends and provide actionable insights to the product team.' }],
    portfolio: [], education: [{ institution: 'University of Illinois Urbana-Champaign', degree: 'B.S. in Information Systems', period: '2016-2020' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-30', name: 'Emily White', title: 'Lead Mobile Developer (Flutter)', location: 'Remote (Canada)', avatarUrl: 'https://picsum.photos/seed/user30/200',
    email: 'emily.white@example.com', phone: '(555) 101-0101', vision: "Building beautiful, high-performance, cross-platform mobile applications from a single codebase with Flutter.",
    skills: ['Flutter', 'Dart', 'Mobile Development', 'Firebase', 'BLoC Pattern', 'Provider'],
    experience: [{ role: 'Flutter Developer', company: 'GreenShift', period: '2022 - Present', description: 'Leading the development of the GreenShift mobile app for iOS and Android.' }],
    portfolio: [], education: [{ institution: 'University of Waterloo', degree: 'B.A.Sc. in Systems Design Engineering', period: '2017-2022' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-31', name: 'Leo Gupta', title: 'Customer Success Manager', location: 'San Francisco, CA', avatarUrl: 'https://picsum.photos/seed/user31/200',
    email: 'leo.gupta@example.com', phone: '(555) 123-1122', vision: "Ensuring customers achieve their desired outcomes while using our product. I'm passionate about building strong relationships and turning clients into advocates.",
    skills: ['Customer Success', 'SaaS', 'Account Management', 'Salesforce', 'Customer Onboarding'],
    experience: [{ role: 'Customer Success Manager', company: 'Nexus B2B', period: '2020 - Present', description: 'Manage a portfolio of 50 enterprise accounts, maintaining a 98% retention rate.' }],
    portfolio: [], education: [{ institution: 'University of California, Davis', degree: 'B.A. in Communications', period: '2015-2019' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-32', name: 'Mia Rodriguez', title: 'Technical Program Manager', location: 'Seattle, WA', avatarUrl: 'https://picsum.photos/seed/user32/200',
    email: 'mia.rodriguez@example.com', phone: '(555) 456-2233', vision: "Driving complex, cross-functional technical projects from inception to launch, ensuring alignment and clear communication across all stakeholders.",
    skills: ['Program Management', 'Agile', 'Scrum', 'Stakeholder Management', 'Jira', 'Roadmapping'],
    experience: [{ role: 'Technical Program Manager', company: 'OmniCorp', period: '2018 - Present', description: 'Managed the launch of a new cloud service, coordinating work across 5 engineering teams.' }],
    portfolio: [], education: [{ institution: 'University of Washington', degree: 'M.S. in Information Management', period: '2016-2018' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Spanish', proficiency: 'Conversational' }], connections: []
  },
  {
    id: 'user-33', name: 'Noah Evans', title: 'Brand Designer', location: 'Los Angeles, CA', avatarUrl: 'https://picsum.photos/seed/user33/200',
    email: 'noah.evans@example.com', phone: '(555) 789-3344', vision: "Building memorable and cohesive brand identities that tell a story and connect with people on an emotional level.",
    skills: ['Branding', 'Adobe Creative Suite', 'Typography', 'Logo Design', 'UI/UX Design', 'Figma'],
    experience: [{ role: 'Brand Designer', company: 'PixelStorm Creative', period: '2021 - Present', description: 'Led the rebranding for three major clients, resulting in increased brand recognition.' }],
    portfolio: [], education: [{ institution: 'ArtCenter College of Design', degree: 'B.F.A. in Graphic Design', period: '2017-2021' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-34', name: 'Olivia Baker', title: 'C++ Game Developer', location: 'Austin, TX', avatarUrl: 'https://picsum.photos/seed/user34/200',
    email: 'olivia.baker@example.com', phone: '(555) 111-4455', vision: "Writing high-performance C++ code to build immersive and engaging gameplay systems for AAA titles.",
    skills: ['C++', 'Game Development', 'Unreal Engine', 'Physics Programming', 'Blueprints'],
    experience: [{ role: 'Gameplay Programmer', company: 'Epic Games', period: '2019 - Present', description: 'Developed core player mechanics and AI systems for unannounced projects.' }],
    portfolio: [], education: [{ institution: 'The Guildhall at SMU', degree: 'Master of Interactive Technology', period: '2017-2019' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-35', name: 'Peter Quinn', title: 'HR Business Partner', location: 'Boston, MA', avatarUrl: 'https://picsum.photos/seed/user35/200',
    email: 'peter.quinn@example.com', phone: '(555) 222-5566', vision: "Partnering with leadership to develop and execute HR strategies that support business objectives and foster a positive, high-performance culture.",
    skills: ['HR Strategy', 'Employee Relations', 'Performance Management', 'Talent Development', 'Compensation'],
    experience: [{ role: 'HR Business Partner', company: 'QuantumLeap R&D', period: '2020 - Present', description: 'Serve as the primary HR contact for the research and engineering departments.' }],
    portfolio: [], education: [{ institution: 'Cornell University', degree: 'M.S. in Industrial and Labor Relations', period: '2017-2019' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-36', name: 'Riley Jones', title: 'Frontend Developer (Vue.js)', location: 'Remote', avatarUrl: 'https://picsum.photos/seed/user36/200',
    email: 'riley.jones@example.com', phone: '(555) 333-6677', vision: "Building beautiful and performant user interfaces with Vue.js and the modern frontend ecosystem.",
    skills: ['Vue.js', 'Nuxt.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Frontend Development'],
    experience: [{ role: 'Frontend Developer', company: 'GitLab', period: '2020 - Present', description: 'Contribute to the main GitLab frontend, focusing on performance and accessibility.' }],
    portfolio: [], education: [{ institution: 'Self-taught', degree: 'Frontend Development', period: '2018 - Present' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-37', name: 'Sofia Garcia', title: 'Cloud Security Engineer', location: 'Washington D.C.', avatarUrl: 'https://picsum.photos/seed/user37/200',
    email: 'sofia.garcia@example.com', phone: '(555) 444-7788', vision: "Securing cloud environments through proactive threat modeling, automated guardrails, and rapid incident response.",
    skills: ['Cloud Security', 'AWS Security', 'Terraform', 'Python', 'DevSecOps', 'Kubernetes'],
    experience: [{ role: 'Cloud Security Engineer', company: 'Amazon Web Services', period: '2021 - Present', description: 'Build security automation and tooling for internal service teams.' }],
    portfolio: [], education: [{ institution: 'Carnegie Mellon University', degree: 'M.S. in Information Security', period: '2019-2021' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-38', name: 'Tom Harris', title: 'Investor Relations', location: 'New York, NY', avatarUrl: 'https://picsum.photos/seed/user38/200',
    email: 'tom.harris@example.com', phone: '(555) 555-8899', vision: "Communicating a company's story and financial performance to the investment community to build long-term shareholder value.",
    skills: ['Investor Relations', 'Financial Modeling', 'Pitch Decks', 'Capital Raising', 'SEC Filings'],
    experience: [{ role: 'Director, Investor Relations', company: 'Fintech Innovators', period: '2021 - Present', description: 'Manage all communication with current and potential investors.' }],
    portfolio: [], education: [{ institution: 'NYU Stern School of Business', degree: 'M.B.A.', period: '2017-2019' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-39', name: 'Uma Patel', title: 'Ruby on Rails Developer', location: 'Remote (US)', avatarUrl: 'https://picsum.photos/seed/user39/200',
    email: 'uma.patel@example.com', phone: '(555) 666-9900', vision: "Building and maintaining scalable and maintainable web applications with the Ruby on Rails framework.",
    skills: ['Ruby on Rails', 'Ruby', 'PostgreSQL', 'Heroku', 'Backend Development', 'RSpec'],
    experience: [{ role: 'Backend Engineer', company: 'Shopify', period: '2019 - Present', description: 'Work on the core monolith, improving performance and adding new features for merchants.' }],
    portfolio: [], education: [{ institution: 'University of Michigan', degree: 'B.S.E. in Computer Science', period: '2015-2019' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
  {
    id: 'user-40', name: 'Vincent Lee', title: 'Customer Support Lead', location: 'Phoenix, AZ', avatarUrl: 'https://picsum.photos/seed/user40/200',
    email: 'vincent.lee@example.com', phone: '(555) 777-0011', vision: "Leading a team of support specialists to provide exceptional, empathetic, and efficient customer service.",
    skills: ['Customer Support', 'Zendesk', 'Intercom', 'Team Leadership', 'SLAs', 'Helpdesk Management'],
    experience: [{ role: 'Customer Support Lead', company: 'PixelStorm Creative', period: '2022 - Present', description: 'Manage a team of 5 support agents and improved customer satisfaction score by 10 points.' }],
    portfolio: [], education: [{ institution: 'Arizona State University', degree: 'B.A. in Business Communication', period: '2016-2020' }], certifications: [],
    languages: [{ name: 'English', proficiency: 'Native' }], connections: []
  },
];

// --- COMPANIES (10 total) ---
export const MOCK_COMPANIES: Company[] = [
  {
      id: 'company-1',
      name: 'Visionary AI',
      logoUrl: 'https://picsum.photos/seed/logo/200',
      tagline: 'The AI co-pilot for creative professionals.',
      website: 'https://visionary.ai',
      location: 'San Francisco, CA',
      industry: 'Artificial Intelligence',
      size: '1-10 employees',
      about: "Visionary AI is on a mission to build the next generation of creative tools, powered by artificial intelligence. We believe that AI should be a collaborative partner, augmenting human creativity, not replacing it. We're a small, passionate team of builders, designers, and researchers, backed by top-tier investors who share our vision.",
      vision: "To empower creative professionals and automate tedious tasks, allowing humans to focus on high-level strategy and innovation.",
      isVerified: true,
      team: [{ userId: 'user-1', role: 'Owner' }, { userId: 'user-16', role: 'Recruiter'}, { userId: 'user-18', role: 'Admin'}],
      integrations: { google: true, microsoft: false },
  },
  {
      id: 'company-2',
      name: 'Fintech Innovators',
      logoUrl: 'https://picsum.photos/seed/company2/200',
      tagline: 'Modern banking for the digital age.',
      website: 'https://fintechinnovators.com',
      location: 'New York, NY',
      industry: 'Financial Technology',
      size: '11-50 employees',
      about: "We are building a mobile banking application from the ground up, designed for transparency, ease of use, and financial wellness. We believe managing your finances should be simple and empowering.",
      vision: "To make banking accessible and fair for everyone.",
      isVerified: true,
      team: [{ userId: 'user-6', role: 'Owner' }, { userId: 'user-11', role: 'Recruiter'}],
      integrations: { google: true, microsoft: true },
  },
  {
    id: 'company-3', name: 'QuantumLeap R&D', logoUrl: 'https://picsum.photos/seed/company3/200',
    tagline: 'Solving impossible problems with quantum computing.', website: 'https://quantumleap.dev', location: 'Cambridge, MA',
    industry: 'Deep Tech', size: '11-50 employees', about: 'We are a research-focused organization dedicated to breaking new ground in quantum algorithms and hardware.',
    vision: 'To unlock the power of quantum computing to solve humanity\'s most complex challenges in medicine, materials science, and beyond.',
    isVerified: true, team: [],
  },
  {
    id: 'company-4', name: 'GreenShift', logoUrl: 'https://picsum.photos/seed/company4/200',
    tagline: 'Sustainable supply chains for a better planet.', website: 'https://greenshift.eco', location: 'Remote',
    industry: 'Sustainability Tech', size: '1-10 employees', about: 'Our platform helps businesses track and reduce their carbon footprint across their supply chain.',
    vision: 'To build a global economic system where sustainability is not just a choice, but the standard.',
    isVerified: false, team: [{ userId: 'user-4', role: 'Owner' }],
  },
  {
    id: 'company-5', name: 'PixelStorm Creative', logoUrl: 'https://picsum.photos/seed/company5/200',
    tagline: 'Award-winning digital experiences.', website: 'https://pixelstorm.io', location: 'Los Angeles, CA',
    industry: 'Digital Agency', size: '51-200 employees', about: 'We are a full-service digital agency that partners with leading brands to create stunning websites, apps, and campaigns.',
    vision: 'To blend art and technology to create unforgettable digital experiences.',
    isVerified: true, team: [{ userId: 'user-3', role: 'Admin' }, { userId: 'user-12', role: 'Recruiter'}],
  },
  {
    id: 'company-6', name: 'Nexus B2B', logoUrl: 'https://picsum.photos/seed/company6/200',
    tagline: 'The operating system for modern sales teams.', website: 'https://nexusb2b.com', location: 'New York, NY',
    industry: 'SaaS', size: '51-200 employees', about: 'Our CRM and sales enablement platform helps B2B companies close more deals, faster.',
    vision: 'To empower sales professionals with the data and tools they need to succeed.',
    isVerified: false, team: [{ userId: 'user-8', role: 'Owner' }, { userId: 'user-10', role: 'Admin'}, { userId: 'user-15', role: 'Admin'}],
  },
  {
    id: 'company-7', name: 'Aperture Robotics', logoUrl: 'https://picsum.photos/seed/company7/200',
    tagline: 'Intelligent automation for manufacturing.', website: 'https://aperturerobo.com', location: 'Pittsburgh, PA',
    industry: 'Robotics', size: '11-50 employees', about: 'We build collaborative robots (cobots) that work alongside humans to improve safety and productivity in factories.',
    vision: 'To create a future where humans and robots collaborate seamlessly to build a better world.',
    isVerified: false, team: [],
  },
  {
    id: 'company-8', name: 'DeFi Secure', logoUrl: 'https://picsum.photos/seed/company8/200',
    tagline: 'Auditing and security for the decentralized world.', website: 'https://defisecure.xyz', location: 'Remote (Global)',
    industry: 'Blockchain', size: '1-10 employees', about: 'Our team of world-class security researchers audits smart contracts to protect users and protocols from exploits.',
    vision: 'To make the decentralized web a safer place for everyone.',
    isVerified: true, team: [{ userId: 'user-19', role: 'Owner' }, { userId: 'user-13', role: 'Admin' }],
  },
  {
    id: 'company-9', name: 'Momentum Growth', logoUrl: 'https://picsum.photos/seed/company9/200',
    tagline: 'The growth marketing agency for tech startups.', website: 'https://momentum.agency', location: 'Austin, TX',
    industry: 'Marketing', size: '11-50 employees', about: 'We provide data-driven growth marketing services, from SEO and content to PPC and community building.',
    vision: 'To be the go-to partner for startups looking to scale their growth.',
    isVerified: false, team: [{ userId: 'user-2', role: 'Owner' }, { userId: 'user-20', role: 'Recruiter' }],
  },
  {
    id: 'company-10', name: 'OmniCorp', logoUrl: 'https://picsum.photos/seed/company10/200',
    tagline: 'Innovating for a connected world.', website: 'https://omnicorp.com', location: 'Seattle, WA',
    industry: 'Technology', size: '501+ employees', about: 'OmniCorp is a global technology leader with a diverse portfolio of products and services spanning cloud computing, consumer electronics, and enterprise software.',
    vision: 'To organize the world\'s information and make it universally accessible and useful.',
    isVerified: true, team: [{ userId: 'user-7', role: 'Admin' }, { userId: 'user-17', role: 'Recruiter' }],
  }
];

// --- MOCK AI ANALYSIS GENERATOR ---
const generateMockAIAssistantAnalysis = (user: User, job: Job, company: Company): AIAssistantAnalysis & { userId: string } => {
    const matchingSkills = user.skills.filter(s => job.skills.includes(s));
    const skillMatchRatio = job.skills.length > 0 ? matchingSkills.length / job.skills.length : 0;
    
    // Base score on skill match, with some randomness
    const baseScore = Math.round(skillMatchRatio * 80) + Math.floor(Math.random() * 20);
    const fitScore = Math.min(100, baseScore); // Cap at 100

    const summary = fitScore > 80 
        ? `A strong candidate with an impressive overlap in required skills and relevant experience in the industry.`
        : fitScore > 60
        ? `A promising candidate with a good foundation in key skills, though may lack experience in some secondary areas.`
        : `A potential fit, but there are notable gaps in their experience or skills compared to the job requirements.`;

    const skillValidation = job.skills.map(skill => {
        const hasSkill = user.skills.includes(skill);
        const evidence = hasSkill 
            ? `Demonstrated skill in their role as ${user.experience[0]?.role || 'a previous position'}.`
            : `No direct evidence of this skill was found in their profile.`;
        return { skill, hasEvidence: hasSkill, evidence };
    });
    
    const projectDeepDive = user.portfolio.length > 0 
        ? `${user.portfolio[0].name} shows their capability in building applications, which aligns well with our need for a hands-on developer.`
        : `The candidate's profile does not feature specific projects, making it harder to assess practical application of skills.`;
        
    const cultureAlignment = `The candidate's vision to "${user.vision.substring(0, 50)}..." shows a potential alignment with ${company.name}'s mission to "${company.vision.substring(0, 50)}...".`;

    const interviewQuestions = [
        `Can you tell me about a project where you used ${matchingSkills[0] || job.skills[0]} to solve a difficult problem?`,
        `How does your personal career vision align with what we are building here at ${company.name}?`,
        `Looking at our job description, where do you see your biggest area for growth?`,
    ];
    
    const aiSuggestion = fitScore >= 85 ? 'shortlist' : fitScore < 50 ? 'reject' : null;

    const strengths = skillValidation.filter(s => s.hasEvidence).map(s => `Strong proficiency in ${s.skill}.`);
    if (user.experience.length > 2) strengths.push("Extensive professional experience.");

    const weaknesses = skillValidation.filter(s => !s.hasEvidence).map(s => `Lacks demonstrated experience in ${s.skill}.`);
    if (user.experience.length < 2) weaknesses.push("Relatively light on professional experience.");


    return {
        userId: user.id,
        fitScore,
        summary,
        strengths: strengths.slice(0, 3),
        weaknesses: weaknesses.slice(0, 2),
        skillValidation,
        projectDeepDive,
        cultureAlignment,
        interviewQuestions,
        aiSuggestion,
    };
};

// --- APPLICANT GENERATOR ---
// FIX: Updated function signature to accept job and company for accurate AI analysis generation.
const generateApplicants = (job: Job, company: Company): ApplicantDetails[] => {
    const applicants: ApplicantDetails[] = [];
    const statuses: ApplicantStatus[] = ['Applied', 'Shortlisted', ...job.interviewRounds.map(r => r.name), 'Hired', 'Rejected'];
    
    // Find users who have at least one matching skill
    const relevantUsers = MOCK_USERS.filter(u => u.skills.some(s => job.skills.includes(s)));
    const numApplicants = Math.min(relevantUsers.length, Math.floor(Math.random() * 6) + 15); // Generate between 15 and 20 applicants
  
    // Shuffle and pick
    const shuffled = relevantUsers.sort(() => 0.5 - Math.random());
    const selectedUsers = shuffled.slice(0, numApplicants);
    
    selectedUsers.forEach(user => {
      // Skew status distribution
      const rand = Math.random();
      let status: ApplicantStatus;
      if (rand < 0.05) status = 'Hired';
      else if (rand < 0.15) status = 'Founder Chat';
      else if (rand < 0.3) status = 'Technical Interview';
      else if (rand < 0.5) status = 'Shortlisted';
      else if (rand < 0.7) status = 'Rejected';
      else status = 'Applied';

      // FIX: Generate mock AI analysis for every applicant.
      const analysis = generateMockAIAssistantAnalysis(user, job, company);
  
      applicants.push({
        userId: user.id,
        status: status,
        // FIX: Base rating on AI fit score for realism.
        rating: Math.ceil(analysis.fitScore / 20),
        aiAssistantAnalysis: analysis,
        aiSuggestion: analysis.aiSuggestion,
        hasBeenReviewed: Math.random() > 0.4, // Randomly mark some as reviewed
      });
    });
  
    return applicants;
};
  

// --- JOBS (30+) ---
// FIX: Create jobs in a separate array first to allow passing the job object to the applicant generator.
const rawJobs: Omit<Job, 'applicantDetails'>[] = [
  // Job 1
  {
    id: 'job-1',
    title: 'Founding Frontend Engineer',
    companyId: 'company-1',
    location: 'Remote (US)',
    type: 'Full-time',
    postedDate: '3d ago',
    status: 'Open',
    description: "Visionary AI is seeking a passionate Frontend Engineer to be a foundational member of our team. You'll work directly with the founder to build our AI-powered creative suite from the ground up, shaping the product's user experience and technical direction. This is a unique opportunity to have a massive impact on a product that will redefine creative workflows.",
    skills: ['React', 'TypeScript', 'Next.js', 'UI/UX Design'],
    posterId: 'user-1',
    likes: 142,
    comments: [ { id: 'c1', authorId: 'user-3', text: 'Looks like an amazing opportunity!', timestamp: '2d ago' } ],
    salaryRange: '$160k - $210k', experienceLevel: 'Senior',
    responsibilities: [
        "Develop and maintain the main user interface for our AI creative tools.",
        "Collaborate with the founder on UI/UX design and product decisions.",
        "Build and maintain a reusable component library.",
        "Ensure the application is performant, accessible, and scalable."
    ],
    qualifications: [
        "5+ years of professional experience with React and TypeScript.",
        "Strong understanding of modern frontend frameworks (Next.js preferred).",
        "A keen eye for design and user experience.",
        "Experience building complex, data-driven applications."
    ],
    benefits: [ "Competitive salary and equity package.", "Flexible remote work environment.", "Health, dental, and vision insurance.", "Generous PTO and company holidays." ],
    interviewRounds: [
        { name: 'Technical Screening', description: '30-minute call with the founder to discuss your background and technical skills.' },
        { name: 'Take-Home Project', description: 'A small project to assess your coding and problem-solving abilities.' },
        { name: 'Founder Chat', description: 'Final conversation about vision, culture, and your role in the company.' }
    ]
  },
  // Job 2
  {
    id: 'job-2', title: 'Senior Backend Engineer (Go)', companyId: 'company-2', location: 'New York, NY (Hybrid)', type: 'Full-time',
    postedDate: '1w ago', status: 'Open', description: "Fintech Innovators is looking for an experienced Go developer to join our backend team. You will be responsible for building and maintaining the microservices that power our mobile banking application, focusing on security, scalability, and performance.",
    skills: ['Go (Golang)', 'Microservices', 'PostgreSQL', 'AWS'],
    posterId: 'user-6', likes: 95, comments: [],
    salaryRange: '$170k - $220k', experienceLevel: 'Senior',
    interviewRounds: [ { name: 'Hiring Manager Screen', description: 'Chat with our Head of Engineering.' }, { name: 'Technical Deep Dive', description: 'System design and coding interview with the team.' }, { name: 'Final Interview', description: 'Meet with the founding team.' } ]
  },
  // Job 3
  {
    id: 'job-3', title: 'Product Manager, Core Platform', companyId: 'company-6', location: 'Remote', type: 'Full-time',
    postedDate: '2w ago', status: 'Open', description: "Nexus B2B is seeking a Product Manager to own the roadmap for our core CRM platform. You'll work with engineering, design, and sales to define features that drive value for our customers.",
    skills: ['Product Roadmapping', 'Agile Methodologies', 'User Stories', 'SaaS'],
    posterId: 'user-8', likes: 110, comments: [],
    salaryRange: '$150k - $190k', experienceLevel: 'Mid',
    interviewRounds: [ { name: 'Initial Screen', description: 'Chat with our Director of Product.' }, { name: 'Case Study', description: 'Present your approach to a product problem.' }, { name: 'Final Round', description: 'Meet with stakeholders across the company.' } ]
  },
  // Job 4
  {
    id: 'job-4', title: 'Content Strategist', companyId: 'company-9', location: 'Austin, TX', type: 'Full-time',
    postedDate: '5d ago', status: 'Open', description: "Join Momentum Growth and help shape the voice of top tech startups. You will develop and execute content strategies that drive organic growth and build brand authority.",
    skills: ['Content Strategy', 'SEO', 'Copywriting', 'Brand Voice'],
    posterId: 'user-2', likes: 78, comments: [],
    salaryRange: '$80k - $110k', experienceLevel: 'Mid',
    interviewRounds: [ { name: 'Portfolio Review', description: 'Walk us through your past work.' }, { name: 'Content Exercise', description: 'A short take-home assignment.' }, { name: 'Team Interview', description: 'Meet the team.' } ]
  },
  // Job 5
  {
    id: 'job-5', title: 'Machine Learning Engineer', companyId: 'company-1', location: 'San Francisco, CA', type: 'Full-time',
    postedDate: '1d ago', status: 'Open', description: "As a Machine Learning Engineer at Visionary AI, you will research, build, and deploy generative models that power our next-generation creative tools. You will be at the forefront of applied AI research.",
    skills: ['Python', 'PyTorch', 'MLOps', 'Natural Language Processing'],
    posterId: 'user-1', likes: 215, comments: [],
    salaryRange: '$180k - $240k', experienceLevel: 'Senior',
    interviewRounds: [ { name: 'Technical Screen', description: 'Discuss past ML projects.' }, { name: 'System Design', description: 'Design an ML system for a specific problem.' }, { name: 'Founder Chat', description: 'Final interview with Alex.' } ]
  },
  // ... Adding 25 more jobs
  { id: 'job-6', title: 'DevOps Engineer', companyId: 'company-10', location: 'Seattle, WA', type: 'Full-time', postedDate: '1mo ago', status: 'Open', description: 'Maintain and scale the cloud infrastructure for OmniCorp\'s flagship products.', skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'], posterId: 'user-7', likes: 88, comments: [], interviewRounds: [] },
  { id: 'job-7', title: 'Junior Product Designer', companyId: 'company-5', location: 'Los Angeles, CA', type: 'Internship', postedDate: '2d ago', status: 'Open', description: 'Join our design team as an intern and learn how to create world-class user experiences.', skills: ['Figma', 'UI/UX Design', 'Prototyping'], posterId: 'user-3', likes: 150, comments: [], interviewRounds: [] },
  { id: 'job-8', title: 'Smart Contract Auditor', companyId: 'company-8', location: 'Remote (Global)', type: 'Contract', postedDate: '1w ago', status: 'Open', description: 'Audit DeFi protocols for security vulnerabilities and best practices.', skills: ['Solidity', 'Smart Contracts', 'Security'], posterId: 'user-19', likes: 120, comments: [], interviewRounds: [] },
  { id: 'job-9', title: 'Quantum Research Scientist', companyId: 'company-3', location: 'Cambridge, MA', type: 'Full-time', postedDate: '3w ago', status: 'Open', description: 'Conduct foundational research in quantum algorithms.', skills: ['Quantum Computing', 'Python', 'Qiskit'], posterId: 'user-1', likes: 99, comments: [], interviewRounds: [] },
  { id: 'job-10', title: 'Robotics Software Engineer', companyId: 'company-7', location: 'Pittsburgh, PA', type: 'Full-time', postedDate: '6d ago', status: 'Open', description: 'Develop software for our next generation of collaborative robots.', skills: ['C++', 'ROS', 'Robotics', 'Computer Vision'], posterId: 'user-1', likes: 130, comments: [], interviewRounds: [] },
  { id: 'job-11', title: 'Sustainability Analyst', companyId: 'company-4', location: 'Remote', type: 'Part-time', postedDate: '10d ago', status: 'Open', description: 'Help our clients analyze and report on their supply chain emissions.', skills: ['Data Analysis', 'Sustainability', 'Excel'], posterId: 'user-4', likes: 65, comments: [], interviewRounds: [] },
  { id: 'job-12', title: 'Enterprise Account Executive', companyId: 'company-6', location: 'New York, NY', type: 'Full-time', postedDate: '1mo ago', status: 'Open', description: 'Close large enterprise deals for our B2B SaaS platform.', skills: ['Enterprise Sales', 'Salesforce', 'Negotiation'], posterId: 'user-8', likes: 72, comments: [], interviewRounds: [] },
  { id: 'job-13', title: 'iOS Engineer', companyId: 'company-2', location: 'New York, NY', type: 'Full-time', postedDate: '4d ago', status: 'Open', description: 'Build and maintain our native iOS banking application.', skills: ['Swift', 'SwiftUI', 'iOS'], posterId: 'user-6', likes: 115, comments: [], interviewRounds: [] },
  { id: 'job-14', title: 'Technical Recruiter', companyId: 'company-1', location: 'San Francisco, CA', type: 'Full-time', postedDate: '1w ago', status: 'Open', description: 'Join our team to find and hire the best engineering talent.', skills: ['Recruiting', 'Sourcing', 'Technical Hiring'], posterId: 'user-1', likes: 80, comments: [], interviewRounds: [] },
  { id: 'job-15', title: 'Data Engineer', companyId: 'company-10', location: 'Seattle, WA', type: 'Full-time', postedDate: '3d ago', status: 'Open', description: 'Build and maintain our data pipelines and infrastructure.', skills: ['SQL', 'Python', 'Spark', 'Airflow'], posterId: 'user-7', likes: 140, comments: [], interviewRounds: [] },
  { id: 'job-16', title: 'UX Researcher', companyId: 'company-5', location: 'Remote', type: 'Full-time', postedDate: '2w ago', status: 'Open', description: 'Conduct user research to inform product design and strategy.', skills: ['User Research', 'Usability Testing', 'Survey Design'], posterId: 'user-3', likes: 90, comments: [], interviewRounds: [] },
  { id: 'job-17', title: 'Marketing Operations Manager', companyId: 'company-9', location: 'Austin, TX', type: 'Full-time', postedDate: '1mo ago', status: 'Closed', description: 'Manage our marketing technology stack and automation workflows.', skills: ['HubSpot', 'Marketo', 'Marketing Automation'], posterId: 'user-2', likes: 55, comments: [], interviewRounds: [] },
  { id: 'job-18', title: 'Full-Stack Engineer', companyId: 'company-4', location: 'Remote', type: 'Full-time', postedDate: '1d ago', status: 'Open', description: 'Build new features across our entire stack, from our React frontend to our Python backend.', skills: ['React', 'Python', 'Node.js', 'PostgreSQL'], posterId: 'user-4', likes: 180, comments: [], interviewRounds: [] },
  { id: 'job-19', title: 'Security Engineer', companyId: 'company-8', location: 'Remote (Global)', type: 'Full-time', postedDate: '2w ago', status: 'Open', description: 'Work on application security and infrastructure protection for web3 protocols.', skills: ['Security', 'Penetration Testing', 'AWS'], posterId: 'user-19', likes: 105, comments: [], interviewRounds: [] },
  { id: 'job-20', title: 'Lead Product Manager', companyId: 'company-10', location: 'Seattle, WA', type: 'Full-time', postedDate: '5d ago', status: 'Open', description: 'Lead a team of PMs and define the strategy for a major product line.', skills: ['Product Management', 'Team Leadership', 'Product Strategy'], posterId: 'user-7', likes: 160, comments: [], interviewRounds: [] },
  { id: 'job-21', title: 'Android Engineer', companyId: 'company-2', location: 'New York, NY', type: 'Full-time', postedDate: '1w ago', status: 'Open', description: 'Develop our native Android banking application using Kotlin and Jetpack Compose.', skills: ['Kotlin', 'Android', 'Jetpack Compose'], posterId: 'user-6', likes: 112, comments: [], interviewRounds: [] },
  { id: 'job-22', title: 'Creative Director', companyId: 'company-5', location: 'Los Angeles, CA', type: 'Full-time', postedDate: '3w ago', status: 'Open', description: 'Lead the creative vision for our top clients\' campaigns and digital products.', skills: ['Creative Direction', 'UI/UX Design', 'Branding'], posterId: 'user-3', likes: 98, comments: [], interviewRounds: [] },
  { id: 'job-23', title: 'Solutions Architect', companyId: 'company-6', location: 'Remote', type: 'Full-time', postedDate: '1d ago', status: 'Open', description: 'Work with enterprise customers to design and implement solutions using the Nexus B2B platform.', skills: ['Solutions Architecture', 'SaaS', 'APIs'], posterId: 'user-8', likes: 125, comments: [], interviewRounds: [] },
  { id: 'job-24', title: 'Community Manager', companyId: 'company-9', location: 'Remote', type: 'Full-time', postedDate: '2d ago', status: 'Open', description: 'Build and engage our online community of marketing professionals.', skills: ['Community Management', 'Social Media Strategy', 'Content Creation'], posterId: 'user-2', likes: 85, comments: [], interviewRounds: [] },
  { id: 'job-25', title: 'AI Ethics Researcher', companyId: 'company-1', location: 'Remote', type: 'Contract', postedDate: '1w ago', status: 'Open', description: 'Research and advise on the ethical implications of our AI models and products.', skills: ['AI Ethics', 'Research', 'Machine Learning'], posterId: 'user-1', likes: 190, comments: [], interviewRounds: [] },
  { id: 'job-26', title: 'Hardware Engineer', companyId: 'company-7', location: 'Pittsburgh, PA', type: 'Full-time', postedDate: '2w ago', status: 'Open', description: 'Design and test the next generation of our robotic hardware.', skills: ['PCB Design', 'CAD', 'Embedded Systems'], posterId: 'user-1', likes: 110, comments: [], interviewRounds: [] },
  { id: 'job-27', title: 'Chief of Staff', companyId: 'company-1', location: 'San Francisco, CA', type: 'Full-time', postedDate: '1d ago', status: 'Open', description: 'Work directly with the CEO to drive strategic initiatives and operational excellence.', skills: ['Strategy', 'Operations', 'Project Management'], posterId: 'user-1', likes: 250, comments: [], interviewRounds: [] },
  { id: 'job-28', title: 'Customer Success Manager', companyId: 'company-6', location: 'Remote', type: 'Full-time', postedDate: '4d ago', status: 'Open', description: 'Ensure our B2B customers are successful and happy with our platform.', skills: ['Customer Success', 'SaaS', 'Account Management'], posterId: 'user-8', likes: 95, comments: [], interviewRounds: [] },
  { id: 'job-29', title: 'Frontend Developer (Vue.js)', companyId: 'company-4', location: 'Remote', type: 'Full-time', postedDate: '1w ago', status: 'Open', description: 'Join our team to build out the frontend of our sustainability dashboard using Vue.js.', skills: ['Vue.js', 'JavaScript', 'TypeScript'], posterId: 'user-4', likes: 100, comments: [], interviewRounds: [] },
  { id: 'job-30', title: 'Blockchain Research Engineer', companyId: 'company-8', location: 'Remote (Global)', type: 'Full-time', postedDate: '1mo ago', status: 'Closed', description: 'Research new layer 2 scaling solutions and cryptographic primitives.', skills: ['Blockchain', 'Cryptography', 'Research'], posterId: 'user-19', likes: 135, comments: [], interviewRounds: [] },
];

export const MOCK_JOBS: Job[] = rawJobs.map(job => {
    const company = MOCK_COMPANIES.find(c => c.id === job.companyId);
    if (!company) {
        // This should not happen with consistent mock data
        return { ...job, applicantDetails: [] };
    }
    return {
        ...job,
        // FIX: Pass the full job and company objects to generate realistic, data-rich applicants.
        applicantDetails: generateApplicants(job as Job, company),
    };
});


// Data consistency fix: Ensure applicant statuses match the job's defined interview rounds.
MOCK_JOBS.forEach(job => {
    const interviewStages = job.interviewRounds.map(r => r.name);
    if (interviewStages.length > 0) {
        job.applicantDetails.forEach(applicant => {
            // These are generic statuses from the old generator that might not exist in a specific job's pipeline.
            const genericInterviewStatuses = ['Technical Interview', 'Founder Chat'];
            if (genericInterviewStatuses.includes(applicant.status) && !interviewStages.includes(applicant.status)) {
                // Replace with a random, valid interview stage for this job.
                applicant.status = interviewStages[Math.floor(Math.random() * interviewStages.length)];
            }
        });
    }
});

// --- CONVERSATIONS ---
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['user-1', 'user-3'],
    messages: [
      { id: 'msg-1', senderId: 'user-1', text: "Hi Carlos, Alex here from Visionary AI. I was incredibly impressed with your portfolio and your thoughtful application for the Founding Frontend Engineer role. We'd love to move forward to the technical screening. Let me know what times work for you.", jobId: 'job-1', timestamp: '2h ago', isRead: false },
      { id: 'msg-2', senderId: 'user-3', text: "Hey Alex, thanks so much for reaching out! That's great news. I'm available Tuesday or Wednesday afternoon next week. Looking forward to it!", jobId: 'job-1', timestamp: '1h ago', isRead: true },
    ],
  },
  {
    id: 'conv-2',
    participantIds: ['user-1', 'user-5'],
    messages: [
      { id: 'msg-3', senderId: 'user-5', text: "Alex - great to connect. Evelyn Reed from Horizon Ventures. Your work on Visionary AI is impressive. We're actively investing in the AI-native creative space. Would you be open to a brief chat next week?", timestamp: '1d ago', isRead: true },
      { id: 'msg-4', senderId: 'user-1', text: "Hi Evelyn, absolutely. It's great to hear from you. Your firm has a fantastic reputation. I'd be happy to connect. I'll send over a few time slots.", timestamp: '1d ago', isRead: false },
    ],
  },
   {
    id: 'conv-3',
    participantIds: ['user-1', 'user-19'],
    messages: [
      { id: 'msg-5', senderId: 'user-19', text: "Hey Alex, saw you're interested in TerraNova. As a Solidity dev, I'm really intrigued by your idea of using blockchain for verification. Have you considered using zk-SNARKs for privacy?", timestamp: '2d ago', isRead: true },
    ],
  },
];

// --- STORIES ---
export const MOCK_STORIES: Story[] = [
  {
    id: 'story-1',
    title: "From Side Project to Seed Round: My Founder Journey",
    excerpt: "It all started with a simple idea in a coffee shop. I never imagined that a small side project would eventually lead to a $2M seed round. Here's the story of the highs, the lows, and the lessons learned along the way.",
    content: "It all started with a simple idea in a coffee shop. I never imagined that a small side project would eventually lead to a $2M seed round. Here's the story of the highs, the lows, and the lessons learned along the way.\n\nThe initial prototype was built over a weekend, fueled by caffeine and a passion for solving a problem I faced every day. The first version was clunky, but it worked. I shared it with a few friends, and their positive feedback was the encouragement I needed to keep going. We iterated, we listened, and we slowly built a community of early adopters who believed in our vision.",
    authorId: 'user-1',
    companyId: 'company-1',
    imageUrl: 'https://picsum.photos/seed/story1/800/400',
    engagements: ['user-2', 'user-3', 'user-5', 'user-8'],
    likes: 256,
    comments: [ { id: 'c-s1-1', authorId: 'user-3', text: 'Amazing journey! Thanks for sharing.', timestamp: '3d ago' } ],
    shares: 42,
    category: 'Founder Journey', tags: ['startups', 'funding', 'entrepreneurship'], readingTime: 5, status: 'Published',
  },
  {
    id: 'story-2',
    title: "The Art of Community: How We Grew to 250k Users",
    excerpt: "Growth isn't just about ads and SEO. It's about building a place where people feel they belong. I'm sharing the community-led growth strategies that helped us scale our user base without a massive marketing budget.",
    content: "Growth isn't just about ads and SEO. It's about building a place where people feel they belong. I'm sharing the community-led growth strategies that helped us scale our user base without a massive marketing budget. Our philosophy was simple: empower our most passionate users. We created an ambassador program, hosted regular virtual meetups, and made sure to listen to and act on feedback. This created a flywheel effect where our community became our best marketing channel.",
    authorId: 'user-2',
    companyId: 'company-9',
    imageUrl: 'https://picsum.photos/seed/story2/800/400',
    engagements: ['user-1', 'user-15'],
    likes: 189, comments: [], shares: 23,
    category: 'Growth Hacking', tags: ['community', 'marketing', 'growth'], readingTime: 4, status: 'Published',
  },
  {
    id: 'story-3',
    title: "Designing for Delight: Our Process",
    excerpt: "Good design is invisible. Great design is felt. Here's a look into the design process at PixelStorm Creative, from initial research to final pixel-perfect implementation.",
    content: "At PixelStorm, we believe that design is not just about aesthetics; it's about solving problems in an elegant and intuitive way. Our process begins with deep user research. We conduct interviews, create personas, and map out user journeys to truly understand the needs and pain points of our audience. This foundation allows us to build products that not only look good but feel good to use.",
    authorId: 'user-3',
    companyId: 'company-5',
    imageUrl: 'https://picsum.photos/seed/story3/800/400',
    engagements: ['user-1', 'user-9', 'user-12'],
    likes: 310, comments: [], shares: 55,
    category: 'Design Thinking', tags: ['ui/ux', 'design', 'product'], readingTime: 6, status: 'Published',
  },
  {
    id: 'story-4',
    title: "Why Go is the Future for Scalable Backend Systems",
    excerpt: "In the world of microservices and cloud-native applications, Go has emerged as a powerhouse. I'll break down the reasons why we chose Go to build the core of Fintech Innovators and why you should consider it for your next project.",
    content: "When we started building Fintech Innovators, we knew we needed a language that was performant, concurrent, and simple to maintain. Go checked all the boxes. Its built-in support for concurrency with goroutines and channels makes it a natural fit for building microservices that can handle thousands of requests per second. The strong static typing and comprehensive standard library also help us write robust and secure code, which is non-negotiable in the fintech space.",
    authorId: 'user-6',
    imageUrl: 'https://picsum.photos/seed/story4/800/400',
    engagements: ['user-1', 'user-10', 'user-11'],
    likes: 450, comments: [], shares: 89,
    category: 'Tech Deep Dive', tags: ['golang', 'backend', 'engineering'], readingTime: 7, status: 'Published',
  },
  {
    id: 'story-5',
    title: "Why I'm Betting on Next.js for the Future of AI Apps",
    excerpt: "Building interfaces for AI products presents a unique set of challenges. Latency, state management, and server-side rendering are critical. Here's my deep dive into why Next.js is my framework of choice for building the next generation of AI-powered applications.",
    content: "When you're building an AI application, the frontend is more than just a pretty face; it's an integral part of the user's interaction with the model. We need speed, SEO for discoverability, and a seamless developer experience. I've found that Next.js, with its hybrid static and server rendering, provides the perfect toolkit. Server Components allow us to offload heavy computations, keeping the client bundle light, while its integrated routing and API routes make for a cohesive and scalable architecture. For anyone building in the AI space, I can't recommend it enough.",
    authorId: 'user-1',
    imageUrl: 'https://picsum.photos/seed/story5/800/400',
    engagements: ['user-6', 'user-9', 'user-16'],
    likes: 382,
    comments: [],
    shares: 71,
    category: 'Tech Deep Dive',
    tags: ['nextjs', 'ai', 'frontend', 'react'],
    readingTime: 4,
    status: 'Published',
  },
];

// --- SPOTLIGHT ---
export const MOCK_SPOTLIGHT_STARTUP: Startup = {
  id: 'startup-1',
  name: 'DeFi Secure',
  logoUrl: 'https://picsum.photos/seed/company8/200',
  tagline: 'Auditing and security for the decentralized world.',
  vision: "To make the decentralized web a safer place for everyone."
};

// --- TRENDING SKILLS ---
export const MOCK_TRENDING_SKILLS: string[] = [
  'Go (Golang)', 'Machine Learning', 'Solidity', 'Product Management', 'Next.js', 'Growth Marketing', 'Kubernetes', 'LLMs', 'Figma'
];

// --- EVENTS (10 total) ---
export const MOCK_UPCOMING_EVENTS: Event[] = [
  {
    id: 'event-1', title: 'SF Founders & Builders Meetup', date: 'July 15', time: '6:00 PM PST', type: 'Meetup',
    location: 'San Francisco, CA', description: 'Join us for our monthly meetup for founders, engineers, and designers in the Bay Area. Casual networking and great conversations.',
    authorId: 'user-1', rsvps: ['user-2', 'user-3', 'user-8', 'user-18'], coverImageUrl: 'https://picsum.photos/seed/event1/800/400',
    totalSlots: 50, address: '701 Brazos St, Austin, TX 78701', directionsUrl: 'https://maps.app.goo.gl/3494S2s8f2mJc98w5', status: 'Upcoming'
  },
  {
    id: 'event-2', title: 'Building in Public: A Guide for Founders', date: 'July 22', time: '10:00 AM PST', type: 'Webinar',
    location: 'Virtual', description: "Learn how building in public can help you find your first users, attract talent, and build a loyal community. Featuring guest speaker Brenda Smith.",
    authorId: 'user-2', rsvps: ['user-1', 'user-4', 'user-15', 'user-20'],
    speakers: [ { name: 'Brenda Smith', title: 'Head of Growth, Momentum Growth', avatarUrl: 'https://picsum.photos/seed/user2/200' } ], status: 'Upcoming'
  },
  {
    id: 'event-3', title: 'Fintech Innovators Hiring Day', date: 'July 28', time: '9:00 AM - 3:00 PM EST', type: 'Walk-in Interview',
    location: 'New York, NY', description: "Looking for your next opportunity? Fintech Innovators is hosting a walk-in interview day for various roles in engineering, product, and marketing. Bring your resume and your passion!",
    authorId: 'user-6', companyId: 'company-2', rsvps: ['user-3', 'user-11'],
    interestedAttendees: [ { userId: 'user-3', roleTitle: 'Senior Backend Engineer (Go)', attended: false, notes: '' }, { userId: 'user-11', roleTitle: 'Mobile Engineer (iOS/Android)', attended: false, notes: 'Strong candidate, scheduled follow-up.' } ],
    jobSlots: [
        { title: 'Senior Backend Engineer (Go)', description: 'Seeking experienced Go developers to build the core of our banking platform.', skills: ['Go', 'PostgreSQL', 'Docker', 'AWS'] },
        { title: 'Product Manager (Fintech)', description: 'Drive the roadmap for our consumer-facing features.', skills: ['Product Strategy', 'Agile', 'User Research'] },
        { title: 'Mobile Engineer (iOS/Android)', description: 'Join our mobile team to build a world-class native banking experience.', skills: ['Swift', 'Kotlin', 'REST APIs'] },
    ],
    address: '123 Finance St, New York, NY 10001', coverImageUrl: 'https://picsum.photos/seed/event3/800/400', status: 'Upcoming'
  },
  {
    id: 'event-4', title: 'AI in Creative Tech Summit', date: 'Aug 5', type: 'Conference', location: 'Virtual',
    description: 'A full-day conference exploring the intersection of artificial intelligence and creative industries. Featuring talks from leaders at top AI startups.',
    authorId: 'user-1', companyId: 'company-1', rsvps: ['user-3', 'user-5', 'user-7', 'user-16', 'user-20'], totalSlots: 200, status: 'Upcoming',
    speakers: [{name: 'Alex Chen', title: 'CEO, Visionary AI', avatarUrl: 'https://picsum.photos/seed/user1/200'}],
    agenda: [{time: '9 AM', topic: 'Keynote: The Future of AI in Creativity'}, {time: '10 AM', topic: 'Panel: Generative Models for Art & Design'}]
  },
  {
    id: 'event-5', title: 'Web3 Security Meetup', date: 'Aug 10', time: '7:00 PM PST', type: 'Meetup',
    location: 'Remote', description: 'A casual meetup for developers and security researchers in the blockchain space to discuss the latest trends and threats.',
    authorId: 'user-19', companyId: 'company-8', rsvps: ['user-13', 'user-1'], totalSlots: 100, status: 'Upcoming',
  },
  {
    id: 'event-6', title: 'OmniCorp Tech Talk: Scaling Infrastructure', date: 'Aug 12', time: '12:00 PM PST', type: 'Webinar',
    location: 'Virtual', description: 'Join engineers from OmniCorp to learn about how they scale their infrastructure to serve billions of users.',
    authorId: 'user-7', companyId: 'company-10', rsvps: ['user-6', 'user-10', 'user-17'], status: 'Upcoming',
  },
  {
    id: 'event-7', title: 'Intro to Quantum Computing', date: 'Aug 15', type: 'Webinar', location: 'Virtual',
    description: 'Curious about quantum computing? Join this introductory webinar from the team at QuantumLeap R&D to learn the basics.',
    authorId: 'user-1', companyId: 'company-3', rsvps: [], status: 'Upcoming',
  },
  {
    id: 'event-8', title: 'UX Research Jam Session', date: 'Aug 18', type: 'Meetup', location: 'Chicago, IL',
    description: 'An informal get-together for UX researchers and designers in Chicago to share methods and stories.',
    authorId: 'user-12', rsvps: ['user-3', 'user-20'], totalSlots: 30, status: 'Upcoming',
  },
  {
    id: 'event-9', title: 'Nexus B2B Product Showcase', date: 'Aug 20', type: 'Webinar', location: 'Virtual',
    description: 'Get a live demo of the latest features in the Nexus B2B sales platform and ask our product team your questions.',
    authorId: 'user-8', companyId: 'company-6', rsvps: ['user-2', 'user-15'], status: 'Upcoming',
  },
  {
    id: 'event-10', title: 'GreenShift Open House', date: 'Aug 25', type: 'Walk-in Interview', location: 'Remote',
    description: 'We\'re hiring! GreenShift is looking for passionate people to join our mission. We have roles open in engineering, product, and sales.',
    authorId: 'user-4', companyId: 'company-4', rsvps: ['user-9'], interestedAttendees: [],
    jobSlots: [
        { title: 'Full-Stack Engineer', description: 'Build new features across our entire stack, from our React frontend to our Python backend.', skills: ['React', 'Python', 'Node.js', 'PostgreSQL'] },
        { title: 'Sales Development Representative', description: 'Help us find and qualify new leads for our sustainability platform.', skills: ['Sales', 'Communication'] },
    ],
    status: 'Upcoming', coverImageUrl: 'https://picsum.photos/seed/event10/800/400',
  },
  {
    id: 'event-11',
    title: 'AI Ethics & Open Source: A Virtual Roundtable',
    date: 'Sep 5',
    time: '4:00 PM PST',
    type: 'Webinar',
    location: 'Virtual',
    description: 'A personal, community-driven discussion on the ethical responsibilities of building open-source AI. This is not a company event, but a gathering for passionate developers and thinkers. We will discuss model transparency, data privacy, and the future of responsible AI development.',
    authorId: 'user-1',
    rsvps: ['user-7', 'user-13', 'user-16', 'user-19'],
    status: 'Upcoming',
  },
];

// --- VENTURES ---
export const MOCK_VENTURES: Venture[] = [
    {
        id: 'venture-1', ownerId: 'user-4', name: 'TerraNova', logoUrl: 'https://picsum.photos/seed/venture1/200',
        tagline: 'Marketplace for certified carbon offsets.',
        vision: 'To create a transparent and accessible market for carbon removal, empowering businesses and individuals to have a tangible impact on climate change.',
        problem: "It's difficult for businesses to find and verify high-quality carbon offset projects. The current market is fragmented and lacks transparency.",
        solution: "A centralized platform that vets and lists carbon offset projects, providing clear data and impact reports. We use blockchain for verification.",
        market: ['Climate Tech', 'SaaS', 'Marketplace'], stage: 'Idea',
        seeking: ['Frontend Engineer', 'Solidity Developer', 'UI/UX Designer'],
        interestedUsers: ['user-1', 'user-3', 'user-19'], expressedInterest: ['user-3', 'user-19'],
        firstBelievers: ['user-1', 'user-2', 'user-5'], acknowledgedBelievers: ['user-1', 'user-5'],
        signalIds: ['signal-1', 'signal-2', 'signal-3'],
        preferences: { skills: ['React', 'TypeScript', 'Solidity'], location: 'Remote' }
    },
    {
        id: 'venture-2', ownerId: 'user-8', name: 'CodeCollab', logoUrl: 'https://picsum.photos/seed/venture2/200',
        tagline: 'AI-powered pair programming in the cloud.',
        vision: 'To make software development more collaborative, efficient, and accessible for teams of all sizes.',
        problem: 'Remote pair programming tools are often clunky, slow, and lack intelligent features to assist developers.',
        solution: 'A web-based IDE with real-time collaboration, integrated AI code completion, and automated refactoring suggestions.',
        market: ['DevTools', 'AI', 'SaaS'], stage: 'Prototype',
        seeking: ['AI/ML Engineer', 'Growth Marketer', 'DevOps Engineer'],
        interestedUsers: ['user-16', 'user-2'], expressedInterest: [],
        firstBelievers: ['user-1', 'user-6', 'user-10'], acknowledgedBelievers: ['user-1'],
        signalIds: ['signal-4'],
    }
];

// --- SIGNALS ---
export const MOCK_SIGNALS: Signal[] = [
    {
        id: 'signal-1', ventureId: 'venture-1', authorId: 'user-4', type: 'update',
        content: "Exciting news! We've just finished the first draft of our whitepaper. It details the tokenomics and verification process for TerraNova. Huge step forward!",
        timestamp: '1d ago', isExclusive: true, likes: ['user-1', 'user-2', 'user-5'],
        comments: [ { id: 'c-s1-1', authorId: 'user-1', text: 'This is awesome! Can\'t wait to read it.', timestamp: '1d ago' } ],
    },
    {
        id: 'signal-2', ventureId: 'venture-1', authorId: 'user-4', type: 'poll',
        content: "What's more important for our initial launch?", timestamp: '3d ago',
        pollOptions: [ { text: 'More project variety', votes: ['user-2'] }, { text: 'Deeper project data', votes: ['user-1', 'user-3', 'user-5'] } ],
        likes: ['user-1'], comments: [],
    },
    {
        id: 'signal-3', ventureId: 'venture-1', authorId: 'user-4', type: 'question',
        content: "For developers out there: what's the biggest challenge when integrating a new API for financial transactions? We're designing our payment gateway and want to make it as seamless as possible.",
        timestamp: '5d ago', likes: ['user-1', 'user-19'], comments: [],
        feedback: [ { id: 'fb-1', authorId: 'user-1', pros: "Great question, focusing on dev experience early is smart.", cons: "The question is a bit broad. 'Financial transactions' could mean a lot of things.", suggestion: "Maybe narrow it down to crypto vs. fiat, or B2B vs. B2C transactions for more specific feedback.", timestamp: '4d ago' } ]
    },
    {
        id: 'signal-4', ventureId: 'venture-2', authorId: 'user-8', type: 'update',
        content: "Just deployed our prototype to a staging environment! The real-time text editing is feeling snappy. AI code completion is next on the list. If you want early access, sign up to be a First Believer!",
        timestamp: '2h ago', likes: ['user-1', 'user-6', 'user-10', 'user-16'], comments: [],
    }
];

// --- NOTIFICATIONS ---
export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', type: 'APPLICATION', actorId: 'user-3', timestamp: '2h ago', isRead: false, targetId: 'job-1', targetType: 'job' },
    { id: 'notif-2', type: 'COMMENT', actorId: 'user-5', timestamp: '3d ago', isRead: false, targetId: 'story-1', targetType: 'story', message: 'Inspirational stuff, Alex!' },
    { id: 'notif-3', type: 'MATCH', actorId: 'user-19', timestamp: '5d ago', isRead: true, targetId: 'venture-1', targetType: 'venture' },
    { id: 'notif-4', type: 'INTEREST', actorId: 'user-16', timestamp: '1d ago', isRead: false, targetId: 'venture-2', targetType: 'venture' },
    { id: 'notif-5', type: 'RSVP', actorId: 'user-8', timestamp: '6h ago', isRead: false, targetId: 'event-1', targetType: 'event' },
];

// --- TEMPLATES ---
export const MESSAGE_TEMPLATES: Record<string, MessageTemplate> = {
    'Shortlisted': {
        subject: 'Update on your application for {jobTitle} at {companyName}',
        body: (applicantName, jobTitle, companyName) => `Hi ${applicantName},\n\nGreat news! The team at ${companyName} was impressed with your profile and would like to move forward with your application for the ${jobTitle} role.\n\nWe'll be in touch shortly with the next steps.\n\nBest,\n{recruiterName}`
    },
    'Technical Interview': {
        subject: 'Next Steps: Technical Interview for {jobTitle}',
        body: (applicantName, jobTitle, companyName) => `Hi ${applicantName},\n\nWe'd like to invite you to a technical interview for the ${jobTitle} position at ${companyName}. This will be an opportunity for us to learn more about your skills and for you to learn more about our team.\n\nPlease let me know what times work best for you over the next few days.\n\nBest,\n{recruiterName}`
    },
    'Founder Chat': {
        subject: 'Final Steps: Founder Chat for {jobTitle}',
        body: (applicantName, jobTitle, companyName) => `Hi ${applicantName},\n\nAs a final step in our process, we'd like to invite you for a chat with our founder to discuss your vision and how you see yourself contributing to ${companyName}.\n\nAre you available sometime this week?\n\nBest,\n{recruiterName}`
    }
};

export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        name: "First Touch (Shortlisted)",
        subject: "Update on your {jobTitle} application at {companyName}",
        body: "Hi {applicantName},\n\nHope you're having a great week.\n\nThe team and I were really impressed with your profile and would love to chat further about the {jobTitle} role. Are you available for a brief 20-minute introductory call sometime next week?\n\nLooking forward to it!\n\nBest,\n{recruiterName}"
    },
    {
        name: "Interview Follow-up",
        subject: "Following up on your interview for {jobTitle}",
        body: "Hi {applicantName},\n\nIt was great speaking with you about the {jobTitle} position. The team enjoyed learning more about your experience.\n\nWe are continuing with the interview process and will have an update for you by the end of the week. Please feel free to reach out if you have any questions in the meantime.\n\nBest,\n{recruiterName}"
    }
];

export const MOCK_SHARED_DASHBOARDS: SharedDashboard[] = [
    {
        id: 'dash-12345',
        jobId: 'job-1',
        applicantUserIds: ['user-3', 'user-9', 'user-16'],
        createdAt: '2024-07-20T10:00:00Z',
    },
];