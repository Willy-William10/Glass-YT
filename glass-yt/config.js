/* Shared Glass YT settings, theme presets, and font catalog. No remote
 * resources are loaded; the chosen font uses the local system if available. */
(() => {
  'use strict';

  const themes = {
    pureGlass: ['Pure Glass', '#dce8f6', 'neutral'], frostWhite: ['Frost White', '#f4f7fb', 'neutral'],
    graphite: ['Graphite', '#707887', 'neutral'], midnight: ['Midnight', '#40567e', 'neutral'],
    carbon: ['Carbon', '#29303b', 'neutral'], silver: ['Silver', '#aeb9c9', 'neutral'],
    oceanBlue: ['Ocean Blue', '#2e8de6', 'blue'], skyBlue: ['Sky Blue', '#66b7ff', 'blue'],
    electricBlue: ['Electric Blue', '#2c7dff', 'blue'], arcticBlue: ['Arctic Blue', '#8bd8ff', 'blue'],
    deepBlue: ['Deep Blue', '#3154c8', 'blue'], sapphire: ['Sapphire', '#536dfe', 'blue'],
    purple: ['Purple', '#8d5cff', 'purple'], lavender: ['Lavender', '#b99aff', 'purple'],
    violet: ['Violet', '#763cff', 'purple'], deepPurple: ['Deep Purple', '#4c248a', 'purple'],
    amethyst: ['Amethyst', '#a855f7', 'purple'], pink: ['Pink', '#ff72b6', 'pink'],
    rose: ['Rose', '#ff6f91', 'pink'], hotPink: ['Hot Pink', '#f52aa6', 'pink'],
    bubblegum: ['Bubblegum', '#ff9ccc', 'pink'], magenta: ['Magenta', '#e83eaf', 'pink'],
    red: ['Red', '#ff5364', 'red'], crimson: ['Crimson', '#d9364f', 'red'],
    ruby: ['Ruby', '#c62f5d', 'red'], cherry: ['Cherry', '#ff354d', 'red'],
    scarlet: ['Scarlet', '#ff4638', 'red'], orange: ['Orange', '#ff8a3d', 'orange'],
    amber: ['Amber', '#f3ad3f', 'orange'], sunset: ['Sunset', '#ff765c', 'orange'],
    tangerine: ['Tangerine', '#ff9d27', 'orange'], yellow: ['Yellow', '#ebcf43', 'yellow'],
    gold: ['Gold', '#d4a72c', 'yellow'], lemon: ['Lemon', '#d8e54b', 'yellow'],
    green: ['Green', '#4dcc88', 'green'], emerald: ['Emerald', '#21b77a', 'green'],
    mint: ['Mint', '#61e1bb', 'green'], lime: ['Lime', '#a7d94c', 'green'],
    forest: ['Forest', '#327b5b', 'green'], cyan: ['Cyan', '#35d4e8', 'cyan'],
    aqua: ['Aqua', '#48e6d2', 'cyan'], turquoise: ['Turquoise', '#2fc5b7', 'cyan'],
    aurora: ['Aurora', '#75e6cd', 'special'], oceanSunset: ['Ocean Sunset', '#ff8d72', 'special'],
    neonGlass: ['Neon Glass', '#71f5c5', 'special'], cyberGlass: ['Cyber Glass', '#29a9ff', 'special'],
    cosmic: ['Cosmic', '#a58bff', 'special'], galaxy: ['Galaxy', '#7a4bdb', 'special'],
    vaporwave: ['Vaporwave', '#ff4fd8', 'special'], rainbowGlass: ['Rainbow Glass', '#7ef7e8', 'special'],
    holographic: ['Holographic', '#b4c5ff', 'special']
  };

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Nunito', 'Raleway', 'Oswald',
    'Merriweather', 'Playfair Display', 'Roboto Slab', 'Roboto Condensed', 'Ubuntu', 'Noto Sans',
    'Noto Serif', 'Source Sans 3', 'Source Serif 4', 'Work Sans', 'DM Sans', 'Manrope', 'Plus Jakarta Sans',
    'Outfit', 'Space Grotesk', 'Space Mono', 'Fira Sans', 'Fira Code', 'IBM Plex Sans', 'IBM Plex Serif',
    'IBM Plex Mono', 'Quicksand', 'Rubik', 'Cabin', 'Karla', 'Mulish', 'Titillium Web', 'Exo 2',
    'Josefin Sans', 'Libre Baskerville', 'Lora', 'Cormorant Garamond', 'Crimson Text', 'EB Garamond',
    'Merriweather Sans', 'Bitter', 'Arvo', 'Abril Fatface', 'Anton', 'Bebas Neue', 'Barlow',
    'Barlow Condensed', 'Barlow Semi Condensed', 'Comfortaa', 'Dancing Script', 'Pacifico', 'Lobster',
    'Caveat', 'Permanent Marker', 'Righteous', 'Satisfy', 'Great Vibes', 'Indie Flower', 'Patrick Hand',
    'Kalam', 'Architects Daughter', 'Press Start 2P', 'VT323', 'Orbitron', 'Rajdhani', 'Audiowide',
    'Michroma', 'Cinzel', 'Unbounded', 'Exo', 'Chakra Petch', 'Share Tech', 'Share Tech Mono', 'Kanit',
    'Prompt', 'Sarabun', 'Bai Jamjuree', 'Chivo', 'Heebo', 'Assistant', 'Cairo', 'Tajawal', 'Amiri',
    'Almarai', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Noto Kufi Arabic', 'Noto Sans Display',
    'Noto Serif Display', 'Lexend', 'League Spartan', 'Sora', 'Bricolage Grotesque', 'Geist', 'Geist Mono',
    'General Sans'
  ];

  const DEFAULTS = Object.freeze({
    enabled: false, theme: 'pureGlass', customColor: '#8ab4ff', logoStyle: 'theme',
    glassIntensity: 32, transparency: 68, blur: 24, borderIntensity: 32, shadowIntensity: 26,
    radius: 18, animationSpeed: 'normal', hoverEffects: true,
    chipStyle: 'minimal', reflection: true,
    ambientGlow: 'low', animatedGlow: false, reflectionIntensity: 18, reflectionSpeed: 'normal', font: 'Inter',
    fontWeight: 500, fontSize: 100, letterSpacing: 0, lineHeight: 1.35, typographyPreset: 'modern',
    subscribeStyle: 'glass', headerStyle: 'floating', sidebarStyle: 'minimal', cardStyle: 'soft',
    buttonStyle: 'glass', playerStyle: 'premium', gpuOptimizations: true, reduceAnimations: false,
    disableAmbient: false, disableReflections: false, highContrast: false, strongFocus: true,
    adBlocker: false
  });

  function clamp(value, min, max, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }

  function normalize(raw = {}) {
    const output = { ...DEFAULTS, ...raw };
    output.theme = (output.theme === 'custom' || themes[output.theme]) ? output.theme : DEFAULTS.theme;
    output.customColor = /^#[0-9a-f]{6}$/i.test(output.customColor) ? output.customColor : DEFAULTS.customColor;
    output.logoStyle = ['original', 'theme', 'glass', 'monochrome', 'gradient'].includes(output.logoStyle) ? output.logoStyle : DEFAULTS.logoStyle;
    output.glassIntensity = clamp(output.glassIntensity, 0, 100, DEFAULTS.glassIntensity);
    output.transparency = clamp(output.transparency, 0, 100, DEFAULTS.transparency);
    output.blur = clamp(output.blur, 0, 50, DEFAULTS.blur);
    output.borderIntensity = clamp(output.borderIntensity, 0, 100, DEFAULTS.borderIntensity);
    output.shadowIntensity = clamp(output.shadowIntensity, 0, 100, DEFAULTS.shadowIntensity);
    output.radius = clamp(output.radius, 0, 32, DEFAULTS.radius);
    output.chipStyle = ['minimal', 'soft', 'glass'].includes(output.chipStyle) ? output.chipStyle : DEFAULTS.chipStyle;
    output.animationSpeed = ['off', 'slow', 'normal', 'fast'].includes(output.animationSpeed) ? output.animationSpeed : DEFAULTS.animationSpeed;
    output.ambientGlow = ['off', 'low', 'medium', 'high'].includes(output.ambientGlow) ? output.ambientGlow : DEFAULTS.ambientGlow;
    output.reflectionIntensity = clamp(output.reflectionIntensity, 0, 100, DEFAULTS.reflectionIntensity);
    output.animatedGlow = Boolean(output.animatedGlow);
    output.reflectionSpeed = ['slow', 'normal', 'fast'].includes(output.reflectionSpeed) ? output.reflectionSpeed : DEFAULTS.reflectionSpeed;
    output.font = fonts.includes(output.font) ? output.font : DEFAULTS.font;
    output.fontWeight = clamp(output.fontWeight, 100, 900, DEFAULTS.fontWeight);
    output.fontSize = clamp(output.fontSize, 80, 120, DEFAULTS.fontSize);
    output.letterSpacing = clamp(output.letterSpacing, -2, 8, DEFAULTS.letterSpacing);
    output.lineHeight = clamp(output.lineHeight, 1, 2, DEFAULTS.lineHeight);
    for (const key of ['hoverEffects', 'reflection', 'gpuOptimizations', 'reduceAnimations', 'disableAmbient', 'disableReflections', 'highContrast', 'strongFocus', 'adBlocker']) output[key] = Boolean(output[key]);
    return output;
  }

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
  }

  function rgbToHsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2; const delta = max - min;
    if (delta) {
      s = delta / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h = Math.round(h * 60); if (h < 0) h += 360;
    }
    return [h, Math.round(s * 100), Math.round(l * 100)];
  }

  function resolveTheme(settings) {
    const hex = settings.theme === 'custom' ? settings.customColor : (themes[settings.theme]?.[1] || DEFAULTS.customColor);
    const rgb = hexToRgb(hex); const [h, s, l] = rgbToHsl(rgb);
    return { hex, rgb: rgb.join(', '), hsl: `${h} ${s}% ${l}%`, hue: h, isLight: l > 67 };
  }

  globalThis.GlassYtConfig = { themes, fonts, DEFAULTS, normalize, resolveTheme, hexToRgb, rgbToHsl };
})();
