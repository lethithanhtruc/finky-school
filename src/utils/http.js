export function downloadLink(href) {
  var element = document.createElement('a');
  element.setAttribute('href', href);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}