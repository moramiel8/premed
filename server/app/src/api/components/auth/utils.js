const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  // domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
};

const refreshTokenExp = 31536000; // 1 year
const accessTokenExp = 900;       // 15 minutes

const refreshCookieSettings = {
  name: '_rt',
  options: {
    ...baseCookieOptions,
    path: '/api/auth/refreshToken',
    maxAge: refreshTokenExp * 1000,
  },
};

const accessCookieSettings = {
  name: '_at',
  options: {
    ...baseCookieOptions,
    path: '/',
    maxAge: accessTokenExp * 1000,
  },
};

export const createAccessCookie = (res, token) => {
  return res.cookie(accessCookieSettings.name, token, 
    accessCookieSettings.options);
};

export const createRefreshCookie = (res, token) => {
  return res.cookie(refreshCookieSettings.name, token, 
    refreshCookieSettings.options);
};

export const clearAccessCookie = (res) => {
  return res.clearCookie(accessCookieSettings.name, {
    ...baseCookieOptions,
    path: accessCookieSettings.options.path,
  });
};

export const clearRefreshCookie = (res) => {
  return res.clearCookie(refreshCookieSettings.name, {
    ...baseCookieOptions,
    path: refreshCookieSettings.options.path,
  });
};

export const getAccessCookie = (req) => req.cookies?.
[accessCookieSettings.name];

export const getRefreshCookie = (req) => req.cookies?.
[refreshCookieSettings.name];
