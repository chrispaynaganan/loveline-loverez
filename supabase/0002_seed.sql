-- Starting content for the CMS: everything currently on the site.
-- Run after 0001_cms.sql. Safe to run again; it never overwrites edits.

insert into public.editors (email) values
  ('lovelinesvo@gmail.com'),
  ('mark.payns@gmail.com')
on conflict do nothing;

insert into public.site_settings (key, value) values
  ('profile', '{"name":"Loveline Loverez","stageName":"Loveline VO","brand":"Boses Filipina","tagline":"Your voice for every story.","intro":"Philippine-based voice-over artist for commercials, explainer videos and digital content. Warm, versatile and studio-equipped, with just the right amount of sparkle in every script.","about":["Kumusta! I''m Loveline, the voice behind Boses Filipina. I record from my own studio in the Philippines and work with brands, agencies and producers here and overseas.","Most of my work is commercials and digital ads, from fabric conditioner to milk formula to vitamins, plus narration, character voices and e-learning. I bring Filipino warmth to every read, and I care just as much about clean audio and hitting your timing to the frame.","Send me a script and I''ll send you a voice that feels like it was always meant to be there."],"location":"Philippines","email":"hello@lovelinevo.com","portrait":"/images/loveline-studio.jpg","portraitCaption":"at work in my studio","stats":[{"value":"500+","label":"projects completed"},{"value":"4+","label":"years behind the mic"},{"value":"500+","label":"happy clients"}],"services":[{"title":"Commercial voice-over","body":"TV, radio, online and social ads that sound like a friend, not a sales pitch."},{"title":"Narration","body":"Explainers, corporate videos and documentaries, clear and easy to follow."},{"title":"Character voices","body":"Animation, games and kids'' content with personality to spare."},{"title":"E-learning","body":"Course modules and training videos that keep learners listening."}],"socials":[{"label":"Upwork","url":"https://www.upwork.com/freelancers/lovelinevo"},{"label":"Fiverr","url":"https://www.fiverr.com/lovelinevo"},{"label":"LinkedIn","url":"https://www.linkedin.com/in/lovelinevo"},{"label":"TikTok","url":"https://www.tiktok.com/@lovelinevo"}],"today":[{"text":"Warm up","done":true},{"text":"Read the script","done":true},{"text":"Record","done":true},{"text":"Send to client","done":false}]}'::jsonb),
  ('rate_card', '{"title":"Voice rate card","updated":"November 2026","includes":["Recorded in my own studio","Clean, edited WAV and MP3 files","One round of pickups for small changes"],"terms":["Rates are for the recording. Broadcast usage and buyouts are quoted per project.","Script changes after recording are billed as a new session.","Rush delivery is available on request."]}'::jsonb)
on conflict (key) do nothing;

insert into public.demo_reels (slug, title, category, blurb, duration, source, is_new, featured, paper, sort) values
  ('commercial', 'Commercial demo', 'Commercial', 'Bright, friendly reads for TV, radio and social ads.', null, '{"kind":"none"}'::jsonb, true, true, 'cream', 1),
  ('narration', 'Narration demo', 'Narration', 'Explainers and corporate videos, warm and easy to follow.', null, '{"kind":"none"}'::jsonb, false, true, 'kraft', 2),
  ('character', 'Character demo', 'Character', 'Playful voices for animation, games and kids'' content.', null, '{"kind":"none"}'::jsonb, false, true, 'blush', 3),
  ('e-learning', 'E-learning demo', 'E-learning', 'Course modules and training that keep people listening.', null, '{"kind":"none"}'::jsonb, false, true, 'butter', 4)
on conflict (slug) do nothing;

insert into public.video_reels (slug, title, client, label, blurb, duration, poster, orientation, source, sort) values
  ('stress-tabs', 'Stress Tabs', 'Stress Tabs', 'TV / digital ad', 'TV and digital commercial for the Stress Tabs vitamin supplement, about stress relief for busy Filipinos.', '0:30', '/images/reel-stresstabs.png', 'landscape', '{"kind":"drive","id":"1l2OBrG2kttJx6c-anE25VotV4kduSAOH"}'::jsonb, 1),
  ('surf-fabcon', 'Surf Fabcon', 'Surf Philippines', 'Digital VO ad', 'Digital ad for Surf fabric conditioner, all about freshness and long-lasting fragrance.', '0:06', '/images/reel-surf.jpg', 'landscape', '{"kind":"drive","id":"1NgGHifoS-jeRxT7E56C740krFW5uB5_R"}'::jsonb, 2),
  ('bonakid', 'Bonakid', 'Bonakid', 'Digital VO ad', 'Digital ad for Bonakid milk formula, about children''s growth, told with warmth and trust.', '0:09', '/images/reel-bonakid.jpg', 'landscape', '{"kind":"drive","id":"1skmoTuJwCoK_zKxEf8Eboqp_bU16S8mq"}'::jsonb, 3)
on conflict (slug) do nothing;

insert into public.rates (grp, service, unit, price_php, price_usd, note, sort)
select * from (values
  ('Commercial', 'Online / social media ad', 'per spot, up to 60s', null::numeric, null::numeric, null, 1),
  ('Commercial', 'TV / radio broadcast', 'per spot, plus usage', null::numeric, null::numeric, null, 2),
  ('Narration', 'Explainer & corporate video', 'per finished minute', null::numeric, null::numeric, null, 3),
  ('Narration', 'E-learning module', 'per finished minute', null::numeric, null::numeric, null, 4),
  ('Character', 'Animation & games', 'per hour in session', null::numeric, null::numeric, null, 5),
  ('Other', 'IVR & phone prompts', 'per set of prompts', null::numeric, null::numeric, null, 6)
) as v
where not exists (select 1 from public.rates);

insert into public.testimonials (quote, highlights, role, company, sort)
select * from (values
  ('We worked with multiple voice artists locally and overseas but couldn''t find the right fit for our project. Once we collaborated with her, everything aligned. The voice performance, sound quality, and time sync were outstanding. She was exactly what we were looking for.', array['Excellent voice acting','High-quality audio','Precise time synchronization']::text[], 'Production Team Lead, Creative Director', 'International media agency', 1),
  ('A true professional and incredibly easy to work with. She delivered strong results, and we genuinely appreciated the collaboration. We should be thanking her.', array['Easy to work with','Strong results']::text[], 'Senior Producer, Production Manager', 'Commercial production studio', 2)
) as v
where not exists (select 1 from public.testimonials);
