-- Revert hard-coded rows inserted by 006_seed_quiz_data.sql.
-- user_question_responses.question_id has no ON DELETE CASCADE, so clear responses first.
DELETE FROM user_question_responses
WHERE question_id IN (
  SELECT id FROM quiz_questions
  WHERE topic_id IN (
    SELECT id FROM quiz_topics
    WHERE category_id IN (
      'a1b2c3d4-0001-0001-0001-000000000001',
      'a1b2c3d4-0002-0002-0002-000000000002'
    )
  )
);

DELETE FROM quiz_categories
WHERE id IN (
  'a1b2c3d4-0001-0001-0001-000000000001',
  'a1b2c3d4-0002-0002-0002-000000000002'
);
