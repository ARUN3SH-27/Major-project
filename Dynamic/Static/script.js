// Initialize particles.js for background
document.addEventListener('DOMContentLoaded', function() {
    // Load particles.js configuration
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#00cc00" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#00cc00", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }

    // Theme toggle
    document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
});

// Theme toggle with smooth transitions
function toggleTheme() {
    const body = document.body;
    const themes = ["dark-mode", "cyberpunk", "matrix", "hacker"];
    const currentTheme = themes.find(theme => body.classList.contains(theme));
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    
    // Add transition class for smooth change
    body.classList.add('theme-transition');
    
    // Remove all theme classes and add the next one
    body.classList.remove(...themes);
    body.classList.add(nextTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
        body.classList.remove('theme-transition');
    }, 500);
}