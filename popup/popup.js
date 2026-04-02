(function() {
  var DEFAULTS = {
    master: true,
    github: true,
    hackclub: true,
    carnival: true,
    amberOpacity: 80,
    scanlineIntensity: 40
  };

  var masterEl = document.getElementById('toggle-master');
  var githubEl = document.getElementById('toggle-github');
  var hackclubEl = document.getElementById('toggle-hackclub');
  var carnivalEl = document.getElementById('toggle-carnival');
  var statusEl = document.getElementById('status-text');
  var amberSlider = document.getElementById('slider-amber');
  var scanlineSlider = document.getElementById('slider-scanline');
  var amberVal = document.getElementById('amber-val');
  var scanlineVal = document.getElementById('scanline-val');

  var siteRows = [
    githubEl.closest('.toggle-row'),
    hackclubEl.closest('.toggle-row'),
    carnivalEl.closest('.toggle-row')
  ];

  function updateUI(state) {
    masterEl.checked = state.master;
    githubEl.checked = state.github;
    hackclubEl.checked = state.hackclub;
    carnivalEl.checked = state.carnival;
    amberSlider.value = state.amberOpacity || 80;
    scanlineSlider.value = state.scanlineIntensity || 40;
    amberVal.textContent = state.amberOpacity || 80;
    scanlineVal.textContent = state.scanlineIntensity || 40;

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
      statusEl.textContent = '\u25AE SYSTEM OFFLINE';
      statusEl.classList.add('offline');
    } else if (activeCount === 3) {
      statusEl.textContent = '\u25AE ALL SYSTEMS ONLINE';
      statusEl.classList.remove('offline');
    } else if (activeCount === 0) {
      statusEl.textContent = '\u25AE NO SITES ACTIVE';
      statusEl.classList.add('offline');
    } else {
      statusEl.textContent = '\u25AE ' + activeCount + '/3 SITES ACTIVE';
      statusEl.classList.remove('offline');
    }
  }

  function saveState(state) {
    chrome.storage.sync.set({ retroterm: state });
  }

  function loadState(callback) {
    chrome.storage.sync.get('retroterm', function(result) {
      var state = result.retroterm || DEFAULTS;
      if (state.amberOpacity === undefined) state.amberOpacity = 80;
      if (state.scanlineIntensity === undefined) state.scanlineIntensity = 40;
      callback(state);
    });
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
      state.amberOpacity = parseInt(amberSlider.value);
      saveState(state);
    });
  });

  scanlineSlider.addEventListener('input', function() {
    scanlineVal.textContent = scanlineSlider.value;
  });

  scanlineSlider.addEventListener('change', function() {
    loadState(function(state) {
      state.scanlineIntensity = parseInt(scanlineSlider.value);
      saveState(state);
    });
  });

  loadState(function(state) {
    updateUI(state);
  });
})();
