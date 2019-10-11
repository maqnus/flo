import io from 'socket.io-client';
import { getCookie, getSession } from './utils.js'; 

const socket = io();

socket.on('redirect', destination => { window.location.href = destination; });

const sid = getSession('gf_sid');
if (!sid) {
  socket.emit('set_sid', {});
} else {
  console.log('sid:', sid);
}
socket.on('set_sid', d => sessionStorage.setItem('gf_sid', d));

const uid = getCookie('gf_uid');
if (uid) { socket.emit('getUserData', { uid }); }

socket.on('rm_sid', d => sessionStorage.removeItem('gf_sid', d));

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

