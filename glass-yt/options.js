(() => {
  'use strict';

  const { DEFAULTS, themes, fonts, normalize } = globalThis.GlassYtConfig;
  const STORAGE_KEY = 'glassYtEnabled';
  const SETTINGS_KEY = 'glassYtSettings';
  const fieldIds = ['theme', 'customColor', 'glassIntensity', 'transparency', 'blur', 'borderIntensity', 'shadowIntensity', 'radius', 'chipStyle', 'ambientGlow', 'animatedGlow', 'reflectionIntensity', 'font', 'typographyPreset', 'fontWeight', 'fontSize', 'letterSpacing', 'lineHeight', 'animationSpeed', 'reflectionSpeed', 'hoverEffects', 'reflection', 'logoStyle', 'headerStyle', 'sidebarStyle', 'cardStyle', 'buttonStyle', 'subscribeStyle', 'playerStyle', 'adBlocker', 'gpuOptimizations', 'reduceAnimations', 'disableAmbient', 'disableReflections', 'highContrast', 'strongFocus'];
  const outputUnits = { glassIntensity: '%', transparency: '%', blur: 'px', borderIntensity: '%', shadowIntensity: '%', radius: 'px', reflectionIntensity: '%', fontWeight: '', fontSize: '%', letterSpacing: '%', lineHeight: '' };
  const presets = {
    youtube: { font: 'Roboto', fontWeight: 400, fontSize: 100, letterSpacing: 0, lineHeight: 1.35 },
    modern: { font: 'Inter', fontWeight: 500, fontSize: 100, letterSpacing: 0, lineHeight: 1.4 },
    minimal: { font: 'Manrope', fontWeight: 500, fontSize: 98, letterSpacing: -1, lineHeight: 1.35 },
    elegant: { font: 'Playfair Display', fontWeight: 500, fontSize: 104, letterSpacing: 0, lineHeight: 1.5 },
    futuristic: { font: 'Space Grotesk', fontWeight: 500, fontSize: 100, letterSpacing: 1, lineHeight: 1.3 },
    gaming: { font: 'Rajdhani', fontWeight: 600, fontSize: 101, letterSpacing: 1, lineHeight: 1.25 },
    soft: { font: 'Nunito', fontWeight: 500, fontSize: 100, letterSpacing: 0, lineHeight: 1.45 },
    professional: { font: 'Source Sans 3', fontWeight: 500, fontSize: 100, letterSpacing: 0, lineHeight: 1.4 },
    arabic: { font: 'Cairo', fontWeight: 500, fontSize: 100, letterSpacing: 0, lineHeight: 1.45 }
  };
  let settings = normalize(DEFAULTS);
  let saveTimer = null;
  const friendlyHints = {
    theme: 'Choose the color that gently tints all glass surfaces.',
    customColor: 'Pick a personal accent color for your glass theme.',
    glassIntensity: 'Controls how visible the glass tint and highlight appear.',
    transparency: 'Controls how much of the page shows through each glass surface.',
    blur: 'Controls background blur behind glass surfaces, never videos or text.',
    borderIntensity: 'Controls the brightness of subtle glass edges.',
    shadowIntensity: 'Controls how much depth surfaces have above the page.',
    radius: 'Controls how rounded the intentional glass surfaces appear.',
    chipStyle: 'Sets the look of the recommendation category pills.',
    ambientGlow: 'Adds a soft color glow behind the page background.',
    reflectionIntensity: 'Controls the strength of the glass highlight.',
    font: 'Changes YouTube typography when the selected font is available.',
    typographyPreset: 'Applies a friendly matching set of text settings.',
    fontWeight: 'Controls how bold page text appears.',
    fontSize: 'Adjusts YouTube text size without changing page layout.',
    letterSpacing: 'Adjusts the space between letters for readability.',
    lineHeight: 'Adjusts the space between text lines.',
    logoStyle: 'Controls the appearance of the small Glass YT mark.',
    headerStyle: 'Chooses how the rounded top navigation glass is presented.',
    sidebarStyle: 'Chooses how the rounded left navigation glass is presented.',
    cardStyle: 'Sets the subtle surface treatment on video items.',
    buttonStyle: 'Sets the treatment for YouTube action buttons.',
    subscribeStyle: 'Sets the treatment for Subscribe buttons.'
  };

  function addFriendlyHints() {
    Object.entries(friendlyHints).forEach(([id, hint]) => {
      const control = document.querySelector(`#${id}`);
      const field = control?.closest('.field');
      if (!field || field.querySelector('.field-help')) return;
      const help = document.createElement('small');
      help.className = 'field-help';
      help.textContent = hint;
      field.append(help);
    });
  }

  function buildThemes() {
    const select = document.querySelector('#theme');
    const groups = {};
    Object.entries(themes).forEach(([key, [label, , group]]) => (groups[group] ||= []).push([key, label]));
    Object.entries(groups).forEach(([group, entries]) => {
      const groupElement = document.createElement('optgroup'); groupElement.label = group[0].toUpperCase() + group.slice(1);
      entries.forEach(([key, label]) => groupElement.append(new Option(label, key)));
      select.append(groupElement);
    });
    select.append(new Option('Custom color', 'custom'));
    const datalist = document.querySelector('#font-options');
    fonts.forEach((font) => datalist.append(new Option(font, font)));
  }

  function formatOutput(id, value) {
    const output = document.querySelector(`#${id}-value`); if (!output) return;
    output.textContent = `${value}${outputUnits[id] || ''}`;
  }

  function updateUI() {
    fieldIds.forEach((id) => {
      const element = document.querySelector(`#${id}`); if (!element) return;
      if (element.type === 'checkbox') element.checked = Boolean(settings[id]);
      else element.value = settings[id];
      formatOutput(id, settings[id]);
    });
    document.querySelector('#custom-color-value').textContent = settings.customColor.toUpperCase();
    document.querySelector('#customColorHex').value = settings.customColor.toUpperCase();
  }

  function collectUI() {
    const next = { ...settings };
    fieldIds.forEach((id) => {
      const element = document.querySelector(`#${id}`); if (!element) return;
      next[id] = element.type === 'checkbox' ? element.checked : (element.type === 'range' ? Number(element.value) : element.value);
      if (id === 'customColor') next.theme = 'custom';
    });
    settings = normalize(next); updateUI(); queueSave();
  }

  function queueSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(async () => {
      await chrome.storage.sync.set({ [SETTINGS_KEY]: settings, [STORAGE_KEY]: settings.enabled });
      document.querySelector('#save-status').textContent = 'Saved · preview updated live';
    }, 80);
  }

  async function initialize() {
    buildThemes();
    addFriendlyHints();
    const saved = await chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULTS.enabled, [SETTINGS_KEY]: DEFAULTS });
    settings = normalize({ ...(saved[SETTINGS_KEY] || {}), enabled: saved[STORAGE_KEY] });
    updateUI();
  }

  fieldIds.forEach((id) => {
    const element = document.querySelector(`#${id}`);
    element.addEventListener(element.type === 'range' || element.type === 'color' ? 'input' : 'change', () => {
      if (id === 'typographyPreset' && presets[element.value]) settings = normalize({ ...settings, ...presets[element.value] });
      collectUI();
    });
  });

  document.querySelector('#customColorHex').addEventListener('input', (event) => {
    const value = event.target.value.trim();
    if (!/^#[0-9a-f]{6}$/i.test(value)) return;
    settings = normalize({ ...settings, customColor: value, theme: 'custom' });
    document.querySelector('#theme').value = 'custom';
    document.querySelector('#customColor').value = value;
    document.querySelector('#custom-color-value').textContent = value.toUpperCase();
    queueSave();
  });

  document.querySelector('#reset-button').addEventListener('click', () => {
    if (!window.confirm('Reset all Glass YT settings to their defaults?')) return;
    settings = normalize(DEFAULTS); updateUI(); queueSave();
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes[SETTINGS_KEY]) { settings = normalize(changes[SETTINGS_KEY].newValue || {}); updateUI(); }
  });
  initialize();
})();
