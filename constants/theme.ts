export const E = {
  // ── Backgrounds
  bg:        '#080810',
  bg2:       '#0d0d1a',
  bg3:       '#12121f',
  card:      '#10101e',
  cardHover: '#14142a',

  // ── Brand
  violet:     '#7c3aed',
  violetDark: '#5b21b6',
  violetDim:  'rgba(124,58,237,0.12)',
  violetGlow: 'rgba(124,58,237,0.35)',
  neon:       '#a855f7',
  neonSoft:   '#c084fc',
  cyan:       '#22d3ee',
  cyanGlow:   'rgba(34,211,238,0.2)',

  // ── Text
  text:     '#e2e8f0',
  textDim:  '#94a3b8',
  textMute: '#475569',

  // ── Borders
  border:      'rgba(124,58,237,0.22)',
  borderHover: 'rgba(124,58,237,0.55)',

  // ── Gradients (use as array for LinearGradient)
  gradViolet: ['#7c3aed', '#5b21b6'] as const,
  gradCyan:   ['#0e7490', '#164e63'] as const,
  gradPink:   ['#be185d', '#831843'] as const,
  gradGreen:  ['#15803d', '#14532d'] as const,

  // ── Typography
  mono: 'SpaceMono-Regular',   // use expo's SpaceMono or load Share Tech Mono
  sans: 'System',

  // ── Spacing
  radius:   {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 24,
    full: 100,
  },
} as const;
