const audio = document.getElementById("bg-audio"),
  audioToggle = document.getElementById("audio-toggle");
let audioPlaying = false;
document.addEventListener(
  "click",
  function s() {
    audio
      .play()
      .then(() => {
        audioPlaying = true;
        audioToggle.textContent = "🔊";
      })
      .catch(() => {});
  },
  { once: true },
);
audioToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  audioPlaying
    ? (audio.pause(), (audioToggle.textContent = "🔇"), (audioPlaying = false))
    : (audio.play(), (audioToggle.textContent = "🔊"), (audioPlaying = true));
});
window.addEventListener("load", () =>
  setTimeout(
    () => document.getElementById("loader").classList.add("hidden"),
    1500,
  ),
);
const canvas = document.getElementById("pet-canvas"),
  ctx = canvas.getContext("2d");
let health = 80,
  hunger = 50,
  happy = 70,
  energy = 90,
  petState = "idle",
  time = 0;
const moods = [
  "😊 Happy",
  "😐 Neutral",
  "😢 Sad",
  "😴 Sleepy",
  "🤢 Sick",
  "💀 Critical",
];
function clamp(v) {
  return Math.max(0, Math.min(100, v));
}
function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * 8, y * 8, 8, 8);
}
const petColors = { body: "#2C3A00", eye: "#000", cheek: "#E63946" };
function drawPet() {
  ctx.clearRect(0, 0, 400, 400);
  ctx.fillStyle = "#C0D840";
  ctx.fillRect(0, 0, 400, 400);
  const bounce = Math.sin(time * 0.1) * 2;
  const blink = Math.sin(time * 0.05) > 0.95;
  const cx = 25,
    cy = 22 + bounce;
  for (let dx = -3; dx <= 3; dx++)
    for (let dy = -4; dy <= 4; dy++) {
      const dist = Math.sqrt(dx * dx + dy * dy * 0.7);
      if (dist < 4) drawPixel(cx + dx, cy + dy, petColors.body);
    }
  if (!blink) {
    drawPixel(cx - 1, cy - 1, "#fff");
    drawPixel(cx + 1, cy - 1, "#fff");
    drawPixel(cx - 1, cy, "#000");
    drawPixel(cx + 1, cy, "#000");
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect((cx - 1) * 8, cy * 8, 8, 2);
    ctx.fillRect((cx + 1) * 8, cy * 8, 8, 2);
  }
  if (happy > 50) {
    drawPixel(cx - 2, cy + 1, petColors.cheek);
    drawPixel(cx + 2, cy + 1, petColors.cheek);
    ctx.fillStyle = "#000";
    ctx.fillRect((cx - 1) * 8, (cy + 2) * 8, 24, 3);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect((cx - 1) * 8, (cy + 2) * 8, 24, 2);
  }
  if (petState === "eating") {
    drawPixel(cx, cy + 3, "#E63946");
    drawPixel(cx + 1, cy + 3, "#FFD700");
  }
  if (petState === "playing") {
    for (let i = 0; i < 3; i++) {
      const sx = cx + Math.sin(time * 0.2 + i * 2) * 5;
      const sy = cy - 6 + Math.cos(time * 0.15 + i) * 3;
      drawPixel(Math.round(sx), Math.round(sy), "#FFD700");
    }
  }
  if (petState === "sleeping") {
    ctx.fillStyle = "#2C3A00";
    ctx.font = "24px Press Start 2P";
    ctx.fillText("z", cx * 8 + 40, cy * 8 - 20 + Math.sin(time * 0.05) * 5);
    ctx.font = "16px Press Start 2P";
    ctx.fillText(
      "z",
      cx * 8 + 60,
      (cy - 3) * 8 + Math.sin(time * 0.05 + 1) * 5,
    );
  }
  if (energy < 20) {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, 0, 400, 400);
  }
  for (let i = 0; i < 5; i++) {
    const gx = Math.sin(time * 0.02 + i * 1.5) * 15 + 25;
    const gy = 42 + Math.sin(time * 0.01 + i) * 2;
    drawPixel(Math.round(gx), gy, "#6B8E23");
  }
  ctx.fillStyle = "#6B8E23";
  ctx.fillRect(0, 44 * 8, 400, 56);
}
function updateStats() {
  hunger = clamp(hunger - 0.02);
  energy = clamp(energy - 0.01);
  if (hunger < 20) health = clamp(health - 0.05);
  if (energy < 10) happy = clamp(happy - 0.03);
  health = clamp(health);
  happy = clamp(happy);
  document.getElementById("health-bar").style.width = health + "%";
  document.getElementById("health-val").textContent = Math.round(health);
  document.getElementById("hunger-bar").style.width = hunger + "%";
  document.getElementById("hunger-val").textContent = Math.round(hunger);
  document.getElementById("happy-bar").style.width = happy + "%";
  document.getElementById("happy-val").textContent = Math.round(happy);
  document.getElementById("energy-bar").style.width = energy + "%";
  document.getElementById("energy-val").textContent = Math.round(energy);
  let mood = 0;
  const avg = (health + hunger + happy + energy) / 4;
  if (avg > 70) mood = 0;
  else if (avg > 50) mood = 1;
  else if (avg > 30) mood = 2;
  else if (energy < 20) mood = 3;
  else if (health < 20) mood = 4;
  else mood = 5;
  document.getElementById("pet-mood").textContent = "Mood: " + moods[mood];
}
function animate() {
  requestAnimationFrame(animate);
  time++;
  drawPet();
  if (time % 60 === 0) updateStats();
  if (petState !== "idle" && time % 120 === 0) petState = "idle";
}
animate();
function doAction(state, fn) {
  petState = state;
  fn();
  updateStats();
  setTimeout(() => (petState = "idle"), 2000);
}
document.getElementById("feed-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  doAction("eating", () => {
    hunger = clamp(hunger + 25);
    energy = clamp(energy + 5);
  });
});
document.getElementById("play-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  doAction("playing", () => {
    happy = clamp(happy + 20);
    hunger = clamp(hunger - 10);
    energy = clamp(energy - 15);
  });
});
document.getElementById("sleep-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  doAction("sleeping", () => {
    energy = clamp(energy + 40);
    health = clamp(health + 10);
  });
});
document.getElementById("clean-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  doAction("idle", () => {
    health = clamp(health + 15);
    happy = clamp(happy + 5);
  });
});
document.getElementById("pet-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  doAction("idle", () => {
    happy = clamp(happy + 15);
  });
});
