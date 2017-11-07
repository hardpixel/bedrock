import $ from 'jquery';
import whatInput from 'what-input';

window.$ = $;

import Foundation from 'foundation-sites';
import { OffCanvasMenu } from './components/offcanvasMenu';
import { TinyMceEditor } from './components/tinyMceEditor';
import { TableCheckbox } from './components/tableCheckbox';

Foundation.plugin(OffCanvasMenu, 'OffCanvasMenu');
Foundation.plugin(TinyMceEditor, 'TinyMceEditor');
Foundation.plugin(TableCheckbox, 'TableCheckbox');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).foundation();
