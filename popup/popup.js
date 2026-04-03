(function() {
  var SITE_DEFAULTS = {
    github: { amber: 80, scanline: 40, vignette: 70, flicker: true },
    hackclub: { amber: 85, scanline: 30, vignette: 70, flicker: true },
    carnival: { amber: 55, scanline: 10, vignette: 70, flicker: true }
  };

  var DEFAULTS = {
    master: true,
    github: true,
    hackclub: true,
    carnival: true,
    siteSettings: JSON.parse(JSON.stringify(SITE_DEFAULTS))
  };

  var masterEl = document.getElementById('toggle-master');
  var githubEl = document.getElementById('toggle-github');
  var hackclubEl = document.getElementById('toggle-hackclub');
  var carnivalEl = document.getElementById('toggle-carnival');
  var statusEl = document.getElementById('status-text');
  var amberSlider = document.getElementById('slider-amber');
  var scanlineSlider = document.getElementById('slider-scanline');
  var vignetteSlider = document.getElementById('slider-vignette');
  var flickerEl = document.getElementById('toggle-flicker');
  var amberVal = document.getElementById('amber-val');
  var scanlineVal = document.getElementById('scanline-val');
  var vignetteVal = document.getElementById('vignette-val');
  var tabBtns = document.querySelectorAll('.tab-btn');

  var activeSite = 'github';

  var siteRows = [
    githubEl.closest('.toggle-row'),
    hackclubEl.closest('.toggle-row'),
    carnivalEl.closest('.toggle-row')
  ];

  function ensureSiteSettings(state) {
    if (!state.siteSettings) state.siteSettings = JSON.parse(JSON.stringify(SITE_DEFAULTS));
    var sites = ['github', 'hackclub', 'carnival'];
    for (var i = 0; i < sites.length; i++) {
      var s = sites[i];
      if (!state.siteSettings[s]) state.siteSettings[s] = JSON.parse(JSON.stringify(SITE_DEFAULTS[s]));
      if (state.siteSettings[s].amber === undefined) state.siteSettings[s].amber = SITE_DEFAULTS[s].amber;
      if (state.siteSettings[s].scanline === undefined) state.siteSettings[s].scanline = SITE_DEFAULTS[s].scanline;
      if (state.siteSettings[s].vignette === undefined) state.siteSettings[s].vignette = SITE_DEFAULTS[s].vignette;
      if (state.siteSettings[s].flicker === undefined) state.siteSettings[s].flicker = SITE_DEFAULTS[s].flicker;
    }
    return state;
  }

  function updateUI(state) {
    state = ensureSiteSettings(state);

    masterEl.checked = state.master;
    githubEl.checked = state.github;
    hackclubEl.checked = state.hackclub;
    carnivalEl.checked = state.carnival;

    var ss = state.siteSettings[activeSite];
    amberSlider.value = ss.amber;
    scanlineSlider.value = ss.scanline;
    vignetteSlider.value = ss.vignette;
    flickerEl.checked = ss.flicker;
    amberVal.textContent = ss.amber;
    scanlineVal.textContent = ss.scanline;
    vignetteVal.textContent = ss.vignette;

    var masterOn = state.master;

    for (var i = 0; i < siteRows.length; i++) {
      if (masterOn) {
        siteRows[i].classList.remove('disabled');
      } else {
        siteRows[i].classList.add('disabled');
      }
    }

    var activeCount = 0;
    if (masterOn) {
      if (state.github) activeCount++;
      if (state.hackclub) activeCount++;
      if (state.carnival) activeCount++;
    }

    if (!masterOn) {
      statusEl.textContent = 'SYSTEM OFFLINE';
      statusEl.classList.add('offline');
    } else if (activeCount === 3) {
      statusEl.textContent = 'ALL SYSTEMS ONLINE';
      statusEl.classList.remove('offline');
    } else if (activeCount === 0) {
      statusEl.textContent = 'NO SITES ACTIVE';
      statusEl.classList.add('offline');
    } else {
      statusEl.textContent = activeCount + '/3 SITES ACTIVE';
      statusEl.classList.remove('offline');
    }
  }

  function saveState(state) {
    chrome.storage.sync.set({ retroterm: state });
  }

  function loadState(callback) {
    chrome.storage.sync.get('retroterm', function(result) {
      var state = ensureSiteSettings(result.retroterm || JSON.parse(JSON.stringify(DEFAULTS)));
      callback(state);
    });
  }

  for (var t = 0; t < tabBtns.length; t++) {
    tabBtns[t].addEventListener('click', (function(btn) {
      return function() {
        for (var j = 0; j < tabBtns.length; j++) {
          tabBtns[j].classList.remove('active');
        }
        btn.classList.add('active');
        activeSite = btn.getAttribute('data-site');
        loadState(function(state) {
          updateUI(state);
        });
      };
    })(tabBtns[t]));
  }

  masterEl.addEventListener('change', function() {
    loadState(function(state) {
      state.master = masterEl.checked;
      saveState(state);
      updateUI(state);
    });
  });

  githubEl.addEventListener('change', function() {
    loadState(function(state) {
      state.github = githubEl.checked;
      saveState(state);
      updateUI(state);
    });
  });

  hackclubEl.addEventListener('change', function() {
    loadState(function(state) {
      state.hackclub = hackclubEl.checked;
      saveState(state);
      updateUI(state);
    });
  });

  carnivalEl.addEventListener('change', function() {
    loadState(function(state) {
      state.carnival = carnivalEl.checked;
      saveState(state);
      updateUI(state);
    });
  });

  amberSlider.addEventListener('input', function() {
    amberVal.textContent = amberSlider.value;
  });
  amberSlider.addEventListener('change', function() {
    loadState(function(state) {
      state.siteSettings[activeSite].amber = parseInt(amberSlider.value);
      saveState(state);
    });
  });

  scanlineSlider.addEventListener('input', function() {
    scanlineVal.textContent = scanlineSlider.value;
  });
  scanlineSlider.addEventListener('change', function() {
    loadState(function(state) {
      state.siteSettings[activeSite].scanline = parseInt(scanlineSlider.value);
      saveState(state);
    });
  });

  vignetteSlider.addEventListener('input', function() {
    vignetteVal.textContent = vignetteSlider.value;
  });
  vignetteSlider.addEventListener('change', function() {
    loadState(function(state) {
      state.siteSettings[activeSite].vignette = parseInt(vignetteSlider.value);
      saveState(state);
    });
  });

  flickerEl.addEventListener('change', function() {
    loadState(function(state) {
      state.siteSettings[activeSite].flicker = flickerEl.checked;
      saveState(state);
    });
  });

  loadState(function(state) {
    updateUI(state);
  });
})();
