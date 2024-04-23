# LeetCodeWithFriends

## Description
LeetCode with Friends is a web application designed to enable users to solve coding challenges collaboratively. The platform offers daily challenges, real-time collaboration, and discussion forums to enhance the coding experience with friends.

## Technology Stack
- **Frontend**: React, TypeScript, Bulma (CSS Framework)
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- npm
- PostgreSQL

```bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib



# Clone the repository
git clone https://yourrepositorylink.git
cd LeetCodeApp

# Install NPM packages for both frontend and backend
cd frontend
npm install
cd ../backend
npm install

# Set up your PostgreSQL database
sudo -u postgres createdb leetcode_db
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'new_password';"

# Create a .env file in the backend directory and fill in your database details and other configurations:
DB_USER=postgres
DB_PASSWORD=new_password
DB_HOST=localhost
DB_NAME=leetcode_db
DB_PORT=5432
PORT=3001

# Run the backend server
npm run dev

# Run the frontend in another terminal
cd ../frontend
npm start
