export const environment = {
  production: true,
  apiUrl: 'https://api.skynet.com/api', // Cambiar por URL de producción
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