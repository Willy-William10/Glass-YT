(() => {
  'use strict';

  const { DEFAULTS, themes, normalize } = globalThis.GlassYtConfig;
  const STORAGE_KEY = 'glassYtEnabled';
  const SETTINGS_KEY = 'glassYtSettings';
  const toggle = document.querySelector('#enabled-toggle');
  const status = document.querySelector('#status');
  const siteNote = document.querySelector('#site-note');
  const themeSelect = document.querySelector('#theme-select');
  const logoSelect = document.querySelector('#logo-select');
  const customColor = document.querySelector('#custom-color');
  const customHex = document.querySelector('#custom-hex');
  const intensityRange = document.querySelector('#intensity-range');
  const transparencyRange = document.querySelector('#transparency-range');
  const blurRange = document.querySelector('#blur-range');
  const intensityValue = document.querySelector('#intensity-value');
  const transparencyValue = document.querySelector('#transparency-value');
  const blurValue = document.querySelector('#blur-value');
  let settings = normalize(DEFAULTS);
  let activeTabId = null;
  let activeTabIsYouTube = false;
  let saveTimer = null;

  function setStatus(enabled) {
    status.textContent = enabled ? 'Status: Glass YT is ON' : 'Status: Glass YT is OFF';
    status.classList.toggle('is-on', enabled);
  }

  function populateThemes() {
    const groups = {};
    Object.entries(themes).forEach(([key, [label, , group]]) => (groups[group] ||= []).push([key, label]));
    Object.entries(groups).forEach(([group, entries]) => {
      const optgroup = document.createElement('optgroup'); optgroup.label = group[0].toUpperCase() + group.slice(1);
      entries.forEach(([key, label]) => { const option = new Option(label, key); optgroup.append(option); });
      themeSelect.append(optgroup);
    });
    themeSelect.append(new Option('Custom color', 'custom'));
  }

  function updateControls() {
    document.querySelector('.popup-shell')?.classList.toggle('animated-glow', settings.animatedGlow);
    themeSelect.value = settings.theme;
    logoSelect.value = settings.logoStyle;
    customColor.value = settings.customColor;
    customHex.value = settings.customColor.toUpperCase();
    intensityRange.value = settings.glassIntensity;
    transparencyRange.value = settings.transparency;
    blurRange.value = settings.blur;
    intensityValue.textContent = `${settings.glassIntensity}%`;
    transparencyValue.textContent = `${settings.transparency}%`;
    blurValue.textContent = `${settings.blur}px`;
  }

  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    activeTabId = tab?.id ?? null;
    activeTabIsYouTube = /^https:\/\/www\.youtube\.com\//.test(tab?.url || '');
    siteNote.hidden = activeTabIsYouTube;
  }

  async function send(type, payload) {
    if (!activeTabIsYouTube || activeTabId === null) return;
    try { await chrome.tabs.sendMessage(activeTabId, { type, ...payload }); } catch { /* loading tab */ }
  }

  function queueSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(async () => {
      await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
      await send('glass-yt:set-settings', { settings });
    }, 100);
  }

  function readControls() {
    settings = normalize({ ...settings,
      theme: themeSelect.value,
      logoStyle: logoSelect.value,
      customColor: customColor.value,
      glassIntensity: Number(intensityRange.value),
      transparency: Number(transparencyRange.value),
      blur: Number(blurRange.value)
    });
    updateControls(); queueSave();
  }

  async function initialize() {
    populateThemes();
    const saved = await chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULTS.enabled, [SETTINGS_KEY]: DEFAULTS });
    settings = normalize({ ...(saved[SETTINGS_KEY] || {}), enabled: saved[STORAGE_KEY] });
    toggle.checked = settings.enabled; setStatus(settings.enabled); updateControls();
    await getActiveTab();
  }

  toggle.addEventListener('change', async () => {
    settings.enabled = toggle.checked; setStatus(toggle.checked); toggle.disabled = true;
    try { await chrome.storage.sync.set({ [STORAGE_KEY]: toggle.checked, [SETTINGS_KEY]: settings }); await send('glass-yt:set-enabled', { enabled: toggle.checked }); }
    finally { toggle.disabled = false; }
  });
  [themeSelect, logoSelect, intensityRange, transparencyRange, blurRange].forEach((control) => control.addEventListener('input', readControls));
  [themeSelect, logoSelect, customColor].forEach((control) => control.addEventListener('change', readControls));
  customColor.addEventListener('input', () => {
    themeSelect.value = 'custom';
    readControls();
  });
  customHex.addEventListener('change', () => {
    if (!/^#[0-9a-f]{6}$/i.test(customHex.value.trim())) { updateControls(); return; }
    settings = normalize({ ...settings, customColor: customHex.value.trim(), theme: 'custom' });
    themeSelect.value = 'custom';
    customColor.value = settings.customColor; updateControls(); queueSave();
  });
  document.querySelectorAll('#advanced-button, #settings-button').forEach((button) => button.addEventListener('click', () => chrome.runtime.openOptionsPage()));
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;
    if (changes[SETTINGS_KEY]) { settings = normalize(changes[SETTINGS_KEY].newValue || {}); updateControls(); setStatus(settings.enabled); }
    if (changes[STORAGE_KEY]) { toggle.checked = Boolean(changes[STORAGE_KEY].newValue); settings.enabled = toggle.checked; setStatus(toggle.checked); }
  });
  initialize();
})();
