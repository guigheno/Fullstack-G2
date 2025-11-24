const { prisma } = require('../config/prisma');

async function currentUser(req, _res, next) {
  try {
    const raw = req.header('X-User-Id') || req.query.userId;
    const id = raw ? Number(raw) : undefined;

    if (Number.isFinite(id)) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          customerId: user.customerId ?? null,
        };
      }
    }
    next();
  } catch (e) {
    next(e);
  }
}

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next({ status: 401, message: 'Usuário não identificado (envie X-User-Id).' });
    if (roles.length && !roles.includes(req.user.role)) {
      return next({ status: 403, message: 'Acesso negado para seu perfil.' });
    }
    next();
  };
}

module.exports = { currentUser, requireRole };
