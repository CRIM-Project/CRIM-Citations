import * as Handlebars from 'handlebars';

let export_tpl = `
  <h2 class="mdl-dialog__title">Export relationships</h2>
  <div class="mdl-dialog__content">
    <strong style="display:none">Success!</strong>
    <p>Exporting will store your current work to the CRIM databse or to a file that you will be able to open and edit later.</p>
    <p>Your scores will remain open, but the relationships created will not be available until reloaded. Continue?</p>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn btn-primary mdl-button mdl-button--accent" id="expToDisk">Download JSON</button>
    <button type="button" class="btn btn-primary mdl-button mdl-button--attention" id="expToOmeka">Send to CRIM online</button>
    <button type="button" class="btn mdl-button close">Cancel</button>
  </div>
`

export default Handlebars.compile(export_tpl);
