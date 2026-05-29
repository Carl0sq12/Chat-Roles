export const E = {
  bg:           '#FFF7F0',
  bg2:          '#FEF3E8',
  card:         '#FFFFFF',
  primary:      '#F97316',
  primaryDark:  '#EA580C',
  primaryLight: '#FED7AA',
  primaryDim:   'rgba(249,115,22,0.12)',
  primaryGlow:  'rgba(249,115,22,0.35)',
  secondary:    '#0EA5E9',
  success:      '#22C55E',
  danger:       '#EF4444',
  warning:      '#F59E0B',
  text:         '#1C1C1E',
  textDim:      '#6B7280',
  textMute:     '#9CA3AF',
  border:       'rgba(249,115,22,0.22)',
  borderHover:  'rgba(249,115,22,0.55)',
  gradPrimary:  ['#F97316', '#EA580C'] as const,
  gradBlue:     ['#0EA5E9', '#0284C7'] as const,
  radius: { sm: 10, md: 14, lg: 20, xl: 24, full: 100 },
} as const;

export const Colors = {
  light: {
    text: '#1C1C1E', background: '#FFF7F0',
    tint: '#F97316', icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF', tabIconSelected: '#F97316',
  },
  dark: {
    text: '#ECEDEE', background: '#151718',
    tint: '#F97316', icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6', tabIconSelected: '#F97316',
  },
};