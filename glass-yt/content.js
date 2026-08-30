/* Glass YT — visual state controller. It only sets CSS variables and root
 * attributes; YouTube's DOM, playback, account and navigation logic remain
 * untouched. */
(() => {
  'use strict';

  const config = globalThis.GlassYtConfig;
  const STORAGE_KEY = 'glassYtEnabled';
  const SETTINGS_KEY = 'glassYtSettings';
  const ROOT_ATTRIBUTE = 'data-glass-yt';
  const DEFAULTS = config.DEFAULTS;
  let settings = config.normalize(DEFAULTS);
  let adPlayerObserver = null;
  let observedPlayer = null;

  const SKIP_AD_SELECTOR = '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-slot button';

  function skipVisibleAd(player) {
    const skipButton = player?.querySelector(SKIP_AD_SELECTOR);
    if (skipButton instanceof HTMLElement && !skipButton.disabled) skipButton.click();
  }

  function syncAdBlocker(enabled) {
    const root = document.documentElement;
    root.toggleAttribute('data-glass-yt-ad-blocker', Boolean(enabled));
    if (adPlayerObserver) {
      adPlayerObserver.disconnect();
      adPlayerObserver = null;
      observedPlayer = null;
    }
    if (!enabled) return;

    const player = document.querySelector('#movie_player, ytd-player');
    if (!player) return;
    observedPlayer = player;
    skipVisibleAd(player);
    adPlayerObserver = new MutationObserver(() => skipVisibleAd(observedPlayer));
    adPlayerObserver.observe(player, { childList: true, subtree: true });
  }

  const inlineProperties = [
    '--gyt-primary', '--gyt-primary-rgb', '--gyt-secondary', '--gyt-accent', '--gyt-glow',
    '--gyt-surface-alpha', '--gyt-surface-strong-alpha', '--gyt-surface-hover-alpha',
    '--gyt-border-alpha', '--gyt-shadow-alpha', '--gyt-surface', '--gyt-surface-strong',
    '--gyt-surface-hover', '--gyt-border', '--gyt-blur-amount', '--gyt-radius',
    '--gyt-animation-duration', '--gyt-reflection-opacity', '--gyt-reflection-duration',
    '--gyt-ambient-opacity', '--gyt-font-family', '--gyt-font-weight', '--gyt-font-size',
    '--gyt-letter-spacing', '--gyt-line-height', '--gyt-logo-filter', '--gyt-extension-icon', '--gyt-primary-contrast', '--gyt-text', '--gyt-text-secondary',
    '--gyt-card-scale', '--gyt-card-lift'
  ];

  function clearInlineTheme() {
    const root = document.documentElement;
    inlineProperties.forEach((property) => root.style.removeProperty(property));
    ['data-glass-yt', 'data-glass-yt-theme', 'data-glass-yt-logo', 'data-glass-yt-ambient',
      'data-glass-yt-reflection', 'data-glass-yt-animated-glow', 'data-glass-yt-hover', 'data-glass-yt-high-contrast',
      'data-glass-yt-reduced-motion', 'data-glass-yt-button', 'data-glass-yt-subscribe',
      'data-glass-yt-header', 'data-glass-yt-sidebar', 'data-glass-yt-card',
      'data-glass-yt-player', 'data-glass-yt-chip', 'data-glass-yt-gpu', 'data-glass-yt-strong-focus', 'data-glass-yt-ad-blocker'].forEach((attribute) => root.removeAttribute(attribute));
    syncAdBlocker(false);
  }

  function applySettings() {
    const root = document.documentElement;
    if (!settings.enabled) {
      clearInlineTheme();
      return;
    }

    const theme = config.resolveTheme(settings);
    const pageIsDark = root.hasAttribute('dark');
    const intensity = settings.glassIntensity / 100;
    const transparency = settings.transparency / 100;
    const opacityMultiplier = .40 + intensity * .60;
    const baseAlpha = (.045 + (1 - transparency) * .22) * opacityMultiplier;
    const strongAlpha = Math.min(.46, baseAlpha + .055 + intensity * .045);
    const hoverAlpha = Math.min(.50, baseAlpha + .08 + intensity * .07);
    const shadowAlpha = (settings.shadowIntensity / 100) * .42;
    const borderAlpha = .015 + (settings.borderIntensity / 100) * .24;
    const animationDuration = settings.reduceAnimations || settings.animationSpeed === 'off' ? '0ms' : ({ slow: '360ms', normal: '220ms', fast: '120ms' }[settings.animationSpeed] || '220ms');
    const reflectionEnabled = settings.reflection && !settings.disableReflections;
    const ambientEnabled = settings.ambientGlow !== 'off' && !settings.disableAmbient;
    const ambientOpacity = ambientEnabled ? ({ low: .055, medium: .09, high: .14 }[settings.ambientGlow] || .055) : 0;
    const reflectionOpacity = reflectionEnabled ? (settings.reflectionIntensity / 100) * .42 : 0;
    const reflectionDuration = ({ slow: '12s', normal: '7s', fast: '3.5s' }[settings.reflectionSpeed] || '7s');
    const fontFamily = `"${settings.font}", system-ui, -apple-system, "Segoe UI", sans-serif`;
    const logoHue = (theme.hue + 330) % 360;
    const logoFilter = {
      original: 'none',
      theme: `grayscale(1) sepia(1) hue-rotate(${logoHue}deg) saturate(5) brightness(1.18)`,
      glass: `grayscale(.45) sepia(.35) hue-rotate(${logoHue}deg) saturate(2.6) brightness(1.35)`,
      monochrome: pageIsDark ? 'grayscale(1) brightness(1.9)' : 'grayscale(1) brightness(.72)',
      gradient: `grayscale(.5) sepia(.5) hue-rotate(${logoHue}deg) saturate(4) brightness(1.25)`
    }[settings.logoStyle];

    root.setAttribute(ROOT_ATTRIBUTE, 'enabled');
    root.setAttribute('data-glass-yt-theme', settings.theme);
    root.setAttribute('data-glass-yt-logo', settings.logoStyle);
    root.setAttribute('data-glass-yt-button', settings.buttonStyle);
    root.setAttribute('data-glass-yt-subscribe', settings.subscribeStyle);
    root.setAttribute('data-glass-yt-header', settings.headerStyle);
    root.setAttribute('data-glass-yt-sidebar', settings.sidebarStyle);
    root.setAttribute('data-glass-yt-card', settings.cardStyle);
    root.setAttribute('data-glass-yt-player', settings.playerStyle);
    root.setAttribute('data-glass-yt-chip', settings.chipStyle);
    root.toggleAttribute('data-glass-yt-gpu', settings.gpuOptimizations);
    root.toggleAttribute('data-glass-yt-strong-focus', settings.strongFocus);
    root.toggleAttribute('data-glass-yt-ambient', ambientEnabled);
    root.toggleAttribute('data-glass-yt-reflection', reflectionEnabled);
    root.toggleAttribute('data-glass-yt-animated-glow', reflectionEnabled && settings.animatedGlow);
    root.toggleAttribute('data-glass-yt-hover', settings.hoverEffects);
    root.toggleAttribute('data-glass-yt-high-contrast', settings.highContrast);
    root.toggleAttribute('data-glass-yt-reduced-motion', settings.reduceAnimations);
    syncAdBlocker(settings.adBlocker);

    const vars = {
      '--gyt-primary': theme.hex,
      '--gyt-primary-rgb': theme.rgb,
      '--gyt-secondary': `hsl(${theme.hue} ${Math.min(100, theme.isLight ? 58 : 76)}% ${theme.isLight ? 42 : 68}%)`,
      '--gyt-accent': theme.hex,
      '--gyt-glow': `rgba(${theme.rgb}, ${Math.min(.30, .06 + intensity * .20).toFixed(3)})`,
      '--gyt-surface-alpha': baseAlpha.toFixed(3),
      '--gyt-surface-strong-alpha': strongAlpha.toFixed(3),
      '--gyt-surface-hover-alpha': hoverAlpha.toFixed(3),
      '--gyt-border-alpha': borderAlpha.toFixed(3),
      '--gyt-shadow-alpha': shadowAlpha.toFixed(3),
      '--gyt-surface': `rgba(${theme.rgb}, ${baseAlpha.toFixed(3)})`,
      '--gyt-surface-strong': `rgba(${theme.rgb}, ${strongAlpha.toFixed(3)})`,
      '--gyt-surface-hover': `rgba(${theme.rgb}, ${hoverAlpha.toFixed(3)})`,
      '--gyt-border': `rgba(${theme.rgb}, ${borderAlpha.toFixed(3)})`,
      '--gyt-blur-amount': `${settings.blur}px`,
      '--gyt-radius': `${settings.radius}px`,
      '--gyt-animation-duration': animationDuration,
      '--gyt-reflection-opacity': reflectionOpacity.toFixed(3),
      '--gyt-reflection-duration': reflectionDuration,
      '--gyt-ambient-opacity': ambientOpacity.toFixed(3),
      '--gyt-font-family': fontFamily,
      '--gyt-font-weight': String(settings.fontWeight),
      '--gyt-font-size': `${settings.fontSize}%`,
      '--gyt-letter-spacing': `${(settings.letterSpacing / 100).toFixed(3)}em`,
      '--gyt-line-height': String(settings.lineHeight),
      '--gyt-logo-filter': logoFilter,
      '--gyt-extension-icon': `url("${chrome.runtime.getURL('icons/icon.svg')}")`,
      '--gyt-primary-contrast': theme.isLight ? '#141923' : '#ffffff',
      '--gyt-text': pageIsDark ? '#f5f8ff' : '#182238',
      '--gyt-text-secondary': pageIsDark ? 'rgba(232, 239, 252, .72)' : 'rgba(36, 51, 79, .74)',
      '--gyt-card-scale': '1',
      '--gyt-card-lift': '0px'
    };
    Object.entries(vars).forEach(([property, value]) => root.style.setProperty(property, value));
  }

  function setEnabled(value) {
    settings = config.normalize({ ...settings, enabled: Boolean(value) });
    applySettings();
  }

  function setSettings(next) {
    settings = config.normalize({ ...settings, ...next });
    applySettings();
  }

  function readState() {
    chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULTS.enabled, [SETTINGS_KEY]: DEFAULTS }, (result) => {
      settings = config.normalize({ ...(result[SETTINGS_KEY] || {}), enabled: result[STORAGE_KEY] });
      applySettings();
    });
  }

  readState();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;
    if (changes[SETTINGS_KEY]) setSettings(changes[SETTINGS_KEY].newValue || {});
    if (changes[STORAGE_KEY]) setEnabled(changes[STORAGE_KEY].newValue);
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'glass-yt:set-enabled') {
      setEnabled(message.enabled);
      sendResponse({ ok: true, enabled: settings.enabled });
    }
    if (message?.type === 'glass-yt:set-settings') {
      setSettings(message.settings || {});
      sendResponse({ ok: true, settings });
    }
    if (message?.type === 'glass-yt:get-state') sendResponse({ enabled: settings.enabled, settings });
  });

  document.addEventListener('yt-navigate-finish', () => applySettings(), { passive: true });

  // Only observe the theme attribute, avoiding an expensive whole-page observer.
  new MutationObserver(() => applySettings()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['dark']
  });
})();
