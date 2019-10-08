// function component() {
//     const element = document.createElement('div');
  
//     // Lodash, currently included via a script, is required for this line to work
//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
//     return element;
//   }
  
//   document.body.appendChild(component());
const countdownWrapper = document.querySelector('.countdown');
const countdownToggleButton = document.querySelector('.countdown-toggler');
const toggleOpenCountdown = () => {
  if (navigationWrapper.classList.contains('open')) {
    navigationWrapper.classList.remove("open");
  }
  countdownWrapper.classList.toggle("open");
}
if (countdownToggleButton) {
  countdownToggleButton.addEventListener('click', toggleOpenCountdown);
}

const navigationWrapper = document.querySelector('.main-nav');
const navigationToggleButton = document.querySelector('.nav-toggler');
const toggleOpenNavigation = () => {
  if (countdownWrapper.classList.contains('open')) {
    countdownWrapper.classList.remove("open");
  }
  navigationWrapper.classList.toggle("open");
}
if (navigationToggleButton) {
  navigationToggleButton.addEventListener('click', toggleOpenNavigation);
}