import './style.css'
// import { init, addHtmlTemplate } from './asteroids'
import { init, addHtmlTemplate } from './trireme'

addHtmlTemplate()
window.addEventListener('load', init, { once: true });
