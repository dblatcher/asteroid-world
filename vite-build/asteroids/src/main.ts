import './style.css'
// import { init, addHtmlTemplate } from './asteroids'
// import { init, addHtmlTemplate } from './trireme'
import { init, addHtmlTemplate } from './explorer'

addHtmlTemplate()
window.addEventListener('load', init, { once: true });
