import { pool } from './src/config/db';

async function seed() {
  try {
    console.log('Clearing old data...');
    // Clear out everything so we have a clean slate matching the user request
    await pool.query('DELETE FROM subjects'); 

    const courses = [
      {
        title: "CS50: Introduction to Computer Science (Harvard)",
        slug: "cs50-intro-to-cs",
        description: "The gold standard for introductory CS. Covers C, Python, SQL, JavaScript, HTML/CSS, Data Structures, and Algorithms.",
        is_published: 1,
        sections: [
          {
            title: "Week 0: Scratch & C Fundamentals",
            videos: [
              { title: "Lecture 0: Computational Thinking & Scratch", url: "https://www.youtube.com/watch?v=8mAITcNt710" },
              { title: "Lecture 1: C Programming Basics", url: "https://www.youtube.com/watch?v=e9Eds2Rc_x8" }
            ]
          },
          {
            title: "Week 2: Arrays & Algorithms",
            videos: [
              { title: "Lecture 2: Arrays & Memory", url: "https://www.youtube.com/watch?v=4vU4aEFmTSo" },
              { title: "Lecture 3: Algorithms (Searching & Sorting)", url: "https://www.youtube.com/watch?v=jZzyERW7h1A" }
            ]
          },
          {
            title: "Week 4: Memory & Data Structures",
            videos: [
              { title: "Lecture 4: Memory Allocation", url: "https://www.youtube.com/watch?v=F9-yqoS7b8w" },
              { title: "Lecture 5: Linked Lists, Trees, Hash Tables", url: "https://www.youtube.com/watch?v=0euvEdPwQnQ" }
            ]
          }
        ]
      },
      {
        title: "Introduction to Computer Science in Python (MIT 6.0001)",
        slug: "mit-60001-intro-to-cs-python",
        description: "Focuses on using computation to solve real-world problems. Great for building a solid programming foundation using Python.",
        is_published: 1,
        sections: [
          {
            title: "Introduction and Core Python",
            videos: [
              { title: "Lecture 1: What is Computation?", url: "https://www.youtube.com/watch?v=nykOeWgQcHM" },
              { title: "Lecture 2: Branching and Iteration", url: "https://www.youtube.com/watch?v=C0DPdy98e4c" }
            ]
          },
          {
            title: "Functions, Strings, and Structure",
            videos: [
              { title: "Lecture 3: String Manipulation, Guess and Check", url: "https://www.youtube.com/watch?v=SE4P7IVCunE" },
              { title: "Lecture 4: Functions and Scope", url: "https://www.youtube.com/watch?v=MjbuarJ7SE0" }
            ]
          },
          {
            title: "Data Types and Debugging",
            videos: [
              { title: "Lecture 5: Tuples, Lists, Aliasing, Cloning", url: "https://www.youtube.com/watch?v=RvRKT-jXvko" },
              { title: "Lecture 6: Recursion and Dictionaries", url: "https://www.youtube.com/watch?v=WPSeyjX1-4s" }
            ]
          }
        ]
      },
      {
        title: "Web Development for Beginners (Net Ninja)",
        slug: "web-dev-beginners-net-ninja",
        description: "Structured Modern JavaScript and Full Stack web engineering. Covers HTML/CSS, ES6+, DOM manipulation, and Async code.",
        is_published: 1,
        sections: [
          {
            title: "HTML & CSS Crash Course",
            videos: [
              { title: "HTML Crash Course For Absolute Beginners", url: "https://www.youtube.com/watch?v=UB1O30fR-EE" },
              { title: "CSS Crash Course For Absolute Beginners", url: "https://www.youtube.com/watch?v=yfoY53QXEnI" }
            ]
          },
          {
            title: "Modern JavaScript (ES6+)",
            videos: [
              { title: "JavaScript Tutorial for Beginners #1", url: "https://www.youtube.com/watch?v=iWOYAxlnaww" },
              { title: "DOM Manipulation & Events", url: "https://www.youtube.com/watch?v=FIORjGvT0kk" }
            ]
          },
          {
            title: "Asynchronous Code",
            videos: [
              { title: "Async JavaScript Crash Course", url: "https://www.youtube.com/watch?v=PoRJizFvM7s" },
              { title: "Fetch API & Promises", url: "https://www.youtube.com/watch?v=Oive66jrwBs" }
            ]
          }
        ]
      },
      {
        title: "Data Structures and Algorithms (Abdul Bari)",
        slug: "dsa-abdul-bari",
        description: "Complex theoretical concepts made easy. Essential for intermediate learners focusing on efficiency and logic preparing for interviews.",
        is_published: 1,
        sections: [
          {
            title: "Algorithm Analysis & Recursion",
            videos: [
              { title: "Introduction to Algorithms", url: "https://www.youtube.com/watch?v=0IAPZzGSbME" },
              { title: "Time Complexity & Big O Notation", url: "https://www.youtube.com/watch?v=9TlHvipP5yA" }
            ]
          },
          {
            title: "Basic Data Structures",
            videos: [
              { title: "Arrays & Linked Lists overview", url: "https://www.youtube.com/watch?v=B31LgI4Y4DQ" },
              { title: "Stacks and Queues basics", url: "https://www.youtube.com/watch?v=okr-XE8yTO8" }
            ]
          },
          {
            title: "Advanced Trees & Graphs",
            videos: [
              { title: "Binary Search Trees (BST)", url: "https://www.youtube.com/watch?v=pYT9F8_LFTM" },
              { title: "Graph Traversals (BFS & DFS)", url: "https://www.youtube.com/watch?v=pcKY4hjDrxk" }
            ]
          }
        ]
      },
      {
        title: "Machine Learning for Beginners",
        slug: "ml-beginners-freecodecamp",
        description: "Comprehensive introduction to the math and coding behind Machine Learning using Python, TensorFlow, and Scikit-learn.",
        is_published: 1,
        sections: [
          {
            title: "Introduction & Regression",
            videos: [
              { title: "What is Machine Learning?", url: "https://www.youtube.com/watch?v=HcqpanDadyQ" },
              { title: "Linear Regression Analysis", url: "https://www.youtube.com/watch?v=hDKCxebp88A" }
            ]
          },
          {
            title: "Classification & Classification Models",
            videos: [
              { title: "K-Nearest Neighbors Algorithm", url: "https://www.youtube.com/watch?v=4HKqjENq9OU" },
              { title: "Support Vector Machines (SVM)", url: "https://www.youtube.com/watch?v=efR1C6CvhmE" }
            ]
          },
          {
            title: "Neural Networks & TensorFlow",
            videos: [
              { title: "Introduction to Neural Networks", url: "https://www.youtube.com/watch?v=tIeHLnjs5U8" },
              { title: "Building Models with TensorFlow", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk" }
            ]
          }
        ]
      }
    ];

    console.log('Inserting courses...');
    for (const course of courses) {
      // 1. Insert Subject
      const [subResult]: any = await pool.query(`
        INSERT INTO subjects (title, slug, description, is_published) 
        VALUES (?, ?, ?, ?)
      `, [course.title, course.slug, course.description, course.is_published]);
      const subjectId = subResult.insertId;
      console.log(`Inserted: ${course.title}`);

      // 2. Insert Sections & Videos
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
                [sectionId, video.title, video.url, 1200, videoOrder++] // Assuming ~20m duration default for ease
            );
        }
      }
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
