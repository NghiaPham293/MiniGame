const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin');
const resultPopup = document.getElementById('resultPopup');
const resultText = document.getElementById('resultText');
const continueButton = document.getElementById('continue');
const birthdayCard = document.getElementById('birthdayCard');
const birthdayMessage = document.getElementById('birthdayMessage');
const closeCardButton = document.getElementById('closeCard');
const winSound = document.getElementById('winSound');

const prizes = [
    '500.000 VND', 'Rước Vang', '200.000 VND', '1 bánh sinh nhật',
    '100.000 VND', 'Cho Ngờ Xí 500.000 VND', 'Chúc may mắn lần sau',
    '1 ly trà sữa', '1 thùng bia', '1 vé Đi Phù Quốc', 'Tôm không công 1 ngày'
];
const colors = [
    '#ff4040', // Đỏ
    '#ff7040', // Cam đậm
    '#ff9040', // Cam nhạt
    '#f0e050', // Vàng nhạt
    '#c0f0c0', // Xanh nhạt
    '#80d0c0', // Xanh lam nhạt
    '#40b0c0', // Xanh lam
    '#4080c0', // Xanh đậm
    '#ff1493', // Hồng
    '#ff69b4', // Hồng nhạt
    '#ff4500'  // Cam đỏ
];
const totalSlices = prizes.length;
const sliceAngle = (2 * Math.PI) / totalSlices;

let currentAngle = 0;
let spinning = false;
let selectedPrize = '';

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    // Vẽ các ô phần thưởng
    for (let i = 0; i < totalSlices; i++) {
        const startAngle = sliceAngle * i + currentAngle;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Thêm văn bản phần thưởng
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'right';
        // Xoay văn bản để hiển thị dọc theo ô
        ctx.rotate(Math.PI / 2);
        ctx.fillText(prizes[i], 10, -radius + 30);
        ctx.restore();
    }

    // Vẽ vòng tròn trung tâm
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Thêm chữ "QUAY" ở trung tâm
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('QUAY', centerX, centerY);
}

function spinWheel() {
    if (spinning) return;
    spinning = true;
    spinButton.style.display = 'none';
    resultPopup.classList.add('hidden');
    birthdayCard.classList.add('hidden');

    const spinAngle = Math.floor(Math.random() * 360) + 720;
    let spinTime = 0;
    const spinDuration = 4000;

    function animate() {
        spinTime += 30;
        currentAngle += (spinAngle * 30) / spinDuration;
        drawWheel();

        if (spinTime < spinDuration) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            showResult();
        }
    }
    requestAnimationFrame(animate);
}

function showResult() {
    const angle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const prizeIndex = Math.floor((2 * Math.PI - angle) / sliceAngle) % totalSlices;
    selectedPrize = prizes[prizeIndex];
    resultText.textContent = `Bạn đã trúng: ${selectedPrize}`;
    resultPopup.classList.remove('hidden');
    if (selectedPrize !== 'Chúc may mắn lần sau') {
        winSound.play();
    }
}

function showBirthdayCard() {
    resultPopup.classList.add('hidden');
    birthdayMessage.textContent = `Chúc mừng sinh nhật! 🎂🎉\nBạn đã nhận được: ${selectedPrize}`;
    birthdayCard.classList.remove('hidden');
}

function closeCard() {
    birthdayCard.classList.add('hidden');
    spinButton.style.display = 'block';
}

drawWheel();
spinButton.addEventListener('click', spinWheel);
continueButton.addEventListener('click', showBirthdayCard);
closeCardButton.addEventListener('click', closeCard);