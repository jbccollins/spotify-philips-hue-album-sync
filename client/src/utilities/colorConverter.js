function cie_to_rgb(t, o, a) {
  void 0 === a && (a = 254);
  var i = 1 - t - o,
    r = (a / 254).toFixed(2),
    N = (r / o) * t,
    h = (r / o) * i,
    n = 1.656492 * N - 0.354851 * r - 0.255038 * h,
    M = 0.707196 * -N + 1.655397 * r + 0.036152 * h,
    e = 0.051713 * N - 0.121364 * r + 1.01153 * h;
  return (
    n > e && n > M && n > 1
      ? ((M /= n), (e /= n), (n = 1))
      : M > e && M > n && M > 1
      ? ((n /= M), (e /= M), (M = 1))
      : e > n && e > M && e > 1 && ((n /= e), (M /= e), (e = 1)),
    (n = n <= 0.0031308 ? 12.92 * n : 1.055 * Math.pow(n, 1 / 2.4) - 0.055),
    (M = M <= 0.0031308 ? 12.92 * M : 1.055 * Math.pow(M, 1 / 2.4) - 0.055),
    (e = e <= 0.0031308 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055),
    (n = Math.round(255 * n)),
    (M = Math.round(255 * M)),
    (e = Math.round(255 * e)),
    isNaN(n) && (n = 0),
    isNaN(M) && (M = 0),
    isNaN(e) && (e = 0),
    [n, M, e]
  );
}

function rgbToCie(t, o, a) {
  var i =
      0.664511 *
        (t = t > 0.04045 ? Math.pow((t + 0.055) / 1.055, 2.4) : t / 12.92) +
      0.154324 *
        (o = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92) +
      0.162028 *
        (a = a > 0.04045 ? Math.pow((a + 0.055) / 1.055, 2.4) : a / 12.92),
    r = 0.283881 * t + 0.668433 * o + 0.047685 * a,
    N = 88e-6 * t + 0.07231 * o + 0.986039 * a,
    h = (i / (i + r + N)).toFixed(4),
    n = (r / (i + r + N)).toFixed(4);
  return isNaN(h) && (h = 0), isNaN(n) && (n = 0), [h, n];
}

const getLuminosity = (r, g, b) => {
  return Math.sqrt(0.241 * r + 0.691 * g + 0.068 * b);
};

// Trial and error got this number. Hues close to this luminosity look good on the hue lights.
const MIDDLE_LUMINOSITY = 12.5;

const luminosityDistanceSort = arr =>
  arr.sort(
    ({ luminosity: luminosity1 }, { luminosity: luminosity2 }) =>
      Math.abs(luminosity1 - MIDDLE_LUMINOSITY) -
      Math.abs(luminosity2 - MIDDLE_LUMINOSITY)
  );

export { cie_to_rgb, rgbToCie, getLuminosity, luminosityDistanceSort };
