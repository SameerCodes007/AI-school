-- Test Teacher User
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440000',  -- replace with actual UUID
  'authenticated',
  'authenticated',
  'teacher@example.com',
  crypt('teacher123', gen_salt('bf')),  -- password: teacher123
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Test Student User
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440001',  -- replace with actual UUID
  'authenticated',
  'authenticated',
  'student@example.com',
  crypt('student123', gen_salt('bf')),  -- password: student123
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create profiles for test users
INSERT INTO public.profiles (id, email, role)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'teacher@example.com', 'teacher'),
  ('550e8400-e29b-41d4-a716-446655440001', 'student@example.com', 'student');