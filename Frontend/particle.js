const container = document.querySelector(".particles");

function createParticle() {
    
  const particle = document.createElement("div");
  particle.classList.add("particle");

  // Random position
  particle.style.left = Math.random() * 100 + "vw";
  particle.style.top = Math.random() * 100 + "vh";

  // Random size
  const size = Math.random() * 6 + 3;
  particle.style.width = size + "px";
  particle.style.height = size + "px";

  container.appendChild(particle);

  // Remove after animation
  setTimeout(() => {
    particle.remove();
  }, 4000);
}

// Spawn particles continuously
setInterval(createParticle, 50);