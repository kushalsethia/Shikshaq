-- APPLIED to project uvtifolnsneitetzohtn and verified.
--
-- IMPORTANT CORRECTION vs the first draft of this file: revoking from `anon`
-- and `authenticated` by name did NOTHING. Postgres grants EXECUTE on functions
-- to PUBLIC by default, and both roles inherit through that grant, so the
-- revoke has to target PUBLIC:
--     revoke execute on function f() from public;
-- and then hand EXECUTE back to `authenticated` for the RPCs the app calls.
--
-- A few functions ALSO carried an explicit `anon=X` grant on top of the PUBLIC
-- one (sync_teachers_list_from_shikshaqmine was the one that mattered - an
-- anonymous caller could kick off a full teachers_list rebuild). Those need a
-- second, role-specific revoke. Check proacl, do not trust
-- has_function_privilege alone after a PUBLIC-only revoke.
--
-- Verified end state: every SECURITY DEFINER function is anon=false except the
-- six sign-in helpers deliberately left open (check_rate_limit,
-- check_user_exists, check_user_has_password, get_public_profile_data,
-- is_admin, is_teacher).
--
-- Revoke public EXECUTE on SECURITY DEFINER functions
--
-- Found by the Supabase security advisor: 29 SECURITY DEFINER functions are
-- callable over the REST API (/rest/v1/rpc/<name>) by the `anon` role — i.e. by
-- anyone with the publishable key, which ships in the client bundle.
--
-- SECURITY DEFINER means the function executes with the privileges of its
-- OWNER, bypassing RLS. RLS being enabled on the tables (it is — the advisor
-- reports no rls_disabled errors) does not protect against these, because the
-- function itself is the privileged path.
--
-- SEVERITY: hardening / defense-in-depth. This is NOT an incident.
--
-- The function bodies were read before writing this migration. The privileged
-- ones already authorize correctly and are not exploitable today:
--   approve_teacher_application  -- raises unless auth.uid() = admin_id
--   assign_teacher_role_by_email -- raises unless auth.uid() = target, or is_admin()
--   get_teacher_email            -- WHERE id = auth.uid(), own row only
-- An anonymous caller reaches an exception, not an escalation.
--
-- The value of this migration is narrowing the surface so that a function added
-- later WITHOUT an auth.uid() check is not exposed to anon by default, and so
-- that trigger-only functions stop being REST-reachable at all.
--
-- GROUP A — trigger functions. These are invoked by triggers, which fire as the
-- table owner. Nothing should ever call them over REST. Revoking EXECUTE from
-- anon and authenticated does not affect trigger execution.
--
-- GROUP B — callable RPCs that stay reachable for authenticated callers. Each
-- already performs its own authorization check internally (verified above);
-- revoking anon removes a layer that should never have been there.

begin;

-- ---------------------------------------------------------------------------
-- GROUP A · trigger-only functions — revoke from both roles
-- ---------------------------------------------------------------------------
revoke execute on function public.auto_assign_teacher_role() from anon, authenticated;
revoke execute on function public.auto_update_area_from_student_tutor_areas() from anon, authenticated;
revoke execute on function public.compute_place_of_teaching() from anon, authenticated;
revoke execute on function public.enforce_recommendation_rate_limit() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.handle_shikshaqmine_delete() from anon, authenticated;
revoke execute on function public.prevent_duplicate_pending_application() from anon, authenticated;
revoke execute on function public.prevent_user_approval_change() from anon, authenticated;
revoke execute on function public.protect_teacher_fields() from anon, authenticated;
revoke execute on function public.rate_limit_feedback() from anon, authenticated;
revoke execute on function public.rate_limit_teacher_applications() from anon, authenticated;
revoke execute on function public.revert_teacher_profile_role_on_shikshaqmine_delete() from anon, authenticated;
revoke execute on function public.sync_auth_to_profiles() from anon, authenticated;
revoke execute on function public.sync_auth_updates_to_profiles() from anon, authenticated;
revoke execute on function public.sync_shikshaqmine_email_to_profiles() from anon, authenticated;
revoke execute on function public.sync_shikshaqmine_to_teachers_list() from anon, authenticated;
revoke execute on function public.update_teacher_comments_approval() from anon, authenticated;
revoke execute on function public.cleanup_rate_limit_log() from anon, authenticated;

-- ---------------------------------------------------------------------------
-- GROUP B · privileged admin operations — revoke from anon
--
-- Each already checks auth.uid() internally, so this is belt-and-braces: an
-- anon caller currently gets 'Not authorized' rather than a result.
-- ---------------------------------------------------------------------------
revoke execute on function public.approve_teacher_application(uuid, uuid) from anon;
revoke execute on function public.assign_teacher_role_by_email(text) from anon;
revoke execute on function public.check_existing_users_for_teacher_role() from anon;
revoke execute on function public.get_teacher_email() from anon;

-- ---------------------------------------------------------------------------
-- GROUP C · user-enumeration surface
--
-- These exist to support the sign-in flow and legitimately need anon access:
-- the app asks "does this email already have a password?" before choosing which
-- auth path to show. Left callable, but they are a user-enumeration vector and
-- should be rate limited. check_rate_limit is the existing mechanism.
--   public.check_user_exists(text)
--   public.check_user_has_password(text)
--   public.check_rate_limit(text, text, integer, integer)
--   public.get_public_profile_data()
--   public.is_admin()
--   public.is_teacher()
-- No change here — listed so the next reader knows it was a decision, not an
-- oversight.
-- ---------------------------------------------------------------------------

commit;
