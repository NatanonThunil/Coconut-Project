import { jwtDecode } from 'jwt-decode'

export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return

  const token = localStorage.getItem('adminToken')
  if (!token) {
    if (to.path !== '/backend/login') return navigateTo('/backend/login')
    return
  }

  try {
    const decodedToken: { exp: number; role: string } = jwtDecode(token)

    // ตรวจสอบหมดอายุ
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('adminToken')
      return navigateTo('/backend/login')
    }

    // ตรวจสอบ role
    if (!['admin', 'superadmin'].includes(decodedToken.role)) {
      return navigateTo('/backend/login')
    }
  } catch (error) {
    localStorage.removeItem('adminToken')
    return navigateTo('/backend/login')
  }
})
