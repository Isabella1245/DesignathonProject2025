// Mock accounts for demo
const MOCK_ACCOUNTS = {
  patient: {
    email: "katya@patient.com",
    password: "patient123",
    role: "patient",
    name: "Katya"
  },
  provider: {
    email: "drgator@provider.com",
    password: "provider123",
    role: "provider",
    name: "Dr. Gator"
  }
};

// Consolidated demo JS: eye icon toggle, role selection, inline errors, in-page success, and remember-me (localStorage)
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const toggle = document.getElementById('togglePassword');
  const password = document.getElementById('password');
  const username = document.getElementById('username');
  const roleInput = document.getElementById('role');
  const patientBtn = document.getElementById('patientBtn');
  const providerBtn = document.getElementById('providerBtn');
  const remember = document.getElementById('remember');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const successMessage = document.getElementById('successMessage');

  const STORAGE_KEY = 'hc_login_v1';

  // SVG icons (simple shapes)
  const SVG_EYE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path><path d="M12 9a3 3 0 100 6 3 3 0 000-6z"></path></svg>';
  const SVG_EYE_SLASH = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 3l18 18-1.5 1.5L1.5 4.5 3 3z"></path><path d="M19.07 4.93l-2.12 2.12A9.953 9.953 0 0121.5 12c-1.274 4.057-5.065 7-9.542 7-1.95 0-3.78-.52-5.33-1.43l1.46-1.46A7.963 7.963 0 0012 18c4.477 0 8.268-2.943 9.542-7-.44-1.4-1.2-2.68-2.47-3.97L19.07 4.93z"></path></svg>';

  function setToggleIcon(showing) {
    if (!toggle) return;
    toggle.innerHTML = showing ? SVG_EYE_SLASH : SVG_EYE;
    toggle.setAttribute('aria-pressed', (!!showing).toString());
    toggle.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
  }

  function setRoleUI(role) {
    if (!roleInput) return;
    roleInput.value = role;
    if (role === 'provider') {
      providerBtn?.classList.add('active');
      providerBtn?.setAttribute('aria-pressed', 'true');
      patientBtn?.classList.remove('active');
      patientBtn?.setAttribute('aria-pressed', 'false');
    } else {
      patientBtn?.classList.add('active');
      patientBtn?.setAttribute('aria-pressed', 'true');
      providerBtn?.classList.remove('active');
      providerBtn?.setAttribute('aria-pressed', 'false');
    }
  }

  function showError(node, message) {
    if (!node) return;
    node.textContent = message || '';
    const control = node.previousElementSibling;
    if (control) {
      if (message) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    }
  }

  function clearErrors() { showError(usernameError, ''); showError(passwordError, ''); }

  function showSuccess(text) {
    if (!successMessage) return;
    successMessage.textContent = text;
    successMessage.hidden = false;
    setTimeout(() => { successMessage.hidden = true; }, 4000);
  }

  function persistIfNeeded() {
    try {
      if (remember && remember.checked) {
        const payload = { 
          remember: true, 
          username: username.value || '', 
          password: password.value || '',  // WARNING: storing password in localStorage (demo only)
          role: roleInput.value || 'patient' 
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) { console.warn('localStorage error', err); }
  }

  // Sync Katya's data from patient to provider view
  function syncKatyaData() {
    const katyaData = {
      name: localStorage.getItem('profileName') || 'Katya',
      dob: localStorage.getItem('profileDOB') || '01/01/1990',
      gender: localStorage.getItem('profileGender') || 'Female',
      email: localStorage.getItem('profileEmail') || 'katya@patient.com',
      phone: localStorage.getItem('profilePhoneNum') || '123-456-7890',
      address: localStorage.getItem('profileAddress') || '1234',
      insurance: localStorage.getItem('profileInsurance') || 'insurance provider',
      pharmacy: localStorage.getItem('profilePharmacy') || '5678',
      primaryClinic: localStorage.getItem('profilePrimaryClinic') || 'clinic',
      profileImage: localStorage.getItem('profileImage') || null
    };
    
    localStorage.setItem('katya_patient_data', JSON.stringify(katyaData));
  }

  // Validate credentials against mock accounts
  function validateCredentials(email, pass, role) {
    if (role === 'patient' && email === MOCK_ACCOUNTS.patient.email && pass === MOCK_ACCOUNTS.patient.password) {
      return { valid: true, account: MOCK_ACCOUNTS.patient };
    }
    if (role === 'provider' && email === MOCK_ACCOUNTS.provider.email && pass === MOCK_ACCOUNTS.provider.password) {
      return { valid: true, account: MOCK_ACCOUNTS.provider };
    }
    return { valid: false };
  }

  patientBtn?.addEventListener('click', () => setRoleUI('patient'));
  providerBtn?.addEventListener('click', () => setRoleUI('provider'));

  if (toggle && password) {
    setToggleIcon(password.getAttribute('type') === 'text');
    toggle.addEventListener('mousedown', function (e) { e.preventDefault(); });
    toggle.addEventListener('click', function () {
      const isHidden = password.getAttribute('type') === 'password';
      password.setAttribute('type', isHidden ? 'text' : 'password');
      setToggleIcon(!isHidden);
      password.focus();
    });
  }

  username?.addEventListener('input', () => showError(usernameError, ''));
  password?.addEventListener('input', () => showError(passwordError, ''));

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (stored && stored.remember) {
      if (stored.username) username.value = stored.username;
      if (stored.password) password.value = stored.password;
      if (stored.role) setRoleUI(stored.role);
      remember.checked = true;
    }
  } catch (err) { console.warn('localStorage parse error', err); }

  form?.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    let valid = true;
    
    const emailVal = username.value.trim();
    const passVal = password.value;
    const role = roleInput.value;
    
    if (!emailVal) { 
      showError(usernameError, 'Please enter your email or username.'); 
      if (valid) username.focus(); 
      valid = false; 
    } else if (username.type === 'email' && username.validity && username.validity.typeMismatch) { 
      showError(usernameError, 'Please enter a valid email address.'); 
      if (valid) username.focus(); 
      valid = false; 
    }
    
    if (!passVal) { 
      showError(passwordError, 'Please enter your password.'); 
      if (valid) password.focus(); 
      valid = false; 
    } else if (passVal.length < 8) { 
      showError(passwordError, 'Password must be at least 8 characters.'); 
      if (valid) password.focus(); 
      valid = false; 
    }
    
    if (!valid) return;
    
    // Validate credentials
    const authResult = validateCredentials(emailVal, passVal, role);
    if (!authResult.valid) {
      showError(usernameError, 'Invalid email or password for selected role.');
      return;
    }
    
    persistIfNeeded();
    
    // If logging in as Katya, sync her data
    if (role === 'patient' && authResult.account.name === 'Katya') {
      syncKatyaData();
    }
    
    // Start two-factor verification
    startTwoFactor();
  });

  // Two-factor variables and functions
  const twofaDiv = document.getElementById('twofa');
  const methodBtns = Array.from(document.querySelectorAll('.method-btn'));
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  const resendBtn = document.getElementById('resendBtn');
  const resendTimer = document.getElementById('resendTimer');
  const twofaStatus = document.getElementById('twofaStatus');
  const twofaCodeInput = document.getElementById('twofaCode');
  const twofaError = document.getElementById('twofaError');
  const verifyCodeBtn = document.getElementById('verifyCodeBtn');
  const cancel2faBtn = document.getElementById('cancel2faBtn');

  let currentMethod = 'sms';
  let generatedCode = null;
  let resendInterval = null;
  let resendSeconds = 0;
  let verifyAttempts = 0;

  function showTwofa(show) {
    if (!twofaDiv) return;
    twofaDiv.hidden = !show;
    const formEl = document.getElementById('loginForm');
    if (formEl) formEl.hidden = show;
  }

  function pickMethod(btn) {
    methodBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed','true');
    currentMethod = btn.dataset.method || 'sms';
  }

  methodBtns.forEach(b => b.addEventListener('click', () => pickMethod(b)));

  function updateResendUI(sec) {
    if (!resendBtn || !resendTimer) return;
    if (sec > 0) {
      resendBtn.disabled = true;
      resendTimer.textContent = `Retry in ${sec}s`;
    } else {
      resendBtn.disabled = false;
      resendTimer.textContent = '';
    }
  }

  function startResendCountdown(seconds = 60) {
    resendSeconds = seconds;
    updateResendUI(resendSeconds);
    clearInterval(resendInterval);
    resendInterval = setInterval(() => {
      resendSeconds -= 1;
      if (resendSeconds <= 0) {
        clearInterval(resendInterval);
        updateResendUI(0);
      } else updateResendUI(resendSeconds);
    }, 1000);
  }

  function sendCode(method) {
    generatedCode = ('' + Math.floor(100000 + Math.random() * 900000));
    console.info('[2FA] Sending code via', method, 'code=', generatedCode);
    if (twofaStatus) {
      twofaStatus.hidden = false;
      twofaStatus.textContent = `A one-time code was sent via ${method === 'sms' ? 'text message' : 'email'}.`;
    }
    twofaError && (twofaError.textContent = '');
    twofaCodeInput && (twofaCodeInput.value = '');
    verifyAttempts = 0;
    startResendCountdown(45);
    resendBtn && (resendBtn.disabled = true);
  }

  sendCodeBtn?.addEventListener('click', function () { sendCode(currentMethod); });
  resendBtn?.addEventListener('click', function () { sendCode(currentMethod); });

  function verifyCode() {
    const val = (twofaCodeInput && twofaCodeInput.value || '').trim();
    if (!val) { 
      twofaError && (twofaError.textContent = 'Please enter the one-time code.');
      return; 
    }

    if (!/^\d{6}$/.test(val)) { 
      twofaError && (twofaError.textContent = 'Please enter a 6-digit code.');
      return; 
    }

    // Success: any 6-digit code works
    generatedCode = null;
    clearInterval(resendInterval);
    showTwofa(false);

    const role = roleInput ? roleInput.value : 'patient';
    showSuccess('Signed in as ' + (username.value || '') + ' (' + role + ')');

    // Redirect based on role
    if (role === 'patient') {
      window.location.href = 'patient.html';
    } else if (role === 'provider') {
      window.location.href = 'provider.html';
    }
  }

  verifyCodeBtn?.addEventListener('click', verifyCode);
  cancel2faBtn?.addEventListener('click', function () { 
    generatedCode = null; 
    clearInterval(resendInterval); 
    showTwofa(false); 
  });

  function startTwoFactor() {
    showTwofa(true);
    const active = methodBtns.find(b => b.classList.contains('active')) || methodBtns[0];
    if (active) pickMethod(active);
    setTimeout(() => sendCode(currentMethod), 250);
  }
});