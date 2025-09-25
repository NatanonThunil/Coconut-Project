import jwt from 'jsonwebtoken'

export const requireAuth = (req, res, next) => {
  try {
    let token = null
    if (req.cookies?.access_token) token = req.cookies.access_token
    else if (req.headers.authorization?.startsWith('Bearer '))
      token = req.headers.authorization.split(' ')[1]

    if (!token) return res.status(401).json({ message: 'No token' })

    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
