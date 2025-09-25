import jwt from 'jsonwebtoken'

export function signAT(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

export function signRT(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export function setAuthCookies(res, accessToken, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production' // ✅ ประกาศตัวแปร

  const cookieOpts = {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax', // cross-site ต้อง 'none'
    secure: isProd, // ต้อง https ใน production
  }

  res.cookie('access_token', accessToken, {
    ...cookieOpts,
    maxAge: 15 * 60 * 1000, // 15 นาที
  })

  res.cookie('refresh_token', refreshToken, {
    ...cookieOpts,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
  })
}
