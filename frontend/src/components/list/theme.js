import styles from '@dash-ui/styles'

export const variables = {
  color: {
    dark: '#B58900',
    med: '#839496',
    light: '#FDF6E3',
  },
  pad: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2rem',
  },
  shadow: {
    lg:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
}

styles.variables(variables)

export { default as styles } from '@dash-ui/styles'
