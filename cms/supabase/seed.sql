-- ============================================================
-- aboutData CMS – Seed Data
-- Run AFTER schema.sql and after creating your admin user
-- ============================================================

-- Website content seed
INSERT INTO public.website_content (section, field_key, field_value) VALUES
  -- Hero
  ('hero', 'headline', 'Vi hjælper din virksomhed med at vokse med data'),
  ('hero', 'subheadline', 'Professionel dataanalyse og Business Intelligence der omsætter tal til handlingsplaner'),
  ('hero', 'cta_primary_text', 'Kom i gang'),
  ('hero', 'cta_primary_link', '#contact'),
  ('hero', 'cta_secondary_text', 'Se vores services'),

  -- About
  ('about', 'title', 'Om aboutData'),
  ('about', 'body', 'Vi er et specialiseret konsulentfirma der hjælper virksomheder med at udnytte potentialet i deres data. Med ekspertise indenfor SQL, Power BI og avanceret analyse leverer vi løsninger der skaber reel forretningsværdi.'),
  ('about', 'mission', 'Vores mission er at gøre datadrevet beslutningstagning tilgængelig for alle virksomheder – uanset størrelse.'),
  ('about', 'values', 'Integritet, faglig ekspertise og målbare resultater er fundamentet i alt hvad vi gør.'),

  -- Services
  ('services', 'title', 'Vores services'),
  ('services', 'subtitle', 'Skræddersyede dataløsninger til din virksomheds behov'),
  ('services', 'items', '[
    {"id":"1","title":"Dataanalyse","description":"Dyb analyse af dine forretningsdata for at afdække mønstre, muligheder og vækstpotentiale.","icon":"BarChart2"},
    {"id":"2","title":"Business Intelligence","description":"Power BI dashboards og automatiserede rapporter der giver dig realtidsoverblik over din forretning.","icon":"PieChart"},
    {"id":"3","title":"SQL & Database optimering","description":"Strukturering og optimering af dine databaser for bedre performance og datakvalitet.","icon":"Database"}
  ]'),

  -- Contact
  ('contact', 'title', 'Kontakt os'),
  ('contact', 'subtitle', 'Vi er klar til at hjælpe dig med din næste dataudfordring. Udfyld formularen eller skriv direkte til os.'),
  ('contact', 'email', 'info@aboutdata.dk'),
  ('contact', 'phone', '+45 00 00 00 00'),
  ('contact', 'address', 'København, Danmark')
ON CONFLICT (section, field_key) DO UPDATE
  SET field_value = EXCLUDED.field_value, updated_at = NOW();


-- Sample analytics events (last 7 days for demo charts)
INSERT INTO public.analytics_events (event_type, section, page, created_at) VALUES
  ('page_view', null, '/', NOW() - INTERVAL '6 days'),
  ('page_view', null, '/', NOW() - INTERVAL '6 days'),
  ('page_view', null, '/', NOW() - INTERVAL '5 days'),
  ('page_view', null, '/', NOW() - INTERVAL '5 days'),
  ('page_view', null, '/', NOW() - INTERVAL '5 days'),
  ('cta_click', 'hero', '/', NOW() - INTERVAL '5 days'),
  ('page_view', null, '/', NOW() - INTERVAL '4 days'),
  ('page_view', null, '/', NOW() - INTERVAL '4 days'),
  ('page_view', null, '/', NOW() - INTERVAL '4 days'),
  ('page_view', null, '/', NOW() - INTERVAL '4 days'),
  ('cta_click', 'hero', '/', NOW() - INTERVAL '4 days'),
  ('cta_click', 'services', '/', NOW() - INTERVAL '4 days'),
  ('page_view', null, '/', NOW() - INTERVAL '3 days'),
  ('page_view', null, '/', NOW() - INTERVAL '3 days'),
  ('page_view', null, '/', NOW() - INTERVAL '3 days'),
  ('cta_click', 'hero', '/', NOW() - INTERVAL '3 days'),
  ('form_submit', 'contact', '/', NOW() - INTERVAL '3 days'),
  ('page_view', null, '/', NOW() - INTERVAL '2 days'),
  ('page_view', null, '/', NOW() - INTERVAL '2 days'),
  ('page_view', null, '/', NOW() - INTERVAL '2 days'),
  ('page_view', null, '/', NOW() - INTERVAL '2 days'),
  ('page_view', null, '/', NOW() - INTERVAL '2 days'),
  ('cta_click', 'hero', '/', NOW() - INTERVAL '2 days'),
  ('cta_click', 'contact', '/', NOW() - INTERVAL '2 days'),
  ('page_view', null, '/', NOW() - INTERVAL '1 day'),
  ('page_view', null, '/', NOW() - INTERVAL '1 day'),
  ('page_view', null, '/', NOW() - INTERVAL '1 day'),
  ('cta_click', 'hero', '/', NOW() - INTERVAL '1 day'),
  ('form_submit', 'contact', '/', NOW() - INTERVAL '1 day'),
  ('page_view', null, '/', NOW()),
  ('page_view', null, '/', NOW()),
  ('cta_click', 'hero', '/', NOW());


-- Sample leads
INSERT INTO public.leads (name, email, message, status, created_at) VALUES
  ('Mette Hansen', 'mette@eksempel.dk', 'Vi er interesseret i at høre mere om jeres Power BI løsninger til vores salgsafdeling.', 'new', NOW() - INTERVAL '1 day'),
  ('Anders Christensen', 'anders@virksomhed.dk', 'Kan I hjælpe med at bygge et dashboard til vores lager?', 'read', NOW() - INTERVAL '3 days'),
  ('Sofie Nielsen', 'sofie@startup.dk', 'Vi er en startup og søger dataanalyse konsultation.', 'read', NOW() - INTERVAL '5 days'),
  ('Thomas Larsen', 'thomas@consulting.dk', 'Interesseret i SQL optimering af vores databaser.', 'archived', NOW() - INTERVAL '7 days');
