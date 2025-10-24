export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  authEndpoints: {
    login: '/usuarios/login/',
    refresh: '/auth/refresh/',
    logout: '/auth/logout/',
    profile: '/auth/profile/'
  },
  userEndpoints: {
    create: '/usuarios/usuarios/create/',
    list: '/usuarios/usuarios/',
    detail: '/usuarios/usuarios/', // + id/
    update: '/usuarios/usuarios/', // + id/
    delete: '/usuarios/usuarios/'  // + id/
  }
};