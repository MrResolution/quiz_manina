-- CREATE DATABASE TABLES

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student',
  xp INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  time_limit INT DEFAULT 30,
  passing_score INT DEFAULT 50,
  max_attempts INT DEFAULT 0,
  shuffle_questions BOOLEAN DEFAULT TRUE,
  shuffle_answers BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(50) REFERENCES users(username) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  quiz_id VARCHAR(100) REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'mcq',
  options JSONB, -- Array of string options
  answer INT, -- Index of correct option (MCQ/TF)
  correct_text TEXT, -- Text answer (Short Answer)
  explanation TEXT
);

CREATE TABLE IF NOT EXISTS attempts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
  quiz_id VARCHAR(100) REFERENCES quizzes(id) ON DELETE CASCADE,
  score INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  total_questions INT DEFAULT 0,
  accuracy_pct INT DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  max_streak INT DEFAULT 0,
  time_taken VARCHAR(20),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers_log (
  id SERIAL PRIMARY KEY,
  attempt_id INT REFERENCES attempts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  selected VARCHAR(255),
  correct VARCHAR(255),
  is_correct BOOLEAN DEFAULT FALSE,
  explanation TEXT
);

-- SEED USERS (password is 'password')
INSERT INTO users (username, password, role, xp)
VALUES 
  ('student', '$2a$10$RY3YGBvZw8tw2BYht9J.n.iKrXuV9QL7L7ckMpK6trCo8i0nUiRpC', 'student', 0),
  ('teacher', '$2a$10$RY3YGBvZw8tw2BYht9J.n.iKrXuV9QL7L7ckMpK6trCo8i0nUiRpC', 'teacher', 0)
ON CONFLICT (username) DO NOTHING;

-- SEED QUIZZES
INSERT INTO quizzes (id, title, description, category, difficulty, time_limit, passing_score, max_attempts, shuffle_questions, shuffle_answers)
VALUES
  ('quiz-web-dev', 'Web Development Core', 'Test your skills on modern JavaScript concepts, CSS layouts, and web fundamentals.', 'Tech', 'medium', 30, 50, 0, true, true),
  ('quiz-space', 'Cosmos & Space Exploration', 'Embark on a journey through the stars, planets, and historic space flight missions.', 'Science', 'hard', 25, 50, 0, true, true),
  ('quiz-geography', 'World Geography Trek', 'Explore Earth''s majestic topography, capital cities, rivers, and borders.', 'Geography', 'easy', 30, 50, 0, true, true),
  ('quiz-history', 'History Epochs & Milestones', 'Chronicle major historical events, revolutions, and world-shaping figures.', 'History', 'medium', 30, 50, 0, true, true),
  ('quiz-pop-culture', 'Pop Culture & Gaming History', 'Celebrate popular films, media franchises, and historic milestones in gaming.', 'Pop Culture', 'easy', 25, 50, 0, true, true)
ON CONFLICT (id) DO NOTHING;

-- SEED QUESTIONS FOR 'quiz-web-dev'
INSERT INTO questions (quiz_id, question, type, options, answer, explanation)
VALUES
  ('quiz-web-dev', 'What is the output of ''typeof NaN'' in JavaScript?', 'mcq', '["number", "NaN", "undefined", "object"]', 0, 'In JavaScript, ''NaN'' stands for ''Not-a-Number'', but its data type is actually a number.'),
  ('quiz-web-dev', 'Which CSS property is used to align items along the main axis in Flexbox?', 'mcq', '["align-items", "justify-content", "align-content", "grid-gap"]', 1, 'justify-content aligns items along the main axis, while align-items aligns them along the cross axis.'),
  ('quiz-web-dev', 'What does the ''defer'' attribute in a script tag do?', 'mcq', '["Executes the script synchronously.", "Downloads the script in parallel and executes it after document parsing.", "Downloads the script and executes it immediately, blocking HTML rendering.", "Prevents the script from executing at all."]', 1, 'The defer attribute tells the browser to execute script only after the HTML document has been fully parsed.'),
  ('quiz-web-dev', 'Which HTTP status code represents a successful resource creation?', 'mcq', '["200 OK", "201 Created", "204 No Content", "302 Found"]', 1, 'HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource.'),
  ('quiz-web-dev', 'What is a closure in JavaScript?', 'mcq', '["A method to close browser tabs.", "The combination of a function bundled together with references to its surrounding state.", "A way to safely encrypt API keys.", "A loop structure that terminates early."]', 1, 'A closure gives you access to an outer function''s scope from an inner function.'),
  ('quiz-web-dev', 'Which of the following is NOT a semantic HTML element?', 'mcq', '["<article>", "<section>", "<div>", "<aside>"]', 2, '<div> is a generic container and has no semantic meaning. <article>, <section>, and <aside> describe their content.'),
  ('quiz-web-dev', 'What is the purpose of the ''key'' prop in React lists?', 'mcq', '["To uniquely identify elements and help React identify which items changed, are added, or removed.", "To style list items individually.", "To encrypt list item content.", "To bind click event handlers automatically."]', 0, 'Keys help React identify which items have changed, been added, or been removed, optimizing rendering performance.'),
  ('quiz-web-dev', 'Which protocol is used to fetch web resources securely?', 'mcq', '["FTP", "HTTP", "HTTPS", "SSH"]', 2, 'HTTPS (Hypertext Transfer Protocol Secure) encrypts communication using TLS/SSL.'),
  ('quiz-web-dev', 'What does ''Event Bubbling'' refer to in JS DOM events?', 'mcq', '["Events propagating from the target element upwards through its ancestors in the DOM tree.", "Events triggering recursively inside a loop.", "The visual animation of buttons popping.", "Events descending from the document node down to the target element."]', 0, 'Event bubbling starts from the deepest target element and bubbles up through parent elements.'),
  ('quiz-web-dev', 'What is the main advantage of HTTP/2 over HTTP/1.1?', 'mcq', '["It uses plain text for headers.", "Multiplexing, which allows multiple requests and responses over a single TCP connection.", "It removes the need for IP addresses.", "It only works on wireless connections."]', 1, 'HTTP/2 multiplexing reduces latency by allowing concurrent requests/responses over a single connection.')
ON CONFLICT (id) DO NOTHING;

-- SEED QUESTIONS FOR 'quiz-space'
INSERT INTO questions (quiz_id, question, type, options, answer, explanation)
VALUES
  ('quiz-space', 'Which planet is the hottest in our solar system?', 'mcq', '["Mercury", "Venus", "Mars", "Jupiter"]', 1, 'Venus is the hottest planet due to its thick greenhouse-gas atmosphere, which traps heat.'),
  ('quiz-space', 'What is the approximate speed of light in a vacuum?', 'mcq', '["150,000 km/s", "300,000 km/s", "500,000 km/s", "1,000,000 km/s"]', 1, 'The speed of light is approximately 299,792 kilometers per second (about 186,000 miles per second).'),
  ('quiz-space', 'What is the name of the boundary around a black hole beyond which nothing can escape?', 'mcq', '["Singularity", "Accretion Disk", "Event Horizon", "Schwarzschild Radius"]', 2, 'The Event Horizon is the threshold where gravity is so strong that even light cannot escape.'),
  ('quiz-space', 'Which galaxy is closest to our Milky Way?', 'mcq', '["Andromeda", "Triangulum", "Large Magellanic Cloud", "Sombrero Galaxy"]', 0, 'Andromeda (M31) is the nearest large galaxy to the Milky Way, located about 2.5 million light-years away.'),
  ('quiz-space', 'What was the name of the first human-made satellite launched into space?', 'mcq', '["Apollo 11", "Vostok 1", "Sputnik 1", "Explorer 1"]', 2, 'Sputnik 1 was launched by the Soviet Union on October 4, 1957, marking the beginning of the space age.'),
  ('quiz-space', 'Which moon is the largest in our solar system?', 'mcq', '["Titan", "Ganymede", "Europa", "Io"]', 1, 'Ganymede, a moon of Jupiter, is the largest moon in the Solar System, even larger than the planet Mercury.'),
  ('quiz-space', 'What telescope, launched in 2021, is designed to study the universe in infrared light?', 'mcq', '["Hubble Space Telescope", "James Webb Space Telescope", "Kepler Space Telescope", "Chandra X-ray Observatory"]', 1, 'The James Webb Space Telescope (JWST) is a premier infrared space observatory launched on December 25, 2021.'),
  ('quiz-space', 'What is the primary source of energy for stars?', 'mcq', '["Chemical combustion", "Nuclear fission", "Nuclear fusion", "Gravitational friction"]', 2, 'Stars generate energy by fusing hydrogen atoms into helium under extreme heat and pressure in their cores.'),
  ('quiz-space', 'Which Mars rover was the first to deploy a helicopter (Ingenuity) on the Martian surface?', 'mcq', '["Curiosity", "Opportunity", "Spirit", "Perseverance"]', 3, 'Perseverance, landing in 2021, carried the Ingenuity helicopter, achieving the first powered flight on another planet.'),
  ('quiz-space', 'Who was the first woman in space?', 'mcq', '["Sally Ride", "Valentina Tereshkova", "Mae Jemison", "Peggy Whitson"]', 1, 'Soviet cosmonaut Valentina Tereshkova flew on Vostok 6 in June 1963, becoming the first woman in space.')
ON CONFLICT (id) DO NOTHING;

-- SEED QUESTIONS FOR 'quiz-geography'
INSERT INTO questions (quiz_id, question, type, options, answer, explanation)
VALUES
  ('quiz-geography', 'What is the capital city of Australia?', 'mcq', '["Sydney", "Melbourne", "Canberra", "Brisbane"]', 2, 'Canberra was selected as the capital in 1908 as a compromise between rivals Sydney and Melbourne.'),
  ('quiz-geography', 'Which river is the longest in the world?', 'mcq', '["Amazon River", "Nile River", "Yangtze River", "Mississippi River"]', 1, 'The Nile is traditionally considered the longest river in the world, stretching 6,650 kilometers (4,132 miles).'),
  ('quiz-geography', 'Which country has the largest number of natural lakes?', 'mcq', '["Canada", "Russia", "United States", "Brazil"]', 0, 'Canada contains more than 60% of the world''s lakes, with over 3 million lakes covering 9% of the country.'),
  ('quiz-geography', 'What is the deepest point in the world''s oceans?', 'mcq', '["Puerto Rico Trench", "Java Trench", "Mariana Trench (Challenger Deep)", "Sunda Trench"]', 2, 'Challenger Deep in the Mariana Trench reaches a depth of nearly 11,000 meters (36,000 feet).'),
  ('quiz-geography', 'Which of these countries is completely landlocked?', 'mcq', '["Vietnam", "Bolivia", "South Africa", "Portugal"]', 1, 'Bolivia lost its coastline to Chile in the War of the Pacific (1879-1884) and remains landlocked.'),
  ('quiz-geography', 'What is the smallest independent nation in the world by land area?', 'mcq', '["Monaco", "San Marino", "Liechtenstein", "Vatican City"]', 3, 'Vatican City covers only 0.49 square kilometers (121 acres) and is entirely surrounded by Rome, Italy.'),
  ('quiz-geography', 'Which mountain is the tallest in the world, measured from base to peak?', 'mcq', '["Mount Everest", "K2", "Mauna Kea", "Mount Kilimanjaro"]', 2, 'While Everest is the highest above sea level, Mauna Kea in Hawaii is the tallest from base (underwater) to peak.'),
  ('quiz-geography', 'Which African country has the most pyramids?', 'mcq', '["Egypt", "Sudan", "Ethiopia", "Libya"]', 1, 'Sudan has over 200 pyramids (built by the Nubian Kingdom of Kush), which is double Egypt''s count.'),
  ('quiz-geography', 'Which country shares the longest border with another country?', 'mcq', '["Russia", "China", "Canada", "Chile"]', 2, 'The Canada-United States border is the longest international border, measuring 8,891 kilometers.'),
  ('quiz-geography', 'Which ocean is the largest on Earth?', 'mcq', '["Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Pacific Ocean"]', 3, 'The Pacific Ocean covers more than 30% of the Earth''s surface, making it larger than all Earth''s landmasses combined.')
ON CONFLICT (id) DO NOTHING;

-- SEED QUESTIONS FOR 'quiz-history'
INSERT INTO questions (quiz_id, question, type, options, answer, explanation)
VALUES
  ('quiz-history', 'Who was the first Emperor of the Roman Empire?', 'mcq', '["Julius Caesar", "Augustus", "Nero", "Marcus Aurelius"]', 1, 'Augustus (formerly Octavian) became the first official Roman Emperor in 27 BC, ending the Roman Republic.'),
  ('quiz-history', 'What year did the Berlin Wall fall, leading to the reunification of Germany?', 'mcq', '["1985", "1989", "1991", "1993"]', 1, 'The Berlin Wall was opened on November 9, 1989, paving the way for the end of communist regimes in Europe.'),
  ('quiz-history', 'Who invented the movable type printing press in Europe around 1440?', 'mcq', '["Leonardo da Vinci", "Johannes Gutenberg", "Isaac Newton", "Galileo Galilei"]', 1, 'Johannes Gutenberg''s printing press revolutionized knowledge distribution, initiating the printing revolution.'),
  ('quiz-history', 'Which ancient civilization constructed the city of Machu Picchu?', 'mcq', '["Aztecs", "Mayans", "Incas", "Olmecs"]', 2, 'Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru.'),
  ('quiz-history', 'What was the primary cause of the US Civil War?', 'mcq', '["Tariffs and taxation", "The institution of slavery", "Gold Rush territorial disputes", "The War of 1812 residuals"]', 1, 'The war erupted primarily due to disagreements over the expansion of slavery into new territories and states'' rights to keep it.'),
  ('quiz-history', 'Who was the British Prime Minister during most of World War II?', 'mcq', '["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Anthony Eden"]', 1, 'Winston Churchill served as Prime Minister from 1940 to 1945, leading Britain''s war efforts against the Axis powers.'),
  ('quiz-history', 'What code of laws, dating back to around 1750 BC, is famous for the phrase ''an eye for an eye''?', 'mcq', '["Code of Hammurabi", "Justinian Code", "Magna Carta", "Ten Commandments"]', 0, 'The Code of Hammurabi is one of the oldest deciphered writings of significant length in the world, originating in Babylon.'),
  ('quiz-history', 'The signing of which document in 1215 limited the power of the English monarchy?', 'mcq', '["Treaty of Versailles", "Magna Carta", "Declaration of Independence", "Bill of Rights"]', 1, 'Magna Carta was issued by King John of England at Runnymede to make the king subject to the law.'),
  ('quiz-history', 'Which empire was ruled by Genghis Khan?', 'mcq', '["Ottoman Empire", "Roman Empire", "Mongol Empire", "Persian Empire"]', 2, 'Genghis Khan founded the Mongol Empire in 1206, which grew to become the largest contiguous land empire in history.'),
  ('quiz-history', 'What event in 1914 triggered the outbreak of World War I?', 'mcq', '["The sinking of the Lusitania", "The assassination of Archduke Franz Ferdinand", "The invasion of Poland", "The Bolshevik Revolution"]', 1, 'Archduke Franz Ferdinand of Austria was assassinated in Sarajevo by Gavrilo Princip, setting off the WWI alliance system.')
ON CONFLICT (id) DO NOTHING;

-- SEED QUESTIONS FOR 'quiz-pop-culture'
INSERT INTO questions (quiz_id, question, type, options, answer, explanation)
VALUES
  ('quiz-pop-culture', 'What is the best-selling video game of all time?', 'mcq', '["Tetris", "Grand Theft Auto V", "Minecraft", "Super Mario Bros."]', 2, 'Minecraft, released in 2011, has sold over 300 million copies across all platforms.'),
  ('quiz-pop-culture', 'Which film won the first-ever Academy Award for Best Picture in 1929?', 'mcq', '["Wings", "Metropolis", "The Jazz Singer", "Sunrise"]', 0, 'Wings, a silent war film about WWI fighter pilots, won the first Outstanding Picture Oscar.'),
  ('quiz-pop-culture', 'Which video game console, released in 2000, remains the best-selling console of all time?', 'mcq', '["PlayStation 2", "Nintendo Wii", "Xbox 360", "Nintendo DS"]', 0, 'Sony''s PlayStation 2 sold over 155 million units worldwide during its lifecycle.'),
  ('quiz-pop-culture', 'Who is known as the ''King of Pop''?', 'mcq', '["Prince", "Elvis Presley", "Michael Jackson", "David Bowie"]', 2, 'Michael Jackson is globally recognized as the King of Pop due to his influence, dancing, and record sales.'),
  ('quiz-pop-culture', 'What is the highest-grossing film box office of all time (unadjusted for inflation)?', 'mcq', '["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"]', 0, 'James Cameron''s Avatar (2009) holds the top spot with over $2.9 billion in worldwide earnings.'),
  ('quiz-pop-culture', 'In what year was the first commercial video game, ''Computer Space'', released?', 'mcq', '["1969", "1971", "1975", "1980"]', 1, 'Created by Nolan Bushnell and Ted Dabney (future founders of Atari), Computer Space was released in 1971.'),
  ('quiz-pop-culture', 'Which of the following characters is the protagonist of the Legend of Zelda series?', 'mcq', '["Zelda", "Link", "Ganon", "Mario"]', 1, 'Link is the green-clad hero who rescues Princess Zelda in the fantasy adventure franchise.'),
  ('quiz-pop-culture', 'Which pop singer''s fans are famously referred to as ''Swifties''?', 'mcq', '["Ariana Grande", "Taylor Swift", "Selena Gomez", "Billie Eilish"]', 1, 'Taylor Swift''s massive and dedicated fanbase is widely known as Swifties.'),
  ('quiz-pop-culture', 'Which gaming franchise features a master assassin named Ezio Auditore da Firenze?', 'mcq', '["God of War", "Assassin''s Creed", "Witcher", "Skyrim"]', 1, 'Ezio is the beloved protagonist of Assassin''s Creed II, Brotherhood, and Revelations.'),
  ('quiz-pop-culture', 'How many members were there in the classic lineup of the English rock band The Beatles?', 'mcq', '["3", "4", "5", "6"]', 1, 'The Beatles'' famous lineup consisted of John Lennon, Paul McCartney, George Harrison, and Ringo Starr.')
ON CONFLICT (id) DO NOTHING;
