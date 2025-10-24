export const environment = {
  production: true,
  apiUrl: 'https://api.skynet.com/api', // Cambiar por URL de producción
  authEndpoints: {
    login: '/auth/login/',
    refresh: '/auth/refresh/',
    logout: '/auth/logout/',
    profile: '/auth/profile/'
  }
};