class SideNavigation {
    constructor(options = {}) {
        this.options = options;
        this.injectCSS();
        this.init();
    }

    injectCSS() {
        // Basic styles for demonstration; replace or extend as needed
        if (!document.getElementById('side-nav-style')) {
            const style = document.createElement('style');
            style.id = 'side-nav-style';
            style.textContent = `
                .side-nav {
                    position: fixed;
                    left: 0;
                    top: 0;
                    height: 100vh;
                    width: 220px;
                    background: #1a1d21;
                    color: #e5e5e5;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #23272b;
                    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .side-nav .nav-brand {
                    padding: 1.5rem 1rem;
                    font-size: 1.4rem;
                    font-weight: bold;
                    color: #fff;
                    border-bottom: 1px solid #23272b;
                }
                .side-nav .nav-items {
                    flex: 1;
                    padding: 1rem 0;
                }
                .side-nav .nav-item {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1.5rem;
                    color: #e5e5e5;
                    text-decoration: none;
                    transition: background 0.2s, color 0.2s;
                    border-left: 3px solid transparent;
                    cursor: pointer;
                }
                .side-nav .nav-item.active, .side-nav .nav-item:hover {
                    background: #232b2f;
                    color: #5cb85c;
                    border-left: 3px solid #5cb85c;
                }
                .side-nav .nav-icon {
                    margin-right: 0.75rem;
                    font-size: 1.2rem;
                }
                .side-nav .nav-footer {
                    padding: 1rem 0;
                    border-top: 1px solid #23272b;
                }
                .side-nav .nav-footer .nav-item {
                    color: #ff4d4d;
                }
                .side-nav .nav-footer .nav-item:hover {
                    background: #2a1a1a;
                    color: #fff;
                }
                @media (max-width: 768px) {
                    .side-nav {
                        width: 70vw;
                        min-width: 160px;
                        max-width: 320px;
                        transform: translateX(-100%);
                        box-shadow: none;
                    }
                    .side-nav.active {
                        transform: translateX(0);
                        box-shadow: 2px 0 16px 0 rgba(0,0,0,0.25);
                    }
                    .side-nav-toggle {
                        display: block;
                        position: fixed;
                        top: 1rem;
                        left: 1rem;
                        background: #1a1d21;
                        color: #fff;
                        border: none;
                        border-radius: 0.375rem;
                        padding: 0.5rem 1rem;
                        z-index: 1100;
                        font-size: 1.5rem;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                }
                @media (min-width: 769px) {
                    .side-nav-toggle {
                        display: none;
                    }
                }
                .side-nav-content-wrapper {
                    margin-left: 220px;
                    transition: margin 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                @media (max-width: 768px) {
                    .side-nav-content-wrapper {
                        margin-left: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    init() {
        // Navigation items (customize as needed)
        const navItems = [
            { id: 'dashboard', name: 'Dashboard', icon: '📊', href: 'dashboard.html' },
            { id: 'calculator', name: 'Calculator', icon: '🧮', href: 'calculator.html' },
            { id: 'inventory', name: 'Inventory', icon: '📦', href: 'https://hmp86inventory.tiiny.site/', external: true }
        ];

        // Create nav HTML
        const navHTML = `
            <button class="side-nav-toggle" aria-label="Open navigation">☰</button>
            <nav class="side-nav">
                <div class="nav-brand">HyperMarket</div>
                <div class="nav-items">
                    ${navItems.map(item => this.createNavItem(item)).join('')}
                </div>
                <div class="nav-footer">
                    <div class="nav-item" id="logoutBtn">
                        <span class="nav-icon">🚪</span>
                        Logout
                    </div>
                </div>
            </nav>
        `;

        // Insert nav at the top of the body
        document.body.insertAdjacentHTML('afterbegin', navHTML);

        // Wrap main content for margin
        const mainContent = document.querySelector('main');
        if (mainContent && !mainContent.parentNode.classList.contains('side-nav-content-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'side-nav-content-wrapper';
            mainContent.parentNode.insertBefore(wrapper, mainContent);
            wrapper.appendChild(mainContent);
        }

        this.addEventListeners();
        this.setActiveNav();
    }

    createNavItem({ id, name, icon, href, external }) {
        const currentPage = window.location.pathname.split('/').pop();
        // Only mark as active if not external and matches current page
        const isActive = !external && currentPage === href;
        return `
            <a href="${href}" class="nav-item${isActive ? ' active' : ''}" data-nav-id="${id}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
                <span class="nav-icon">${icon}</span>
                ${name}
            </a>
        `;
    }

    addEventListeners() {
        // Toggle for mobile
        const nav = document.querySelector('.side-nav');
        const toggleBtn = document.querySelector('.side-nav-toggle');
        if (toggleBtn && nav) {
            toggleBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !toggleBtn.contains(e.target)) {
                    nav.classList.remove('active');
                }
            });
        }

        // Highlight active nav on click
        const navItems = document.querySelectorAll('.side-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Logout button (customize as needed)
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                // Redirect to index page
                window.location.href = 'index.html';
            });
        }
    }

    setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.side-nav .nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && href === currentPage) {
                item.classList.add('active');
            }
        });
    }
}

export default SideNavigation;
