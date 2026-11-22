-- Lets the website's key use the CMS tables. Newer Supabase projects don't
-- open new tables automatically. The security rules in 0001_cms.sql still
-- decide what each person can actually see or change.
-- Run once in Supabase → SQL Editor. Safe to run again.

grant usage on schema public to anon, authenticated;

-- content: everyone reads, signed-in editors write (enforced by the rules)
grant select on public.site_settings, public.demo_reels, public.video_reels, public.rates, public.testimonials to anon, authenticated;
grant insert, update, delete on public.site_settings, public.demo_reels, public.video_reels, public.rates, public.testimonials to authenticated;

-- bookings: visitors can send, only editors can read or manage
grant insert on public.inquiries to anon, authenticated;
grant select, update, delete on public.inquiries to authenticated;

grant select on public.editors to authenticated;
grant execute on function public.is_editor() to anon, authenticated;
