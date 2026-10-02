document.getElementById('form').addEventListener('submit',e=>{e.preventDefault();location.href='map.html?'+new URLSearchParams({branch:branch.value,division:division.value})})


// Hamburger menu toggle
const hamburgerBtn=document.getElementById('hamburgerBtn');
const hamburgerMenu=document.getElementById('hamburgerMenu');
hamburgerBtn.addEventListener('click',e=>{e.stopPropagation();hamburgerMenu.classList.toggle('open')});
document.addEventListener('click',e=>{if(!hamburgerMenu.contains(e.target)&&!hamburgerBtn.contains(e.target)){hamburgerMenu.classList.remove('open')}});
