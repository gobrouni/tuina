/* Data - The 10 Techniques */
// Techniques data is now loaded from data.js (generated from questions.md)

// Preset Exam Sets (15 Sets)
const examSets = [
    ["摩擦法", "推法", "拿法"],       // Set 1
    ["摩擦法", "按法", "拿法"],       // Set 2
    ["摩擦法", "揉法", "抖法"],       // Set 3
    ["摩擦法", "撥法", "抖法"],       // Set 4
    ["摩擦法", "推法", "搖法"],       // Set 5
    ["滾法", "推法", "拿法"],         // Set 6
    ["滾法", "按法", "拿法"],         // Set 7
    ["滾法", "揉法", "抖法"],         // Set 8
    ["滾法", "撥法", "搖法"],         // Set 9
    ["滾法", "按法", "搖法"],         // Set 10
    ["推法", "拿法", "拍擊法"],       // Set 11
    ["按法", "抖法", "拍擊法"],       // Set 12
    ["揉法", "抖法", "拍擊法"],       // Set 13
    ["撥法", "搖法", "拍擊法"],       // Set 14
    ["揉法", "搖法", "拍擊法"]        // Set 15
];

// DOM Elements
const viewIntro = document.getElementById('view-intro');
const viewResult = document.getElementById('view-result');
// const btnStart = document.getElementById('btn-start'); // Removed
const btnDraw = document.getElementById('btn-draw');
const btnBack = document.getElementById('btn-back');
const resultTitle = document.getElementById('result-title');
const cardSingle = document.getElementById('card-single');
const cardExam = document.getElementById('card-exam');
// const radioModes = document.getElementsByName('practice_mode'); // Not used for triggering anymore
const cardContainer = document.querySelector('.card-display');
const modalOverlay = document.getElementById('detail-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const modalTitle = document.getElementById('modal-title');
const modalEng = document.getElementById('modal-eng');
const modalDesc = document.getElementById('modal-desc');

// State
let currentMode = 'exam'; // 'single' or 'exam'

// Init
function init() {
    // Add event listeners
    // btnStart.addEventListener('click', startDraw); // Removed

    // Mode Card Click Listeners
    cardSingle.addEventListener('click', () => {
        currentMode = 'single';
        updateRadio('single');
        startDraw();
    });

    cardExam.addEventListener('click', () => {
        currentMode = 'exam';
        updateRadio('exam');
        startDraw();
    });

    btnDraw.addEventListener('click', draw);
    btnBack.addEventListener('click', showIntro);

    // Modal Listeners
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', hideModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) hideModal();
        });
    }

    // Reference Chips Listeners
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const name = chip.textContent.trim();
            const item = techniques.find(t => t.name === name);
            if (item) {
                showModal(item);
            }
        });
    });
}

// Helper: Sync hidden radio for visual state (if needed in future or for accessibility)
function updateRadio(value) {
    const radios = document.getElementsByName('practice_mode');
    radios.forEach(radio => {
        if (radio.value === value) radio.checked = true;
    });
}

// Logic: Switch to Result View and Draw
function startDraw() {
    // Title is now set within draw() to support set numbers
    draw();
    showResult();
}

// Logic: Draw Cards
function draw() {
    let selected = [];

    if (currentMode === 'single') {
        // Randomly select 1 item
        const shuffled = [...techniques].sort(() => 0.5 - Math.random());
        selected = shuffled.slice(0, 1);
        resultTitle.textContent = '單題練習模式';
    } else {
        // Exam Mode: Select from 15 preset sets
        const setIndex = Math.floor(Math.random() * examSets.length);
        const setNames = examSets[setIndex];

        // Find technique objects matching the names
        selected = setNames.map(name => {
            return techniques.find(t => t.name === name);
        });

        // Update Title with Set Number (1-based index)
        resultTitle.textContent = `模擬考模式 (第 ${setIndex + 1} 組)`;
    }

    renderCards(selected);
}

// Logic: Render Cards
function renderCards(items) {
    cardContainer.innerHTML = '';

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'technique-card'; // Default state

        // Add click listener to Open Modal
        card.addEventListener('click', function () {
            showModal(item);
        });

        // Dynamic HTML for Card
        card.innerHTML = `
            <div class="card-header-area">
                ${currentMode === 'exam' ? `<span class="badge">第 ${index + 1} 題</span>` : ''}
                <h3 class="card-title">${item.name}</h3>
            </div>
            
            <div class="reveal-hint">
                <span class="material-symbols-outlined" style="font-size: 1.25rem;">visibility</span>
                <span>查看詳細說明</span>
            </div>
        `;

        cardContainer.appendChild(card);
    });

    // Scroll to top of result view to ensure visibility
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Logic: View Switching
function showResult() {
    viewIntro.classList.add('hidden');
    viewResult.classList.remove('hidden');
}

function showIntro() {
    viewResult.classList.add('hidden');
    viewIntro.classList.remove('hidden');
    // Clear cards when going back? Optional, but cleaner.
    cardContainer.innerHTML = '';
}

// Logic: Modal Control
function showModal(item) {
    modalTitle.textContent = item.name;
    // modalEng.textContent = item.engName; // Removed

    // Check if details exist (backward compatibility, though we just updated all)
    if (item.details) {
        modalDesc.innerHTML = `
            <div class="detail-section">
                <h4>操作定義</h4>
                <ul>
                    ${item.details.definition.map(line => `<li>${line}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h4>操作要領</h4>
                <ul>
                    ${item.details.essentials.map(line => `<li>${line}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h4>適用部位</h4>
                <ul>
                    ${item.details.areas.map(line => `<li>${line}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h4>調理效果</h4>
                <ul>
                    ${item.details.effects.map(line => `<li>${line}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        // Fallback for simple description
        modalDesc.innerHTML = `<p>${item.desc}</p>`;
    }

    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function hideModal() {
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

// Run
document.addEventListener('DOMContentLoaded', init);
