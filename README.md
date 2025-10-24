# Lesson Tracker

## Overview
The Lesson Tracker is a React application designed to help users track lessons, including recording lesson times, durations, charges, and displaying them in a calendar format. The application features a login access code for user authentication and is deployable to a web address.

## Features
- User authentication with a login form.
- Calendar view for tracking lessons.
- Form for adding and editing lesson details.
- List view for displaying lessons on selected dates.
- Modal for managing recurring lessons.
- Dashboard for an overview of lessons and statistics.

## Database Structure
The application uses a Supabase backend with the following database structure:

### Tables
- **Students**: Stores information about students.
- **Lessons**: Records details of each lesson, including time, duration, and charges.
- **Recurring Lessons**: Manages rules for recurring lessons.

### ENUM Types
Custom ENUM types are defined to categorize lesson types and payment statuses.

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd lesson-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and configure your Supabase credentials.

4. Run the application:
   ```
   npm run dev
   ```

## Deployment
The application can be deployed using GitHub Actions. The deployment workflow is defined in `.github/workflows/deploy.yml`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.