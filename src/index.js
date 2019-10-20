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

const renderAnimatingBackground = () => {
  let html = '';
  for (var i = 1; i <= 50; i ++) {
      html += '<div class="shape-container--'+i+' shape-animation"><div class="random-shape"></div></div>';
  }
  document.querySelector('.shape').innerHTML += html;
}
renderAnimatingBackground();

  
const getQueryParams = (qs) => {
  qs = qs.split('+').join(' ');

  const params = {};
  let tokens;
  const re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}


console.log(getQueryParams(document.location.search));

