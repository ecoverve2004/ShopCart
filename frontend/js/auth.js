// Enhanced authentication functionality with proper click handling and validation

class AuthManager {
    constructor() {
        this.currentUser = this.loadCurrentUser();
        this.token = localStorage.getItem('token');
        this.updateAuthUI();
    }

    loadCurrentUser() {
        return JSON.parse(localStorage.getItem('user') || 'null');
    }

    saveCurrentUser(user, token) {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            if (token) {
                localStorage.setItem('token', token);
                this.token = token;
            }
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this.token = null;
        }
    }

    async login(email, password) {
        try {
            // Validate inputs
            if (!email || !password) {
                throw new Error('Please enter both email and password');
            }

            if (!this.validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Try API call first
            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                    this.saveCurrentUser(this.currentUser, data.token);
                    this.updateAuthUI();

                    clickHandler.showToast(`Welcome back, ${data.user.name}!`, 'success');

                    // Close login modal
                    document.getElementById('login-modal').style.display = 'none';

                    // Check for redirect
                    const redirect = localStorage.getItem('redirectAfterLogin');
                    if (redirect) {
                        localStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirect;
                    }

                    return true;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Invalid credentials');
                }
            } catch (apiError) {
                console.warn('API not available, falling back to local storage');
                // Fallback to local storage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                this.currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };

                this.saveCurrentUser(this.currentUser, 'local-token');
                this.updateAuthUI();

                clickHandler.showToast(`Welcome back, ${user.name}!`, 'success');

                // Close login modal
                document.getElementById('login-modal').style.display = 'none';

                return true;
            }

        } catch (error) {
            console.error('Login error:', error);
            clickHandler.showToast(error.message || 'Login failed', 'error');
            return false;
        }
    }

    async register(name, email, password, confirmPassword) {
        try {
            // Validate inputs
            if (!name || !email || !password || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }

            if (!this.validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Try API call first
            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Auto-login after registration
                    await this.login(email, password);
                    
                    clickHandler.showToast(`Welcome, ${name}! Your account has been created.`, 'success');
                    
                    // Close register modal
                    document.getElementById('register-modal').style.display = 'none';
                    
                    return true;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Registration failed');
                }
            } catch (apiError) {
                console.warn('API not available, falling back to local storage');
                // Fallback to local storage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                if (users.some(u => u.email === email)) {
                    throw new Error('Email already registered');
                }

                // Create new user locally
                const newUser = {
                    id: 'user-' + Date.now(),
                    name: name,
                    email: email,
                    password: password,
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // Auto-login after registration
                this.currentUser = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                };

                this.saveCurrentUser(this.currentUser, 'local-token');
                this.updateAuthUI();
                
                clickHandler.showToast(`Welcome, ${name}! Your account has been created.`, 'success');
                
                // Close register modal
                document.getElementById('register-modal').style.display = 'none';
                
                return true;
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            clickHandler.showToast(error.message || 'Registration failed', 'error');
            return false;
        }
    }

    logout() {
        const userName = this.currentUser?.name || 'User';
        this.currentUser = null;
        this.saveCurrentUser(null);
        this.updateAuthUI();
        
        clickHandler.showToast(`Goodbye, ${userName}!`, 'info');
        
        // Redirect to home
        window.location.href = 'index.html';
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    updateAuthUI() {
        const userBtn = document.getElementById('user-btn');
        
        if (!userBtn) return;

        if (this.currentUser) {
            userBtn.innerHTML = `<i class="fas fa-user-circle"></i>`;
            userBtn.setAttribute('aria-label', `Logged in as ${this.currentUser.name}`);
            
            // Make user btn a link to profile
            userBtn.href = 'profile.html';
            userBtn.onclick = null;
        } else {
            userBtn.innerHTML = '<i class="fas fa-user"></i>';
            userBtn.setAttribute('aria-label', 'Login or Register');
            
            // Add login/register functionality
            userBtn.onclick = (e) => {
                e.preventDefault();
                document.getElementById('login-modal').style.display = 'block';
            };
        }
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    getToken() {
        return this.token;
    }
}

// Initialize auth manager
const auth = new AuthManager();

// Global auth functions for onclick handlers
window.showLogin = () => {
    document.getElementById('login-modal').style.display = 'block';
};

window.showRegister = () => {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('register-modal').style.display = 'block';
};

// Form submission handlers
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;
            
            await auth.login(email, password);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('#register-name').value;
            const email = registerForm.querySelector('#register-email').value;
            const password = registerForm.querySelector('#register-password').value;
            const confirmPassword = registerForm.querySelector('#register-confirm-password').value;
            
            await auth.register(name, email, password, confirmPassword);
        });
    }

    // Link between login and register modals
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('register-modal').style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-modal').style.display = 'none';
            document.getElementById('login-modal').style.display = 'block';
        });
    }
});
