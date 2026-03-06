import { pool } from './src/config/db';

async function seed() {
  try {
    console.log('Clearing old data...');
    await pool.query('DELETE FROM subjects');

    const courses = [
      // ─────────────────────────────────────────────────────────────────────
      // 1. CS50: Introduction to Computer Science
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'CS50: Introduction to Computer Science',
        slug: 'cs50-intro-to-cs',
        description: 'The gold standard for introductory CS. Covers C, Python, SQL, JavaScript, and more.',
        is_published: 1,
        sections: [
          {
            title: 'Week 0 – Scratch & Computational Thinking',
            videos: [
              { title: 'Lecture 0: Computational Thinking & Scratch', url: 'https://www.youtube.com/watch?v=8mAITcNt710' },
              { title: 'Short: Computational Thinking', url: 'https://www.youtube.com/watch?v=q7tlgZg4Q1Q' },
              { title: 'Short: Scratch Intro', url: 'https://www.youtube.com/watch?v=g3D7VE9YbYY' },
            ]
          },
          {
            title: 'Week 1 – C Programming',
            videos: [
              { title: 'Lecture 1: C Programming Basics', url: 'https://www.youtube.com/watch?v=e9Eds2Rc_x8' },
              { title: 'Short: Functions', url: 'https://www.youtube.com/watch?v=n1glFqt3g38' },
              { title: 'Short: Command Line Arguments', url: 'https://www.youtube.com/watch?v=AI6Ccfno6Pk' },
              { title: 'Short: Variables & Scope', url: 'https://www.youtube.com/watch?v=GiFbdVGjF9I' },
            ]
          },
          {
            title: 'Week 2 – Arrays',
            videos: [
              { title: 'Lecture 2: Arrays & Memory', url: 'https://www.youtube.com/watch?v=4vU4aEFmTSo' },
              { title: 'Short: Arrays', url: 'https://www.youtube.com/watch?v=YdSycMcxvY0' },
              { title: 'Short: String Manipulation', url: 'https://www.youtube.com/watch?v=JnCX5RM7rZA' },
            ]
          },
          {
            title: 'Week 3 – Algorithms',
            videos: [
              { title: 'Lecture 3: Algorithms (Searching & Sorting)', url: 'https://www.youtube.com/watch?v=jZzyERW7h1A' },
              { title: 'Short: Binary Search', url: 'https://www.youtube.com/watch?v=T98PIp4omUA' },
              { title: 'Short: Bubble Sort', url: 'https://www.youtube.com/watch?v=RT-hUXUWQ2I' },
              { title: 'Short: Merge Sort', url: 'https://www.youtube.com/watch?v=Ns7tGNbtvV4' },
            ]
          },
          {
            title: 'Week 4 – Memory & Pointers',
            videos: [
              { title: 'Lecture 4: Memory Allocation', url: 'https://www.youtube.com/watch?v=F9-yqoS7b8w' },
              { title: 'Short: Pointers', url: 'https://www.youtube.com/watch?v=XISnO2YhnsY' },
              { title: 'Short: Dynamic Memory Allocation', url: 'https://www.youtube.com/watch?v=xa4ugmMDhiE' },
            ]
          },
          {
            title: 'Week 5 – Data Structures',
            videos: [
              { title: 'Lecture 5: Linked Lists, Trees, Hash Tables', url: 'https://www.youtube.com/watch?v=0euvEdPwQnQ' },
              { title: 'Short: Hash Tables', url: 'https://www.youtube.com/watch?v=nvzVHwrrub0' },
              { title: 'Short: Tries', url: 'https://www.youtube.com/watch?v=MC-iQHFdEDI' },
            ]
          },
          {
            title: 'Week 6 – Python',
            videos: [
              { title: 'Lecture 6: Python Basics', url: 'https://www.youtube.com/watch?v=hnDU1G9FkvI' },
              { title: 'Short: Python Syntax Tour', url: 'https://www.youtube.com/watch?v=mgBpcQRDtl0' },
            ]
          },
        ]
      },

      // ─────────────────────────────────────────────────────────────────────
      // 2. MIT 6.0001 – Introduction to CS in Python
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'Introduction to Computer Science in Python',
        slug: 'mit-60001-intro-to-cs-python',
        description: 'MIT 6.0001 – Use computation to solve real-world problems with Python.',
        is_published: 1,
        sections: [
          {
            title: 'Getting Started with Python',
            videos: [
              { title: 'Lecture 1: What is Computation?', url: 'https://www.youtube.com/watch?v=nykOeWgQcHM' },
              { title: 'Lecture 2: Branching and Iteration', url: 'https://www.youtube.com/watch?v=C0DPdy98e4c' },
              { title: 'Lecture 3: String Manipulation, Guess and Check', url: 'https://www.youtube.com/watch?v=SE4P7IVCunE' },
            ]
          },
          {
            title: 'Functions and Abstraction',
            videos: [
              { title: 'Lecture 4: Decomposition, Abstraction, and Functions', url: 'https://www.youtube.com/watch?v=MjbuarJ7SE0' },
              { title: 'Lecture 5: Tuples, Lists, Aliasing, Cloning', url: 'https://www.youtube.com/watch?v=RvRKT-jXvko' },
              { title: 'Lecture 6: Recursion, Dictionaries', url: 'https://www.youtube.com/watch?v=WPSeyjX1-4s' },
            ]
          },
          {
            title: 'Testing, Debugging, and OOP',
            videos: [
              { title: 'Lecture 7: Testing, Debugging, Exceptions', url: 'https://www.youtube.com/watch?v=9H6mioroza0' },
              { title: 'Lecture 8: Object-Oriented Programming', url: 'https://www.youtube.com/watch?v=-DP1i2ZU9gk' },
              { title: 'Lecture 9: Python Classes and Inheritance', url: 'https://www.youtube.com/watch?v=FlGjISF3l78' },
              { title: 'Lecture 10: Understanding Program Efficiency', url: 'https://www.youtube.com/watch?v=o9nW0uBqvEo' },
            ]
          },
          {
            title: 'Sorting, Complexity & Searching',
            videos: [
              { title: 'Lecture 11: Understanding Program Efficiency, Part 2', url: 'https://www.youtube.com/watch?v=7lQXYl_L28w' },
              { title: 'Lecture 12: Searching and Sorting', url: 'https://www.youtube.com/watch?v=6LOwPhPDwVc' },
            ]
          },
          {
            title: 'Plotting and Data',
            videos: [
              { title: 'Lecture 13: Visualization of Data', url: 'https://www.youtube.com/watch?v=V5JPPwOjjok' },
              { title: 'Lecture 14: Stochastic Thinking', url: 'https://www.youtube.com/watch?v=_M4_Vc_9JWk' },
              { title: 'Lecture 15: Random Walks', url: 'https://www.youtube.com/watch?v=6F9ubFsNORs' },
              { title: 'Lecture 16: Monte Carlo Simulations', url: 'https://www.youtube.com/watch?v=GxCXiSkm6no' },
            ]
          },
        ]
      },

      // ─────────────────────────────────────────────────────────────────────
      // 3. Web Development (Net Ninja Complete Stack)
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'Web Development for Beginners',
        slug: 'web-dev-beginners-net-ninja',
        description: 'Full-stack web development from HTML/CSS basics to React, Node.js, and REST APIs.',
        is_published: 1,
        sections: [
          {
            title: 'HTML Fundamentals',
            videos: [
              { title: 'HTML Crash Course For Absolute Beginners', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE' },
              { title: 'HTML Forms Tutorial', url: 'https://www.youtube.com/watch?v=YwbIeMlxZAU' },
              { title: 'HTML Tables Tutorial', url: 'https://www.youtube.com/watch?v=dK0lJ3BFGBM' },
            ]
          },
          {
            title: 'CSS Styling',
            videos: [
              { title: 'CSS Crash Course For Absolute Beginners', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI' },
              { title: 'CSS Flexbox Tutorial', url: 'https://www.youtube.com/watch?v=Y8zMYaD1bz0' },
              { title: 'CSS Grid Tutorial', url: 'https://www.youtube.com/watch?v=EFafSYg-PkI' },
              { title: 'CSS Animations Tutorial', url: 'https://www.youtube.com/watch?v=jgw82b5Y2MU' },
            ]
          },
          {
            title: 'JavaScript Fundamentals',
            videos: [
              { title: 'JavaScript Crash Course For Beginners', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c' },
              { title: 'JavaScript DOM Manipulation Tutorial', url: 'https://www.youtube.com/watch?v=5fb2aPlgoys' },
              { title: 'JavaScript Events Tutorial', url: 'https://www.youtube.com/watch?v=XF1_MlZ5l6M' },
            ]
          },
          {
            title: 'Modern JavaScript (ES6+)',
            videos: [
              { title: 'Async JavaScript - Callbacks, Promises, Async/Await', url: 'https://www.youtube.com/watch?v=PoRJizFvM7s' },
              { title: 'Fetch API & Promises', url: 'https://www.youtube.com/watch?v=Oive66jrwBs' },
              { title: 'Arrow Functions, Destructuring & Spread', url: 'https://www.youtube.com/watch?v=ncpTxqK35PI' },
            ]
          },
          {
            title: 'React.js Essentials',
            videos: [
              { title: 'React JS Crash Course 2021', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
              { title: 'React Hooks Tutorial - useState & useEffect', url: 'https://www.youtube.com/watch?v=cF2lQ_gZeA8' },
              { title: 'React Context API & Reducer', url: 'https://www.youtube.com/watch?v=35lXWvCuM8o' },
            ]
          },
          {
            title: 'Node.js and APIs',
            videos: [
              { title: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4' },
              { title: 'Express JS Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE' },
            ]
          },
        ]
      },

      // ─────────────────────────────────────────────────────────────────────
      // 4. Data Structures and Algorithms (Abdul Bari)
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'Data Structures and Algorithms',
        slug: 'dsa-abdul-bari',
        description: 'From Big-O to Graphs – the most complete DSA course for interview prep.',
        is_published: 1,
        sections: [
          {
            title: 'Introduction & Complexity Analysis',
            videos: [
              { title: 'Introduction to Algorithms', url: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
              { title: 'Time & Space Complexity - Big O Notation', url: 'https://www.youtube.com/watch?v=9TlHvipP5yA' },
              { title: 'Recursion in Data Structures', url: 'https://www.youtube.com/watch?v=Mv9NEXX1VHc' },
              { title: 'Master Theorem for Recursion', url: 'https://www.youtube.com/watch?v=OynWkEj0S-s' },
            ]
          },
          {
            title: 'Arrays, Stacks & Queues',
            videos: [
              { title: 'Arrays in Data Structures', url: 'https://www.youtube.com/watch?v=B31LgI4Y4DQ' },
              { title: 'Sparse Matrix & Polynomial', url: 'https://www.youtube.com/watch?v=F-tTb9-HOMg' },
              { title: 'Stack Data Structure', url: 'https://www.youtube.com/watch?v=okr-XE8yTO8' },
              { title: 'Queue Data Structure', url: 'https://www.youtube.com/watch?v=Q6COtJMISSE' },
              { title: 'Circular Queue', url: 'https://www.youtube.com/watch?v=dn01XST9-bI' },
            ]
          },
          {
            title: 'Linked Lists',
            videos: [
              { title: 'Linked List - All Operations', url: 'https://www.youtube.com/watch?v=Nq7ok-OyEpg' },
              { title: 'Doubly Linked List', url: 'https://www.youtube.com/watch?v=JdQeNxWCguQ' },
              { title: 'Circular Linked List', url: 'https://www.youtube.com/watch?v=GkCLPysLK4M' },
            ]
          },
          {
            title: 'Trees',
            videos: [
              { title: 'Binary Trees - Introduction', url: 'https://www.youtube.com/watch?v=qH6yxkw0u78' },
              { title: 'Binary Search Trees (BST)', url: 'https://www.youtube.com/watch?v=pYT9F8_LFTM' },
              { title: 'AVL Trees', url: 'https://www.youtube.com/watch?v=jDM6_TnYIqE' },
              { title: 'Heap & Heapify', url: 'https://www.youtube.com/watch?v=HqPJF2L5h9U' },
            ]
          },
          {
            title: 'Graphs & Sorting Algorithms',
            videos: [
              { title: 'Graph Traversals BFS & DFS', url: 'https://www.youtube.com/watch?v=pcKY4hjDrxk' },
              { title: 'Dijkstra\'s Algorithm', url: 'https://www.youtube.com/watch?v=XB4MIexjvY0' },
              { title: 'Merge Sort', url: 'https://www.youtube.com/watch?v=mB5HXBb_HY8' },
              { title: 'Quick Sort', url: 'https://www.youtube.com/watch?v=7h1s2SojIRw' },
            ]
          },
        ]
      },

      // ─────────────────────────────────────────────────────────────────────
      // 5. Machine Learning for Beginners
      // ─────────────────────────────────────────────────────────────────────
      {
        title: 'Machine Learning for Beginners',
        slug: 'ml-beginners-freecodecamp',
        description: 'Comprehensive ML course covering math, Python, TensorFlow, scikit-learn, and Neural Networks.',
        is_published: 1,
        sections: [
          {
            title: 'Introduction to Machine Learning',
            videos: [
              { title: 'Machine Learning Full Course - Learn ML in 6 Hours', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ' },
              { title: 'What is Machine Learning?', url: 'https://www.youtube.com/watch?v=HcqpanDadyQ' },
              { title: 'Python for Machine Learning - Crash Course', url: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
              { title: 'NumPy Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI' },
            ]
          },
          {
            title: 'Supervised Learning',
            videos: [
              { title: 'Linear Regression in Python', url: 'https://www.youtube.com/watch?v=hDKCxebp88A' },
              { title: 'Logistic Regression Explained', url: 'https://www.youtube.com/watch?v=yIYKR4sgzI8' },
              { title: 'Decision Trees & Random Forests', url: 'https://www.youtube.com/watch?v=RmajweUFKvM' },
              { title: 'Support Vector Machines (SVM)', url: 'https://www.youtube.com/watch?v=efR1C6CvhmE' },
              { title: 'K-Nearest Neighbors Algorithm', url: 'https://www.youtube.com/watch?v=4HKqjENq9OU' },
            ]
          },
          {
            title: 'Unsupervised Learning',
            videos: [
              { title: 'K-Means Clustering Algorithm', url: 'https://www.youtube.com/watch?v=4b5d3muPQmA' },
              { title: 'Principal Component Analysis (PCA)', url: 'https://www.youtube.com/watch?v=FgakZw6K1QQ' },
            ]
          },
          {
            title: 'Neural Networks & Deep Learning',
            videos: [
              { title: 'Neural Networks Explained - How It Works', url: 'https://www.youtube.com/watch?v=aircAruvnKk' },
              { title: 'Gradient Descent & Backpropagation', url: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U' },
              { title: 'Deep Learning with TensorFlow', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk' },
              { title: 'Convolutional Neural Networks (CNN)', url: 'https://www.youtube.com/watch?v=zfiSAzpy9NM' },
            ]
          },
          {
            title: 'Model Evaluation & Real-World Projects',
            videos: [
              { title: 'Model Evaluation: Confusion Matrix, Precision, Recall', url: 'https://www.youtube.com/watch?v=Kdsp6soqA7o' },
              { title: 'Overfitting & Regularization Explained', url: 'https://www.youtube.com/watch?v=EehRcPo1M-Q' },
              { title: 'ML Project: Predict House Prices', url: 'https://www.youtube.com/watch?v=29ZQ3TDGgRQ' },
              { title: 'Deploy ML Model with Flask', url: 'https://www.youtube.com/watch?v=UbCWoMf80PY' },
            ]
          },
        ]
      }
    ];

    console.log('Inserting courses...');
    for (const course of courses) {
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

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
