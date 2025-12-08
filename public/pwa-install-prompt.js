// Simple PWA install prompt script
(function() {
  // Check if the user has already dismissed the prompt
  if (localStorage.getItem('pwaPromptDismissed') === 'true') {
    return;
  }

  // Check if the app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return;
  }

  // Create the install prompt element
  function createPrompt() {
    const promptContainer = document.createElement('div');
    promptContainer.id = 'pwa-install-prompt';
    promptContainer.style.position = 'fixed';
    promptContainer.style.bottom = '20px';
    promptContainer.style.left = '20px';
    promptContainer.style.right = '20px';
    promptContainer.style.maxWidth = '400px';
    promptContainer.style.margin = '0 auto';
    promptContainer.style.backgroundColor = 'white';
    promptContainer.style.borderRadius = '8px';
    promptContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    promptContainer.style.padding = '16px';
    promptContainer.style.zIndex = '9999';
    promptContainer.style.display = 'flex';
    promptContainer.style.flexDirection = 'column';
    promptContainer.style.border = '1px solid #2563eb';

    // Add content to the prompt
    promptContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">Install SwiftDrop</h3>
        <button id="pwa-close-btn" style="background: none; border: none; cursor: pointer; padding: 0; color: #6b7280;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563;">
        Install our app for a better experience with offline access and faster loading times.
      </p>
      <div style="display: flex; gap: 8px;">
        <button id="pwa-install-btn" style="padding: 8px 16px; background-color: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">
          How to Install
        </button>
        <button id="pwa-dismiss-btn" style="padding: 8px 16px; background-color: #e5e7eb; color: #374151; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">
          Not now
        </button>
      </div>
    `;

    document.body.appendChild(promptContainer);

    // Add event listeners
    document.getElementById('pwa-close-btn').addEventListener('click', dismissPrompt);
    document.getElementById('pwa-dismiss-btn').addEventListener('click', dismissPrompt);
    document.getElementById('pwa-install-btn').addEventListener('click', showInstallInstructions);
  }

  // Dismiss the prompt
  function dismissPrompt() {
    const prompt = document.getElementById('pwa-install-prompt');
    if (prompt) {
      prompt.style.display = 'none';
      localStorage.setItem('pwaPromptDismissed', 'true');
    }
  }

  // Show install instructions
  function showInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let message = 'To install this app:\n\n';
    
    if (isIOS) {
      message += 'Tap the share icon (📤) at the bottom of the screen and select "Add to Home Screen"';
    } else if (isAndroid) {
      message += 'Tap the menu button (⋮) and select "Install App" or "Add to Home Screen"';
    } else {
      message += 'In your browser menu, select "Install App" or "Add to Home Screen"';
    }
    
    alert(message);
    dismissPrompt();
  }

  // Show the prompt after a delay
  setTimeout(createPrompt, 5000);
})();