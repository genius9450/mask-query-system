window.addEventListener('install', (event) => {
  console.log('Version installing', event)
})

window.addEventListener('activate', (event) => {
  console.log('Version now ready to handle', event)
})

window.addEventListener("fetch", event => {  
  console.log('fetch', event.request)
})

window.addEventListener('load', () => {
  if (navigator.standalone) {
    console.log('Launched: Installed (iOS)')
  } else if (matchMedia('(display-mode: standalone)').matches) {
    console.log('Launched: Installed')
  } else {
    console.log('Launched: Browser Tab')
  }
})