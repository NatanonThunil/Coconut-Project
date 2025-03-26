// import {jwtDecode } from 'jwt-decode';

// export default defineNuxtRouteMiddleware((to, from) => {
//     const token = localStorage.getItem('adminToken');
    
//     if (!token) {
//         if (to.path !== '/backend/login') {
//             return navigateTo('/backend/login');
//         }
//         return;
//     }

//     try {
//         const decodedToken = jwtDecode(token);
//         if (decodedToken.exp * 1000 < Date.now()) {
//             localStorage.removeItem('adminToken');
//             return navigateTo('/backend/login');
//         }
//     } catch (error) {
//         localStorage.removeItem('adminToken');
//         return navigateTo('/backend/login');
//     }
// });
