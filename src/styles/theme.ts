export const theme = {
  colors: {
    primary: {
      main: '#10B981', // emerald-500
      light: '#34D399', // emerald-400
      dark: '#059669', // emerald-600
    },
    secondary: {
      main: '#0EA5E9', // sky-500
      light: '#38BDF8', // sky-400
      dark: '#0284C7', // sky-600
    },
    background: {
      default: '#F0FDF4', // green-50
      paper: '#FFFFFF',
      gradient: 'from-green-50 via-emerald-50 to-teal-50',
    },
    text: {
      primary: '#1F2937', // gray-800
      secondary: '#4B5563', // gray-600
      light: '#9CA3AF', // gray-400
    },
    error: {
      main: '#EF4444', // red-500
      light: '#FEE2E2', // red-50
      dark: '#DC2626', // red-600
    },
    success: {
      main: '#10B981', // emerald-500
      light: '#ECFDF5', // emerald-50
      dark: '#059669', // emerald-600
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    DEFAULT: 'all 0.2s ease-in-out',
    fast: 'all 0.1s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },
  borderRadius: {
    sm: '0.25rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
}; 