import { pool } from './src/config/db.js';

async function seedNewCourses() {
  try {
    const newCourses = [
      // ─────────────────────────────────────────────────────────────────────
      // 6. React.js Complete Guide
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'React.js Complete Guide',
        slug: 'reactjs-complete-guide',
        description: 'Master React from zero to hero. Covers hooks, context, Redux, React Router, performance optimization, and real-world projects.',
        is_published,
        sections
          {
            title: 'React Fundamentals',
            videos
              { title: 'React JS Crash Course', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
              { title: 'React Components & JSX', url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
              { title: 'Props and State in React', url: 'https://www.youtube.com/watch?v=IYvD9oBCuJI' },
              { title: 'React Event Handling', url: 'https://www.youtube.com/watch?v=0XSDAup85SA' },
            ]
          },
          {
            title: 'React Hooks',
            videos
              { title: 'useState Hook Tutorial', url: 'https://www.youtube.com/watch?v=O6P86uwfdR0' },
              { title: 'useEffect Hook Tutorial', url: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U' },
              { title: 'useCallback and useMemo', url: 'https://www.youtube.com/watch?v=ilmV9ePJFFQ' },
              { title: 'useRef Hook Tutorial', url: 'https://www.youtube.com/watch?v=t2ypzz6gzvg' },
              { title: 'Custom Hooks in React', url: 'https://www.youtube.com/watch?v=6ThXsUwLWvc' },
            ]
          },
          {
            title: 'State Management',
            videos
              { title: 'React Context API Tutorial', url: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc' },
              { title: 'useReducer Hook Tutorial', url: 'https://www.youtube.com/watch?v=kK_Wqx3RnHk' },
              { title: 'Redux Toolkit Crash Course', url: 'https://www.youtube.com/watch?v=bbkBuqC1rU4' },
              { title: 'Zustand State Management', url: 'https://www.youtube.com/watch?v=_ngCLZ5Iz-0' },
            ]
          },
          {
            title: 'React Router & Navigation',
            videos
              { title: 'React Router v6 Tutorial', url: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU' },
              { title: 'Protected Routes in React', url: 'https://www.youtube.com/watch?v=X8eAbu1RWZ4' },
              { title: 'Dynamic Routes and Params', url: 'https://www.youtube.com/watch?v=OMQ2QARHBo4' },
            ]
          },
          {
            title: 'Performance & Advanced Patterns',
            videos
              { title: 'React Performance Optimization', url: 'https://www.youtube.com/watch?v=O-JzNzLGBKU' },
              { title: 'React.memo and Optimization', url: 'https://www.youtube.com/watch?v=1WHb_VoKyTE' },
              { title: 'Lazy Loading with React Suspense', url: 'https://www.youtube.com/watch?v=MJn4W7pR6RU' },
              { title: 'React Testing Library Tutorial', url: 'https://www.youtube.com/watch?v=7dTTFW269jM' },
              { title: 'Full Stack React Project', url: 'https://www.youtube.com/watch?v=4pUBO31nkpk' },
            ]
          },
        ]
      },

      // ─────────────────────────────────────────────────────────────────────
      // 7. Python for Data Science & Analytics
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'Python for Data Science',
        slug: 'python-data-science',
        description: 'Complete Python data science course covering NumPy, Pandas, Matplotlib, and real data analysis projects.',
        is_published,
        sections
          {
            title: 'Python Fundamentals Review',
            videos
              { title: 'Python for Beginners - Full Course', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
              { title: 'Python Data Types & Variables', url: 'https://www.youtube.com/watch?v=khKv-8q7YmY' },
              { title: 'Python Functions & Modules', url: 'https://www.youtube.com/watch?v=9Os0o3wzS_I' },
              { title: 'Python List Comprehensions', url: 'https://www.youtube.com/watch?v=3dt4OGnU5sM' },
            ]
          },
          {
            title: 'NumPy for Numerical Computing',
            videos
              { title: 'NumPy Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI' },
              { title: 'NumPy Arrays, Indexing & Slicing', url: 'https://www.youtube.com/watch?v=8Mpc9ukltVA' },
              { title: 'NumPy Mathematical Operations', url: 'https://www.youtube.com/watch?v=lKcwuPnSHIQ' },
              { title: 'NumPy Broadcasting Explained', url: 'https://www.youtube.com/watch?v=oG1t3qlzq14' },
            ]
          },
          {
            title: 'Pandas for Data Analysis',
            videos
              { title: 'Pandas Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
              { title: 'Pandas DataFrames & Series', url: 'https://www.youtube.com/watch?v=dcqPhpY7tWk' },
              { title: 'Data Cleaning with Pandas', url: 'https://www.youtube.com/watch?v=bDhvCp3_lYw' },
              { title: 'Pandas GroupBy and Aggregation', url: 'https://www.youtube.com/watch?v=Qa0-jYtcqyc' },
              { title: 'Merging, Joining, and Concatenating', url: 'https://www.youtube.com/watch?v=h4hOPGo4UVU' },
            ]
          },
          {
            title: 'Data Visualization',
            videos
              { title: 'Matplotlib Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=3Xc3CA655Y4' },
              { title: 'Seaborn Data Visualization Tutorial', url: 'https://www.youtube.com/watch?v=6GUZXDef2U0' },
              { title: 'Plotly Interactive Charts', url: 'https://www.youtube.com/watch?v=GGL6U0k8WYA' },
            ]
          },
          {
            title: 'Real-World Data Projects',
            videos
              { title: 'Exploratory Data Analysis (EDA) Project', url: 'https://www.youtube.com/watch?v=xi0vhXFPegw' },
              { title: 'Data Analysis with Pandas - COVID Dataset', url: 'https://www.youtube.com/watch?v=ZyhVh-qRZPA' },
              { title: 'Python Web Scraping with BeautifulSoup', url: 'https://www.youtube.com/watch?v=XVv6mJpFOb0' },
              { title: 'Time Series Analysis with Python', url: 'https://www.youtube.com/watch?v=e8Yw4alG16Q' },
            ]
          },
        ]
      },

      // ─────────────────────────────────────────────────────────────────────
      // 8. SQL & Database Design
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'SQL & Database Design',
        slug: 'sql-database-design',
        description: 'Master SQL from basics to advanced. Covers relational databases, joins, indexes, query optimization, and database design principles.',
        is_published,
        sections
          {
            title: 'SQL Basics',
            videos
              { title: 'SQL Tutorial for Beginners - Full Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
              { title: 'SELECT, WHERE, and ORDER BY', url: 'https://www.youtube.com/watch?v=27axs9dO7AE' },
              { title: 'INSERT, UPDATE, DELETE Statements', url: 'https://www.youtube.com/watch?v=2X0oL6Cqf7Y' },
              { title: 'SQL Data Types Explained', url: 'https://www.youtube.com/watch?v=G4qo2CaWHhM' },
            ]
          },
          {
            title: 'Filtering & Aggregation',
            videos
              { title: 'SQL WHERE Clause & Operators', url: 'https://www.youtube.com/watch?v=QXGiT2hDFpk' },
              { title: 'SQL GROUP BY and HAVING', url: 'https://www.youtube.com/watch?v=TzB7Ur0_FGQ' },
              { title: 'SQL Aggregate Functions (COUNT, SUM, AVG)', url: 'https://www.youtube.com/watch?v=nNrgRCIBYC0' },
              { title: 'SQL CASE Expressions', url: 'https://www.youtube.com/watch?v=y1F6tXKTCio' },
            ]
          },
          {
            title: 'Joins & Relationships',
            videos
              { title: 'SQL Joins Explained (INNER, LEFT, RIGHT, FULL)', url: 'https://www.youtube.com/watch?v=9yeOJ0ZMUYw' },
              { title: 'SQL Self Joins', url: 'https://www.youtube.com/watch?v=pbXJa5aFBsI' },
              { title: 'SQL Subqueries Tutorial', url: 'https://www.youtube.com/watch?v=nJIEIzF7tDw' },
              { title: 'SQL CTEs (Common Table Expressions)', url: 'https://www.youtube.com/watch?v=K74_FNs6jy0' },
            ]
          },
          {
            title: 'Database Design',
            videos
              { title: 'Database Design Course – Learn with 3 Case Studies', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
              { title: 'ER Diagrams Tutorial', url: 'https://www.youtube.com/watch?v=-fQ-bRllhXc' },
              { title: 'Database Normalization (1NF, 2NF, 3NF)', url: 'https://www.youtube.com/watch?v=GFQaEYEc8_8' },
              { title: 'SQL Primary Keys and Foreign Keys', url: 'https://www.youtube.com/watch?v=B5r8CcTUs5Y' },
            ]
          },
          {
            title: 'Advanced SQL',
            videos
              { title: 'SQL Window Functions Tutorial', url: 'https://www.youtube.com/watch?v=H6OTMoXjNEc' },
              { title: 'SQL Stored Procedures', url: 'https://www.youtube.com/watch?v=cV-mBRQ8enQ' },
              { title: 'SQL Indexes – How to Speed Up Queries', url: 'https://www.youtube.com/watch?v=_4jj3rwrSQI' },
              { title: 'SQL Query Optimization', url: 'https://www.youtube.com/watch?v=BHwzDmr6d7s' },
            ]
          },
        ]
      },

      // ─────────────────────────────────────────────────────────────────────
      // 9. DevOps with Docker & Kubernetes
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'DevOps with Docker & Kubernetes',
        slug: 'devops-docker-kubernetes',
        description: 'Learn modern DevOps practices including containerization with Docker, orchestration with Kubernetes, and CI/CD pipelines.',
        is_published,
        sections
          {
            title: 'Linux & Command Line Basics',
            videos
              { title: 'Linux Command Line Full Course', url: 'https://www.youtube.com/watch?v=wBp0Rb-ZJak' },
              { title: 'Shell Scripting Crash Course', url: 'https://www.youtube.com/watch?v=v-F3YLd6oMw' },
              { title: 'Linux File Permissions Explained', url: 'https://www.youtube.com/watch?v=D-VqgvBMV7g' },
              { title: 'SSH and Remote Servers', url: 'https://www.youtube.com/watch?v=hQWRp-FdTpc' },
            ]
          },
          {
            title: 'Docker Fundamentals',
            videos
              { title: 'Docker Tutorial for Beginners – Full Course', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo' },
              { title: 'Docker Images & Containers', url: 'https://www.youtube.com/watch?v=gAkwW2tuIqE' },
              { title: 'Dockerfile – Build Your Own Images', url: 'https://www.youtube.com/watch?v=LQjaJINkQXY' },
              { title: 'Docker Volumes and Networking', url: 'https://www.youtube.com/watch?v=OU6xOM0SE4o' },
              { title: 'Docker Compose Tutorial', url: 'https://www.youtube.com/watch?v=DM65_JyGxCo' },
            ]
          },
          {
            title: 'Kubernetes (K8s)',
            videos
              { title: 'Kubernetes Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=X48VuDVv0do' },
              { title: 'Kubernetes Pods, Nodes, and Clusters', url: 'https://www.youtube.com/watch?v=QJ4fODH6DXI' },
              { title: 'Kubernetes Deployments & Services', url: 'https://www.youtube.com/watch?v=KVBON1lA9N8' },
              { title: 'Kubernetes Ingress Explained', url: 'https://www.youtube.com/watch?v=80Ew_fsV4rM' },
            ]
          },
          {
            title: 'CI/CD Pipelines',
            videos
              { title: 'GitHub Actions CI/CD Tutorial', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI' },
              { title: 'CI/CD Pipeline with Docker and GitHub Actions', url: 'https://www.youtube.com/watch?v=R5ppadIsGbA' },
              { title: 'Deploy to AWS with GitHub Actions', url: 'https://www.youtube.com/watch?v=Kl8LFKukHAg' },
            ]
          },
          {
            title: 'Cloud & Infrastructure',
            videos
              { title: 'AWS Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=k1RI5locZE4' },
              { title: 'Infrastructure with Terraform', url: 'https://www.youtube.com/watch?v=l5k1ai_GBDE' },
              { title: 'Nginx Crash Course', url: 'https://www.youtube.com/watch?v=7VAI73roXaY' },
              { title: 'Deploy Node.js App to AWS EC2', url: 'https://www.youtube.com/watch?v=T-Pum2TraX4' },
            ]
          },
        ]
      },

      // ─────────────────────────────────────────────────────────────────────
      // 10. TypeScript Masterclass
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'TypeScript Masterclass',
        slug: 'typescript-masterclass',
        description: 'Complete TypeScript course from basics to advanced. Covers types, interfaces, generics, decorators, and TypeScript with React and Node.js.',
        is_published,
        sections
          {
            title: 'TypeScript Basics',
            videos
              { title: 'TypeScript Course for Beginners', url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs' },
              { title: 'TypeScript Types – string, number, boolean', url: 'https://www.youtube.com/watch?v=ydkQlJhodio' },
              { title: 'TypeScript Arrays and Tuples', url: 'https://www.youtube.com/watch?v=WlsTVBOt2OY' },
              { title: 'TypeScript Enums Explained', url: 'https://www.youtube.com/watch?v=nViEqpgwxHE' },
            ]
          },
          {
            title: 'Functions & Objects',
            videos
              { title: 'TypeScript Functions & Overloading', url: 'https://www.youtube.com/watch?v=Anu8vHXsavo' },
              { title: 'TypeScript Interfaces', url: 'https://www.youtube.com/watch?v=Kl8LFKukHAg' },
              { title: 'TypeScript Type Aliases vs Interfaces', url: 'https://www.youtube.com/watch?v=crjIMmz7gRY' },
              { title: 'Optional and Default Parameters', url: 'https://www.youtube.com/watch?v=xPEMup3SBOQ' },
            ]
          },
          {
            title: 'Classes & OOP',
            videos
              { title: 'TypeScript Classes Tutorial', url: 'https://www.youtube.com/watch?v=OsFwOQ_RNNE' },
              { title: 'TypeScript Access Modifiers', url: 'https://www.youtube.com/watch?v=vPWe3QcKKJo' },
              { title: 'TypeScript Abstract Classes', url: 'https://www.youtube.com/watch?v=Pj6COiFlaYM' },
              { title: 'TypeScript Inheritance', url: 'https://www.youtube.com/watch?v=-dHFOFx6_bw' },
            ]
          },
          {
            title: 'Generics & Advanced Types',
            videos
              { title: 'TypeScript Generics Tutorial', url: 'https://www.youtube.com/watch?v=nViEqpgwxHE' },
              { title: 'TypeScript Generic Constraints', url: 'https://www.youtube.com/watch?v=IOzkOXSz9gE' },
              { title: 'TypeScript Utility Types (Partial, Pick, Omit)', url: 'https://www.youtube.com/watch?v=ydkQlJhodio' },
              { title: 'TypeScript Union & Intersection Types', url: 'https://www.youtube.com/watch?v=o_wI-1seZ9M' },
              { title: 'TypeScript Type Guards', url: 'https://www.youtube.com/watch?v=yhUGgAAwJug' },
            ]
          },
          {
            title: 'TypeScript with React & Node',
            videos
              { title: 'TypeScript with React – Complete Guide', url: 'https://www.youtube.com/watch?v=jrKcJxF0lAU' },
              { title: 'TypeScript React Props & Events', url: 'https://www.youtube.com/watch?v=Z5iWr6Srsj8' },
              { title: 'TypeScript with Node.js and Express', url: 'https://www.youtube.com/watch?v=qy8PxD3alWw' },
              { title: 'TypeScript with Prisma ORM', url: 'https://www.youtube.com/watch?v=RebA5J-rlwg' },
            ]
          },
        ]
      },
    ];

    console.log('Inserting 5 new courses...');
    for (const course of newCourses) {
      const [subResult]: any = await pool.query(
        'INSERT INTO subjects (title, slug, description, is_published) VALUES (?, ?, ?, ?)',
        [course.title, course.slug, course.description, course.is_published]
      );
      const subjectId = subResult.insertId;
      console.log(`✔ Subject: ${course.title}`);

      let sectionOrder = 1;
      for (const section of course.sections) {
        const [secResult]: any = await pool.query(
          'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)',
          [subjectId, section.title, sectionOrder++]
        );
        const sectionId = secResult.insertId;

        let videoOrder = 1;
        for (const video of section.videos) {
          await pool.query(
            'INSERT INTO videos (section_id, title, youtube_url, duration_seconds, order_index) VALUES (?, ?, ?, ?, ?)',
            [sectionId, video.title, video.url, 1200, videoOrder++]
          );
        }
      }
    }

    console.log('✅ 5 new courses added successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err);
    process.exit(1);
  }
}

seedNewCourses();
