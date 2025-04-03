module.exports = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      disabled: '#666666'
    },
    border: '#404040',
    error: '#FF6B6B',
    success: '#4ECDC4',
    warning: '#FFE66D',
    info: '#4ECDC4'
  },
  
  components: {
    card: {
      base: {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)'
      }
    },
    input: {
      base: {
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)',
        '&:focus': {
          borderColor: 'var(--color-primary)',
          boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.2)'
        }
      }
    }
  }
}; 