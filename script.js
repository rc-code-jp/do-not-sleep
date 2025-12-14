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
    alert('スリープ防止の有効化に失敗しました。お使いのブラウザが対応していないか、バッテリー残量が少なすぎる可能性があります。');
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
    btnText.textContent = '無効にする';
    statusIndicator.innerHTML = 'ステータス: <span>スリープ防止中</span>';
    toggleBtn.setAttribute('aria-label', 'スリープ防止を無効にする');
  } else {
    mainContainer.classList.remove('active-mode');
    btnText.textContent = '有効にする';
    statusIndicator.innerHTML = 'ステータス: <span>通常</span>';
    toggleBtn.setAttribute('aria-label', 'スリープ防止を有効にする');
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
