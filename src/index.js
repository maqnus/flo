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
  for (var i = 1; i <= 50; i++) {
    html += '<div class="shape-container--' + i + ' shape-animation"><div class="random-shape"></div></div>';
  }
  const shape = document.querySelector('.shape');
  if (shape) {
    shape.innerHTML += html;
  }
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


const postData = async (url = '', data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

const startTimer = document.getElementById('startTimer');
const postStartTimer = async (event) => {
  event.preventDefault();
  try {
    const data = await postData('start-timer', {
      time: new Date()
    })
    console.log(JSON.stringify(data)); // JSON-string from `response.json()` call
  } catch (error) {
    console.error(error);
  }
}
if (startTimer) {
  startTimer.onclick = (event) => postStartTimer(event);
}

async function sendData(url, data) {
  const formData  = new FormData();

  for(const name in data) {
      formData.append(name, data[name]);
  }

  const response = await fetch(url, {
      method: 'POST',
      body: formData
  });

// ...
}