import './style.css';

console.log("FLY SUBMARINE SYSTEM :: ONLINE");

const enterBtn = document.getElementById('enter-btn');
const root = document.querySelector(':root');

if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    enterBtn.innerHTML = "ACCESS GRANTED";
    enterBtn.style.color = "#00f3ff";
    enterBtn.style.background = "rgba(0, 243, 255, 0.1)";

    // Intense glitch effect on click
    document.body.style.filter = "contrast(1.5) brightness(1.2)";
    setTimeout(() => {
      document.body.style.filter = "contrast(1.0) brightness(1.0)";
      // Redirect or show content here
      window.location.href = "https://instagram.com/flysubmarine"; // Placeholder destination, user can configure
    }, 500);
  });
}
