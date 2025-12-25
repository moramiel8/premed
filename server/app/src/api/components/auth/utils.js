const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  secure: true,        
  sameSite: 'none',      
};

const refreshTokenExp = 31536000;
const accessTokenExp = 900;

const refreshCookieSettings = {
  name: '_rt',
  options: {
    ...baseCookieOptions,
    path: '/api',       
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

export const createAccessCookie = (res, token) =>
  res.cookie(accessCookieSettings.name, token, accessCookieSettings.options);

export const createRefreshCookie = (res, token) =>
  res.cookie(refreshCookieSettings.name, token, refreshCookieSettings.options);

export const clearAccessCookie = (res) =>
  res.clearCookie(accessCookieSettings.name, {
    ...baseCookieOptions,
    path: '/',
  });

export const clearRefreshCookie = (res) =>
  res.clearCookie(refreshCookieSettings.name, {
    ...baseCookieOptions,
    path: '/api',
  });

export const getAccessCookie = (req) => req.cookies?._at;
export const getRefreshCookie = (req) => req.cookies?._rt;
