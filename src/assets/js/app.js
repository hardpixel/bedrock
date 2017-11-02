import $ from 'jquery';
import whatInput from 'what-input';

window.$ = $;

import Foundation from 'foundation-sites';
import { OffCanvasMenu } from './components/offcanvasMenu';
import { TextEditor } from './components/textEditor';

Foundation.plugin(OffCanvasMenu, 'OffCanvasMenu');
Foundation.plugin(TextEditor, 'TextEditor');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).foundation();
