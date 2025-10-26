export const environment = {
  production: true,
  apiUrl: 'https://skynet-backend-lz8a.onrender.com/api',
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