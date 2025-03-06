CREATE TABLE students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(100) UNIQUE NOT NULL,
);

CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    score INT CHECK (score >=0 AND score <= 100),
    FOREIGN KEY {student_id} REFERENCES students(id) ON DELETE CASCADE
) 