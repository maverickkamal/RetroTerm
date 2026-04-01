function runBootScreen(siteName, lines) {
  if (sessionStorage.getItem('rt-booted-' + siteName)) return;

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#0D0D00;z-index:99999;display:flex;flex-direction:column;justify-content:center;padding:40px 60px;box-sizing:border-box;font-family:"Press Start 2P",monospace;';

  var linesContainer = document.createElement('div');
  linesContainer.style.cssText = 'flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px;';
  overlay.appendChild(linesContainer);

  var statusBar = document.createElement('div');
  statusBar.style.cssText = 'font-family:"Press Start 2P",monospace;font-size:11px;color:#FFB000;display:flex;gap:16px;align-items:center;padding-top:20px;border-top:1px solid #996800;margin-top:20px;';

  var progressOuter = document.createElement('span');
  progressOuter.style.cssText = 'display:inline-block;';
  progressOuter.textContent = '[                    ] 0%';

  var memLabel = document.createElement('span');
  memLabel.textContent = 'MEM: 640K';

  var sysLabel = document.createElement('span');
  sysLabel.textContent = 'SYS: NOMINAL';

  statusBar.appendChild(progressOuter);
  statusBar.appendChild(memLabel);
  statusBar.appendChild(sysLabel);
  overlay.appendChild(statusBar);

  document.body.appendChild(overlay);

  var totalChars = 0;
  for (var i = 0; i < lines.length; i++) {
    totalChars += lines[i].length;
  }

  var typedChars = 0;

  function updateProgress() {
    var pct = Math.round((typedChars / totalChars) * 100);
    var filled = Math.round(pct / 5);
    var bar = '';
    for (var b = 0; b < 20; b++) {
      bar += b < filled ? '\u2588' : ' ';
    }
    progressOuter.textContent = '[' + bar + '] ' + pct + '%';
  }

  function typeLine(lineIndex) {
    if (lineIndex >= lines.length) {
      setTimeout(function() {
        overlay.style.transition = 'opacity 600ms ease';
        overlay.style.opacity = '0';
        setTimeout(function() {
          overlay.remove();
          sessionStorage.setItem('rt-booted-' + siteName, '1');
        }, 600);
      }, 500);
      return;
    }

    var lineEl = document.createElement('div');
    lineEl.style.cssText = 'font-size:13px;color:#FFB000;white-space:pre;line-height:1.8;';
    linesContainer.appendChild(lineEl);

    var text = lines[lineIndex];
    var charIndex = 0;

    var cursor = document.createElement('span');
    cursor.textContent = '\u25AE';
    cursor.style.cssText = 'animation:rt-blink 1s step-end infinite;';
    lineEl.appendChild(cursor);

    function typeChar() {
      if (charIndex < text.length) {
        cursor.remove();
        lineEl.textContent = text.substring(0, charIndex + 1);
        lineEl.appendChild(cursor);
        charIndex++;
        typedChars++;
        updateProgress();
        setTimeout(typeChar, 28);
      } else {
        cursor.remove();
        lineEl.textContent = text;
        typeLine(lineIndex + 1);
      }
    }

    typeChar();
  }

  typeLine(0);
}

function injectCSS(path) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(path);
  link.setAttribute('data-retroterm', '');
  document.head.appendChild(link);
}

function checkRetroEnabled(siteKey, cssPaths, callback) {
  var DEFAULTS = { master: true, github: true, hackclub: true, carnival: true };

  chrome.storage.sync.get('retroterm', function(result) {
    var state = result.retroterm || DEFAULTS;

    if (!state.master || !state[siteKey]) {
      return;
    }

    for (var i = 0; i < cssPaths.length; i++) {
      injectCSS(cssPaths[i]);
    }

    callback();
  });

  chrome.storage.onChanged.addListener(function(changes) {
    if (changes.retroterm) {
      location.reload();
    }
  });
}

