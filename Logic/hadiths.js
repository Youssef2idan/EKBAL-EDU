// Collection of motivational Hadiths related to knowledge and learning
const hadiths = [
    {
        text: "اطلبوا العلم من المهد إلى اللحد",
        reference: "Prophet Muhammad"
    },
    {
        text: "طلب العلم فريضة على كل مسلم",
        reference: "Prophet Muhammad"
    },
    {
        text: "من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة",
        reference: "Prophet Muhammad"
    },
    {
        text: "فضل العالم على العابد كفضل القمر ليلة البدر على سائر الكواكب",
        reference: "Prophet Muhammad"
    },
    {
        text: "إذا مات ابن آدم انقطع عمله إلا من ثلاث: صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له",
        reference: "Prophet Muhammad"
    },
    {
        text: "من يرد الله به خيراً يفقهه في الدين",
        reference: "Prophet Muhammad"
    },
    {
        text: "مداد العلماء أفضل من دماء الشهداء",
        reference: "Prophet Muhammad"
    },
    {
        text: "اطلبوا العلم ولو في الصين",
        reference: "Prophet Muhammad"
    },
    {
        text: "خيركم من تعلم القرآن وعلمه",
        reference: "Prophet Muhammad"
    },
    {
        text: "العلم خزائن ومفاتيحها السؤال",
        reference: "Prophet Muhammad"
    }
];

// Function to get a random Hadith
function getRandomHadith() {
    const randomIndex = Math.floor(Math.random() * hadiths.length);
    return hadiths[randomIndex];
}

// Function to update the Hadith display
function updateHadithDisplay() {
    const hadithElement = document.getElementById('hadith-text');
    const referenceElement = document.getElementById('hadith-reference');
    
    if (hadithElement && referenceElement) {
        const hadith = getRandomHadith();
        hadithElement.textContent = hadith.text;
        referenceElement.textContent = hadith.reference;
    }
}

// Initialize Hadith display when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    updateHadithDisplay();
}); 