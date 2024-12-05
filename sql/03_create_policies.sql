-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Quizzes policies
CREATE POLICY "Published quizzes are viewable by everyone"
ON quizzes FOR SELECT
TO authenticated
USING (is_published = true OR auth.uid() = created_by);

CREATE POLICY "Teachers can create quizzes"
ON quizzes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  )
);

CREATE POLICY "Teachers can update own quizzes"
ON quizzes FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Teachers can delete own quizzes"
ON quizzes FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- Questions policies
CREATE POLICY "Questions are viewable with quiz"
ON questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quizzes
    WHERE id = quiz_id
    AND (is_published = true OR created_by = auth.uid())
  )
);

CREATE POLICY "Teachers can manage questions for own quizzes"
ON questions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM quizzes
    WHERE id = quiz_id
    AND created_by = auth.uid()
  )
);

CREATE POLICY "Teachers can update questions for own quizzes"
ON questions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quizzes
    WHERE id = quiz_id
    AND created_by = auth.uid()
  )
);

CREATE POLICY "Teachers can delete questions for own quizzes"
ON questions FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quizzes
    WHERE id = quiz_id
    AND created_by = auth.uid()
  )
);

-- Quiz attempts policies
CREATE POLICY "Students can view own attempts"
ON quiz_attempts FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Teachers can view attempts for own quizzes"
ON quiz_attempts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quizzes
    WHERE id = quiz_id
    AND created_by = auth.uid()
  )
);

CREATE POLICY "Students can create attempts"
ON quiz_attempts FOR INSERT
TO authenticated
WITH CHECK (
  student_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'student'
  )
);

-- Attempt answers policies
CREATE POLICY "Users can view own attempt answers"
ON attempt_answers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quiz_attempts
    WHERE id = attempt_id
    AND (
      student_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM quizzes
        WHERE id = quiz_id
        AND created_by = auth.uid()
      )
    )
  )
);

CREATE POLICY "Students can create attempt answers"
ON attempt_answers FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM quiz_attempts
    WHERE id = attempt_id
    AND student_id = auth.uid()
  )
);