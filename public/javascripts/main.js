

function toggle(ele){
  var target = document.getElementsByClassName(ele)[0];
  if (target.classList.contains('show')) {
    target.classList.remove('show');
    target.classList.add('hide');
  } else {
    target.classList.remove('hide');
    target.classList.add('show');
  }
  
}