## QuizAI Database Setup

### Test Users

1. Teacher Account:
   - Email: teacher@example.com
   - Password: teacher123

2. Student Account:
   - Email: student@example.com
   - Password: student123

### Database Schema

The database consists of the following tables:

1. `profiles`: User profiles with roles
2. `quizzes`: Quiz metadata and settings
3. `questions`: Individual quiz questions
4. `quiz_attempts`: Student attempts at quizzes
5. `attempt_answers`: Individual answers in quiz attempts

### Setting Up the Database

1. Run the SQL scripts in the following order:
   - `01_create_tables.sql`: Creates all necessary tables
   - `02_create_functions.sql`: Sets up automatic timestamp updates
   - `03_create_policies.sql`: Implements Row Level Security
   - `04_create_test_users.sql`: Creates test accounts

### Security Features

- Row Level Security (RLS) is enabled on all tables
- Policies ensure users can only access appropriate data
- Automatic timestamp updates track record changes
- UUID primary keys for enhanced security