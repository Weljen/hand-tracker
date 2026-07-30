import { startCamera, getVideo } from "./camera.js";

const canvas = document.getElementById("hud");
const ctx = canvas.getContext("2d");
const statusLabel = document.getElementById("cctvStatus");
const cctvTimestamp = document.getElementById("cctvTimestamp");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

function isVideoReady(video) {
    return video && video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA;
}

async function main() {
    try {
        await startCamera();
        statusLabel.innerHTML = "<span class=\"rec-dot\"></span>REC";
    } catch (error) {
        console.error(error);
        statusLabel.textContent = "CAMERA ERROR";
    }
}

main();

function updateClock() {
    const now = new Date();
    cctvTimestamp.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

function drawNoise() {
    const noiseDensity = 0.003;
    const count = Math.floor(canvas.width * canvas.height * noiseDensity);
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";

    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }
}

function drawScanLines() {
    ctx.fillStyle = "rgba(0, 255, 0, 0.05)";
    const lineHeight = 2;

    for (let y = 0; y < canvas.height; y += 34) {
        ctx.fillRect(0, y, canvas.width, lineHeight);
    }
}

function drawVignette() {
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.2,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.55
    );

    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.45)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVideo(video) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function animate() {
    requestAnimationFrame(animate);
    const video = getVideo();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isVideoReady(video)) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#7cfc00";
        ctx.font = "24px Consolas, monospace";
        ctx.fillText("Waiting for camera...", 40, 80);
        return;
    }

    drawVideo(video);
    drawVignette();
    drawScanLines();
    drawNoise();
}

animate();
