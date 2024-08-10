"use strict";
let isPlayAudio = false;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
window.addEventListener("resize", () => {
    updateCanvasSize();
});
window.addEventListener("click", (e) => {
    // 判断是否点击右上角
    if (e.clientX > canvas.width - 100 && e.clientY < 100) {
        for (let i = 0; i < 10; i++) {
            createFirework();
        }
    }
    if (!isPlayAudio) {
        isPlayAudio = true;
        const audio = new Audio("./audio/qixi.mp3");
        audio.loop = true;
        audio.play();
    }
});
function updateCanvasSize() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
}
updateCanvasSize();
// 绘制七夕主题
function drawQixi() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// 星星类
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random();
        this.flickerInterval = Math.random() * 1000 + 500; // 闪烁间隔
        this.flickerTimer = 0;
        this.flickerState = 1; // 闪烁状态，1为亮，0为暗
    }
    update(elapsed) {
        this.flickerTimer += elapsed;
        if (this.flickerTimer >= this.flickerInterval) {
            this.flickerTimer = 0;
            this.flickerState = this.flickerState === 1 ? 0 : 1;
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * this.flickerState;
        ctx.beginPath();
        this.drawStar(this.x, this.y, 5, this.size, this.size / 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();
    }
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }
}
const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push(new Star());
}
// 绘制星空背景
function drawStars(elapsed) {
    stars.forEach(star => {
        star.update(elapsed);
        star.draw();
    });
}
// 烟花粒子
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 1;
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
        this.color = color;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // 重力效果
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
// 烟花
class Firework {
    constructor(x, y) {
        this.particles = [];
        this.moveCount = 0;
        this.maxMoveCount = 0;
        this.isFixedColor = true;
        this.x = x;
        this.y = y;
        this.particles = [];
        if (Math.random() < 0.1) {
            this.isFixedColor = false;
        }
        this.color = `hsl(${Math.floor(Math.random() * 361)}, 100%, 50%)`;
        this.maxMoveCount = Math.floor(Math.random() * 50) + 150;
    }
    update() {
        if (this.moveCount < this.maxMoveCount) {
            this.y -= 3;
            ctx.beginPath();
            ctx.rect(this.x, this.y, 2, 50);
            ctx.fillStyle = this.color;
            ctx.fill();
            this.moveCount++;
            if (this.moveCount >= this.maxMoveCount) {
                for (let i = 0; i < 100; i++) {
                    let color = this.color;
                    if (!this.isFixedColor) {
                        color = `hsl(${Math.floor(Math.random() * 361)}, 100%, 50%)`;
                    }
                    this.particles.push(new Particle(this.x, this.y, color));
                }
                setTimeout(() => {
                    fireworks.splice(fireworks.indexOf(this), 1);
                }, 3000);
            }
        }
        else {
            this.particles.forEach(p => p.update());
        }
    }
    draw() {
        this.particles.forEach(p => p.draw());
    }
}
let fireworks = [];
function createFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    fireworks.push(new Firework(x, y));
}
let time = performance.now();
let lastTime = 0;
let createFireworkTime = 0;
let maxCreateFireworkTime = 1000;
let textOpacity = 1;
let textOpacityAdd = 0.005;
let isAddOpacity = false;
let textColor = { r: 255, g: 255, b: 255 };
let textTargetColor = { r: 255, g: 255, b: 255 };
let updateTextColorTime = 0;
let maxUpdateTextColorTime = 3000;
function animate() {
    time = performance.now();
    const elapsed = time - lastTime;
    lastTime = time;
    updateTextColorTime += elapsed;
    if (updateTextColorTime >= maxUpdateTextColorTime) {
        updateTextColorTime = 0;
        const rgb = hslToRgb(Math.floor(Math.random() * 361), 100, 50);
        textTargetColor.r = rgb.r;
        textTargetColor.g = rgb.g;
        textTargetColor.b = rgb.b;
    }
    createFireworkTime += elapsed;
    if (createFireworkTime >= maxCreateFireworkTime) {
        createFireworkTime = 0;
        createFirework();
        maxCreateFireworkTime = Math.floor(Math.random() * 1000) + 1000;
    }
    drawStars(elapsed);
    if (isAddOpacity && textOpacity > 1) {
        isAddOpacity = false;
    }
    else {
        if (!isAddOpacity && textOpacity < 0.3) {
            isAddOpacity = true;
        }
    }
    if (isAddOpacity) {
        textOpacity += textOpacityAdd;
    }
    else {
        textOpacity -= textOpacityAdd;
    }
    ctx.font = "28px Arial";
    textColor.r = Math.floor(lerp(textColor.r, textTargetColor.r, 0.01));
    textColor.g = Math.floor(lerp(textColor.g, textTargetColor.g, 0.01));
    textColor.b = Math.floor(lerp(textColor.b, textTargetColor.b, 0.01));
    ctx.fillStyle = `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textOpacity})`;
    ctx.textAlign = "center";
    ctx.fillText("祝大家七夕快乐", canvas.width / 2, 48);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const firework of fireworks) {
        firework.update();
        firework.draw();
    }
    requestAnimationFrame(animate);
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function hslToRgb(h, s, l) {
    // 将饱和度和亮度转换为0-1的范围
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    // 将RGB值转换回0-255的范围并四舍五入
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return { r, g, b };
}
drawQixi();
animate();
