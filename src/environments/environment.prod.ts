export const environment = {
  production: true,
  apiUrl: 'http://localhost:8000/api', // Cambiar por URL de producción cuando esté lista
  authEndpoints: {
    login: '/usuarios/login/',
    refresh: '/auth/refresh/',
    logout: '/auth/logout/',
    profile: '/auth/profile/'
  },
  userEndpoints: {
    create: '/usuarios/usuarios/create/',
    list: '/usuarios/usuarios/',
    detail: '/usuarios/usuarios/id/', // + id/
    update: '/usuarios/usuarios/id/update/', // + id/update/
    toggleStatus: '/usuarios/usuarios/id/toggle-status/'
  }
};