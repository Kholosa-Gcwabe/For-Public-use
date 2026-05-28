// FPU — For Public Use
// Creative Studio & Streetwear

// State management
const state = {
    bag: [],
    currentDesign: {
        product: 'beanie',
        color: 'mustard',
        colorName: 'Mustard Gold',
        placement: 'front',
        price: 400
    },
    progress: {
        current: 34,
        goal: 100
    }
};

// Product configurations
const productConfigs = {
    'trucker': {
        name: 'Trucker Cap',
        desc: 'Classic mesh back. Bold front hit.',
        price: 450,
        colors: [
            { code: 'gray-black', name: 'Gray/Black', hex: '#e8e8e8' },
            { code: 'forest', name: 'Forest Green', hex: '#1B4332' },
            { code: 'black', name: 'Stealth Black', hex: '#0a0a0a' }
        ]
    },
    'beanie': {
        name: 'Cuffed Beanie',
        desc: 'Embroidered fold. Premium knit.',
        price: 400,
        colors: [
            { code: 'mustard', name: 'Mustard Gold', hex: '#C9A227' },
            { code: 'forest', name: 'Forest Green', hex: '#1B4332' },
            { code: 'black', name: 'Stealth Black', hex: '#0a0a0a' }
        ]
    },
    'sweater': {
        name: 'Crewneck Sweater',
        desc: 'Heavyweight cotton. Big back print.',
        price: 850,
        colors: [
            { code: 'mustard', name: 'Mustard Gold', hex: '#C9A227' },
            { code: 'forest', name: 'Forest Green', hex: '#1B4332' },
            { code: 'black', name: 'Stealth Black', hex: '#0a0a0a' }
        ]
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHamburgerMenu();
    initWorkTabs();
    initStudio();
    initCapCards();
    initProgressBar();
    initBag();
    initQuoteForm();
});

// Navigation scroll behavior
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    document.querySelector('.nav-cart').addEventListener('click', openModal);
}

// Hamburger Menu
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', closeMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            closeMobileMenu();
            setTimeout(() => {
                scrollToSection(target.substring(1));
            }, 300);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Smooth scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Work Tabs Filtering
function initWorkTabs() {
    const tabs = document.querySelectorAll('.work-tab');
    const items = document.querySelectorAll('.work-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.tab;

            items.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Design Studio
function initStudio() {
    const productBtns = document.querySelectorAll('[data-product]');
    productBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            productBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const product = btn.dataset.product;
            state.currentDesign.product = product;
            state.currentDesign.price = productConfigs[product].price;

            updateColorOptions(product);
            updatePreview();
            updateAddToBagButton();
        });
    });

    document.getElementById('colorOptions').addEventListener('click', (e) => {
        if (e.target.classList.contains('color-btn')) {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            state.currentDesign.color = e.target.dataset.color;
            state.currentDesign.colorName = e.target.dataset.name;

            document.getElementById('colorName').textContent = e.target.dataset.name;
            updatePreview();
        }
    });

    const placementBtns = document.querySelectorAll('[data-placement]');
    placementBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            placementBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            state.currentDesign.placement = btn.dataset.placement;
            updateLogoPlacement();
        });
    });

    document.getElementById('addToBag').addEventListener('click', addToBag);
}

function updateColorOptions(product) {
    const container = document.getElementById('colorOptions');
    const colors = productConfigs[product].colors;

    container.innerHTML = colors.map((color, index) => `
        <button class="color-btn ${index === 0 ? 'active' : ''}" 
                style="background: ${color.hex};" 
                data-color="${color.code}" 
                data-name="${color.name}"></button>
    `).join('');

    state.currentDesign.color = colors[0].code;
    state.currentDesign.colorName = colors[0].name;
    document.getElementById('colorName').textContent = colors[0].name;
}

function updatePreview() {
    const config = productConfigs[state.currentDesign.product];

    document.getElementById('previewName').textContent = config.name;
    document.getElementById('previewDesc').textContent = config.desc;
    document.getElementById('previewPrice').textContent = 'R' + config.price;

    const silhouette = document.querySelector('.cap-silhouette');
    const colorHex = config.colors.find(c => c.code === state.currentDesign.color)?.hex || '#C9A227';
    silhouette.style.background = colorHex;
}

function updateLogoPlacement() {
    const placement = document.getElementById('logoPlacement');
    placement.className = 'logo-placement ' + state.currentDesign.placement;
}

function updateAddToBagButton() {
    const btn = document.getElementById('addToBag');
    btn.textContent = `Add to Bag — R${state.currentDesign.price}`;
}

// Cap cards click to studio
function initCapCards() {
    const cards = document.querySelectorAll('.work-item[data-category="clothing"]');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            scrollToSection('studio');
        });
    });
}

// Shopping bag
function initBag() {
    updateBagCount();
}

function addToBag() {
    const item = {
        id: Date.now(),
        ...state.currentDesign
    };

    state.bag.push(item);
    updateBagCount();

    const btn = document.getElementById('addToBag');
    const originalText = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.style.background = '#2d5a3d';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);

    setTimeout(() => {
        openModal();
    }, 500);
}

function updateBagCount() {
    const count = state.bag.length;
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });

    renderBagItems();
}

function renderBagItems() {
    const container = document.getElementById('bagItems');
    const totalEl = document.getElementById('bagTotal');

    if (state.bag.length === 0) {
        container.innerHTML = '<p class="empty-bag">Your bag is empty.</p>';
        totalEl.textContent = 'R0';
        return;
    }

    let total = 0;

    container.innerHTML = state.bag.map(item => {
        total += item.price;
        return `
            <div class="bag-item" style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #eee;">
                <div style="width: 60px; height: 60px; background: ${productConfigs[item.product].colors.find(c => c.code === item.color)?.hex || '#ccc'}; border-radius: 4px;"></div>
                <div style="flex: 1;">
                    <h4 style="font-size: 0.9rem; margin-bottom: 0.25rem;">${productConfigs[item.product].name}</h4>
                    <p style="font-size: 0.8rem; color: #888;">${item.colorName} / ${item.placement}</p>
                    <p style="font-size: 0.9rem; font-weight: 600;">R${item.price}</p>
                </div>
                <button onclick="removeFromBag(${item.id})" style="background: none; border: none; color: #999; cursor: pointer; font-size: 1.25rem;">×</button>
            </div>
        `;
    }).join('');

    totalEl.textContent = 'R' + total;
}

function removeFromBag(id) {
    state.bag = state.bag.filter(item => item.id !== id);
    updateBagCount();
}

// Modal functions
function openModal() {
    document.getElementById('bagModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('bagModal').classList.remove('active');
    document.body.style.overflow = '';
}

function openServiceForm(serviceType) {
    const modal = document.getElementById('serviceModal');
    const select = document.getElementById('serviceSelect');

    if (serviceType && select) {
        select.value = serviceType;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close modals on outside click
document.getElementById('bagModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

document.getElementById('serviceModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeServiceModal();
});

// Quote form
function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Quote request submitted! We will get back to you within 24 hours.');
            closeServiceModal();
            form.reset();
        });
    }
}

// Progress bar animation
function initProgressBar() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgress();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.progress-section'));
}

function animateProgress() {
    const fill = document.getElementById('progressFill');
    const currentEl = document.getElementById('currentOrders');

    setTimeout(() => {
        fill.style.width = '34%';
    }, 200);

    let current = 0;
    const target = 34;
    const increment = setInterval(() => {
        current++;
        currentEl.textContent = current;
        if (current >= target) {
            clearInterval(increment);
        }
    }, 50);
}

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');

    if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.4}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeServiceModal();
    }
});

// Scroll reveal animations
const revealElements = document.querySelectorAll('.overview-card, .work-item, .service-card, .section-header, .story-content, .process-step');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// Add fadeIn keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);