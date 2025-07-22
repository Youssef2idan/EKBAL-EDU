const duasByFeeling = {
    stress: [
        "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والبخل والجبن، وضلع الدين وغلبة الرجال.",
        "اللهم إني أسألك راحة في البال وطمأنينة في القلب." 
    ],
    anxiety: [
        "اللهم إني أعوذ بك من قلب لا يخشع، ودعاء لا يُسمع، ونفس لا تشبع، وعلم لا ينفع.",
        "اللهم إني أعوذ بك من زوال نعمتك وتحول عافيتك وفجاءة نقمتك وجميع سخطك."
    ],
    fear: [
        "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.",
        "اللهم اكفنيهم بما شئت وكيف شئت إنك على ما تشاء قدير."
    ],
    confusion: [
        "اللهم اختر لي ولا تخيرني، وارضني بما قسمت لي.",
        "اللهم إني استخيرك بعلمك واستقدرك بقدرتك واسالك من فضلك العظيم."
    ]
};

const feelingsGrid = document.getElementById('hadith-feelings-grid');
const duaCardContainer = document.querySelector('.hadith-card-container');
const duaText = document.querySelector('.hadith-text');
const anotherDuaBtn = document.querySelector('.another-hadith-btn');
const duaLabel = document.querySelector('.hadith-label');

let currentFeeling = null;
let lastDuaIndex = null;

const feelingNames = {
    stress: 'الضغط',
    anxiety: 'القلق',
    fear: 'الخوف',
    confusion: 'الحيرة'
};

function getRandomDua(feeling) {
    const duas = duasByFeeling[feeling];
    if (!duas) return '';
    let idx;
    do {
        idx = Math.floor(Math.random() * duas.length);
    } while (duas.length > 1 && idx === lastDuaIndex);
    lastDuaIndex = idx;
    return duas[idx];
}

feelingsGrid.addEventListener('click', function(e) {
    let btn = e.target.closest('.feeling-btn');
    if (btn) {
        currentFeeling = btn.getAttribute('data-feeling');
        duaCardContainer.style.display = 'flex';
        duaText.textContent = getRandomDua(currentFeeling);
        duaLabel.textContent = 'دعاء عن ' + (feelingNames[currentFeeling] || '');
    }
});

anotherDuaBtn.addEventListener('click', function() {
    if (currentFeeling) {
        duaText.textContent = getRandomDua(currentFeeling);
        duaLabel.textContent = 'دعاء عن ' + (feelingNames[currentFeeling] || '');
    }
}); 