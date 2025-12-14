let wakeLock = null;
const toggleBtn = document.getElementById('toggleBtn');
const btnText = document.getElementById('btnText');
const statusIndicator = document.getElementById('statusIndicator');
const mainContainer = document.querySelector('.container');

// Function to request a wake lock
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake Lock is active');
    
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock has been released');
      updateUI(false);
      wakeLock = null;
    });

    updateUI(true);
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
    alert('Failed to activate Wake Lock. Your browser might not support it or battery is too low.');
    updateUI(false);
  }
};

// Function to release the wake lock
const releaseWakeLock = async () => {
  if (wakeLock !== null) {
    await wakeLock.release();
    wakeLock = null;
    updateUI(false);
  }
};

// Handle visibility change to re-acquire lock when tab comes back
const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);

// Update UI elements based on state
const updateUI = (isActive) => {
  if (isActive) {
    mainContainer.classList.add('active-mode');
    btnText.textContent = 'Deactivate';
    statusIndicator.innerHTML = 'Status: <span>Awake & Active</span>';
    toggleBtn.setAttribute('aria-label', 'Deactivate keep awake');
  } else {
    mainContainer.classList.remove('active-mode');
    btnText.textContent = 'Activate';
    statusIndicator.innerHTML = 'Status: <span>Normal</span>';
    toggleBtn.setAttribute('aria-label', 'Activate keep awake');
  }
};

// Toggle button click handler
toggleBtn.addEventListener('click', () => {
  if (wakeLock === null) {
    requestWakeLock();
  } else {
    releaseWakeLock();
  }
});
