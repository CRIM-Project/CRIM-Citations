import * as Handlebars from 'handlebars';

let import_tpl = `
  <h2 class="mdl-dialog__title">Import analyses</h2>
  <div class="mdl-dialog__content">
    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
      <div class="mdl-tabs__panel is-active" id="local-panel">
        <div class="form-horizontal mdl-textfield mdl-js-textfield mdl-textfield--file">
          <button id="uploadUi" class="btn btn-info" onclick="document.getElementById('uploadBtn').click();">Select file</button>
          <input id="uploadBtn" type="file" name="analyses" class="inputfile" accept=".json" onchange="document.getElementById('uploadFilename').innerHTML = document.getElementById('uploadBtn').files[0].name;" />
          <p id="uploadFilename"></p>
        </div>
      </div>
    </div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn btn-primary mdl-button" id="doImport">Import</button>
    <button type="button" class="btn mdl-button close">Close</button>
  </div>
`

export default Handlebars.compile(import_tpl);
