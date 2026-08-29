

-- Expect 193 papers and 6912 questions.
select
  (select count(*) from public.bank_papers)    as papers,
  (select count(*) from public.bank_questions) as questions,
  (select count(*) from public.bank_papers where has_school)     as school_papers,
  (select count(*) from public.bank_papers where is_board_paper) as board_papers,
  (select count(distinct school) from public.bank_papers where has_school) as distinct_schools;
