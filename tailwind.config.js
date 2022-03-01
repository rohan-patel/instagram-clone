module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    fill: (theme) => ({
      red: theme('colors.red.primary'),
    }),
    colors: {
      white: '#ffffff',
      blue: {
        dark: '#0095f6',
        signup: '#19a2f8',
        medium: '#38abf7',
      },
      black: {
        light: '#262626',
        faded: '#00000059',
        bg: '#00000070',
      },
      gray: {
        base: '#616161',
        background: '#fafafa',
        primary: '#dbdbdb',
        border: '#f5f5f5',
      },
      red: {
        primary: '#ed4956',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
}
