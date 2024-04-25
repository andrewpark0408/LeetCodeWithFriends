-- Drop tables if they already exist for a clean setup
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS solutions CASCADE;
DROP TABLE IF EXISTS daily_challenges CASCADE;
DROP TABLE IF EXISTS problems CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Problems Table
CREATE TABLE problems (
    problem_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50)
);

-- Create Solutions Table
CREATE TABLE solutions (
    solution_id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(problem_id),
    user_id INTEGER REFERENCES users(user_id),
    solution_text TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Daily Challenges Table
CREATE TABLE daily_challenges (
    challenge_id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(problem_id),
    date DATE NOT NULL
);

-- Create Groups Table
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL
);

-- Create Group Members Table
CREATE TABLE group_members (
    group_member_id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(group_id),
    user_id INTEGER REFERENCES users(user_id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)  -- Ensure unique membership
);

-- Sample data insertion for Users
INSERT INTO users (username, email, password) VALUES ('testuser', 'test@example.com', 'securepassword');

-- Sample data insertion for Problems
INSERT INTO problems (title, description, difficulty) VALUES ('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.', 'Easy');

-- Sample data insertion for Solutions
INSERT INTO solutions (problem_id, user_id, solution_text) VALUES (1, 1, 'function twoSum(nums, target) { ... }');

-- Sample data insertion for Daily Challenges
INSERT INTO daily_challenges (problem_id, date) VALUES (1, '2023-04-23');

-- Sample data insertion for Groups
INSERT INTO groups (name, code) VALUES ('Sample Group', 'ABCD1234');

-- Sample data insertion for Group Members
INSERT INTO group_members (group_id, user_id) VALUES (1, 1);
