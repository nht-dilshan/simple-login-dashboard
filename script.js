function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.querySelector('.password-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.textContent = '🙈'; // change icon when visible
    } else {
        passwordInput.type = 'password';
        passwordIcon.textContent = '👁️'; // revert icon when hidden
    }
}

// Add at the top
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
