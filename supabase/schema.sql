-- ══════════════════════════════════════════════════
--  SimHub — Schéma PostgreSQL
--  À coller dans Supabase > SQL Editor > Run
-- ══════════════════════════════════════════════════

-- Sessions de simracing
CREATE TABLE IF NOT EXISTS sessions (
  id          BIGSERIAL PRIMARY KEY,
  circuit     TEXT        NOT NULL,
  country     TEXT        NOT NULL DEFAULT '',
  car         TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  type        TEXT        NOT NULL CHECK (type IN ('Course','Qualif','Essais')),
  sim         TEXT        NOT NULL CHECK (sim IN ('iRacing','LMU','ACC','AC')),
  weather     TEXT        NOT NULL DEFAULT '☀️',
  laptime     TEXT        NOT NULL,
  laps        INTEGER     NOT NULL DEFAULT 0,
  pos         INTEGER     NOT NULL DEFAULT 0,
  delta       TEXT        NOT NULL DEFAULT '',
  setup       TEXT        NOT NULL DEFAULT '',
  session_date TEXT       NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les filtres fréquents
CREATE INDEX IF NOT EXISTS idx_sessions_sim    ON sessions (sim);
CREATE INDEX IF NOT EXISTS idx_sessions_type   ON sessions (type);
CREATE INDEX IF NOT EXISTS idx_sessions_circuit ON sessions (circuit);

-- ══════════════════════════════════════════════════
--  Seed — données initiales
-- ══════════════════════════════════════════════════
INSERT INTO sessions (circuit, country, car, category, type, sim, weather, laptime, laps, pos, delta, setup, session_date) VALUES
('Spa-Francorchamps', '🇧🇪 Belgique',  'Porsche 911 GT3 R', 'GT3', 'Course', 'iRacing', '☀️', '2:01.234', 24, 3, '-0.456', 'Wet',  '12/04/26'),
('Monza',             '🇮🇹 Italie',    'Ferrari 296 GT3',   'GT3', 'Qualif', 'ACC',     '🌤️', '1:46.891', 5,  2, '-0.123', 'Qual', '10/04/26'),
('Nürburgring GP',    '🇩🇪 Allemagne', 'BMW M4 GT3',        'GT3', 'Course', 'ACC',     '⛅', '1:58.723', 30, 7, '+2.341', 'Race', '08/04/26'),
('Silverstone',       '🇬🇧 UK',        'Audi R8 LMS',       'GT3', 'Essais', 'iRacing', '☀️', '1:52.456', 18, 0, '',       'Base', '05/04/26'),
('Le Mans',           '🇫🇷 France',    'Ferrari 296 GT3',   'GT3', 'Course', 'LMU',     '🌙', '3:24.891', 40, 1, '-1.234', 'LM',   '03/04/26'),
('Zandvoort',         '🇳🇱 Pays-Bas',  'Porsche 911 GT3 R', 'GT3', 'Qualif', 'iRacing', '🌧️', '1:31.456', 8,  4, '+0.567', 'Wet',  '01/04/26'),
('Imola',             '🇮🇹 Italie',    'McLaren 720S GT3',  'GT3', 'Course', 'ACC',     '☀️', '1:43.234', 26, 2, '-0.789', 'Race', '29/03/26'),
('Barcelona',         '🇪🇸 Espagne',   'BMW M4 GT3',        'GT3', 'Essais', 'iRacing', '☀️', '1:39.678', 22, 0, '',       'Base', '27/03/26'),
('Spa-Francorchamps', '🇧🇪 Belgique',  'Porsche 911 GT3 R', 'GT3', 'Course', 'iRacing', '⛅', '2:01.555', 24, 5, '+1.234', 'Race', '24/03/26'),
('Watkins Glen',      '🇺🇸 USA',       'Audi R8 LMS',       'GT3', 'Qualif', 'iRacing', '🌤️', '1:34.891', 6,  1, '-0.345', 'Qual', '22/03/26'),
('Bathurst',          '🇦🇺 Australie', 'Ferrari 296 GT3',   'GT3', 'Course', 'ACC',     '☀️', '2:03.456', 32, 3, '-0.123', 'Race', '19/03/26'),
('Portimão',          '🇵🇹 Portugal',  'McLaren 720S GT3',  'GT3', 'Essais', 'iRacing', '☀️', '1:41.234', 15, 0, '',       'Base', '17/03/26'),
('Le Mans',           '🇫🇷 France',    'Ferrari 499P LMH',  'LMH', 'Course', 'LMU',     '🌙', '3:22.123', 40, 2, '-2.456', 'LM',   '14/03/26'),
('Daytona',           '🇺🇸 USA',       'Porsche 911 GT3 R', 'GT3', 'Course', 'iRacing', '☀️', '1:42.891', 20, 1, '-0.987', 'Race', '12/03/26'),
('Suzuka',            '🇯🇵 Japon',     'BMW M4 GT3',        'GT3', 'Qualif', 'ACC',     '🌤️', '1:49.567', 7,  3, '+0.234', 'Qual', '09/03/26');

-- ══════════════════════════════════════════════════
--  Vue stats par simulateur (pour le dashboard)
-- ══════════════════════════════════════════════════
CREATE OR REPLACE VIEW sim_stats AS
SELECT sim, COUNT(*) AS session_count
FROM sessions
GROUP BY sim
ORDER BY session_count DESC;

-- ══════════════════════════════════════════════════
--  Vue top circuits (pour le dashboard)
-- ══════════════════════════════════════════════════
CREATE OR REPLACE VIEW top_circuits AS
SELECT
  circuit,
  COUNT(*)         AS sessions,
  MIN(laptime)     AS best_laptime
FROM sessions
GROUP BY circuit
ORDER BY sessions DESC
LIMIT 5;

-- ══════════════════════════════════════════════════
--  RLS — activer si tu ajoutes l'auth plus tard
-- ══════════════════════════════════════════════════
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read" ON sessions FOR SELECT USING (true);
