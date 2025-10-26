export const environment = {
  production: false,
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
    detail: '/usuarios/usuarios/', // + id/
    update: '/usuarios/usuarios/', // + id/
    delete: '/usuarios/usuarios/'  // + id/
  }
};