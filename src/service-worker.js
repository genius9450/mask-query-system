self.addEventListener('install', (event) => {
  console.log('Version installing', event)
})

self.addEventListener('activate', (event) => {
  console.log('Version now ready to handle', event)
})

self.addEventListener("fetch", event => {  
  console.log('fetch', event.request)
})

self.addEventListener('load', () => {
  if (navigator.standalone) {
    console.log('Launched: Installed (iOS)')
  } else if (matchMedia('(display-mode: standalone)').matches) {
    console.log('Launched: Installed')
  } else {
    console.log('Launched: Browser Tab')
  }
})