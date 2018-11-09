import * as Handlebars from 'handlebars';

let export_tpl = `
  <h2 class="mdl-dialog__title">Export relationships</h2>
  <div class="mdl-dialog__content">
    <p id="expDialogText">Exporting will store your current work to the CRIM database. Downloading your analyses will save your work as a file that you can upload to resume later.</p>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn btn-info mdl-button mdl-button--attention" id="expToCRIMOnline">Send to CRIM online</button>
    <button type="button" class="btn btn-info mdl-button mdl-button--accent" id="expToDisk">Download analyses</button>
    <button type="button" class="btn mdl-button close">Close</button>
  </div>
`

export default Handlebars.compile(export_tpl);
