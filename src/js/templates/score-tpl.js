import * as Handlebars from 'handlebars';

let pag_tpl = `
<div class="score_header">
  <div class="mdl-layout__header-row">
    <button class="btn btn-danger close_score_button">
      <i class="material-icons">close</i>
    </button>
    <button onclick="toggleExpandCollapse(event)" class="btn collapse_expand_button">
      Collapse
    </button>
    <span class="mdl-layout-title">{{title}}</span>
    <div class="mdl-layout-spacer"></div>
    <nav class="mdl-navigation">
      <button class="btn btn-active show-score-relationship" style="display:none">
        Show relationship
      </button>
      <button class="btn show-score-observations">
        Show observations
      </button>
      <div class="score_pagination">
        <button class="btn prevPage">
          <i class="material-icons">navigate_before</i>
        </button>
        <button class="btn nextPage">
          <i class="material-icons">navigate_next</i>
        </button>
      </div>
    </nav>
  </div>
</div>
<div class="score"></div>

<script>
  function toggleExpandCollapse(event) {
    if (event.target.innerHTML == "Expand") {
      event.target.innerHTML = "Collapse";
    }
    else {
      event.target.innerHTML = "Expand";
    }
  }
</script>
`

export default Handlebars.compile(pag_tpl);
