import * as Handlebars from 'handlebars';

let score_observation_tpl = `
  <h2 class="mdl-dialog__title">Editing observation</h2>
  <button class="btn">
    Hide
  </button>
  <div class="mdl-dialog__content">
    <div class="observ_score">{{title}}</div>
    <div class="observ_ema">{{ema}}</div>
    <h3>Musical type</h3>
    <p>
      <div class="mdl-shadow--2dp types">
        <label for="mt-cf" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-cf" class="inline mdl-checkbox__input cb" {{#if types.mt-cf}}checked{{/if}}>
          <span class="mdl-checkbox__label">Cantus Firmus</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="inline select_label" for="mt-cf-voice">Voice:</label>
            <span class="group">
              <select class="dialog_select" name="mt-cf-voice" id="mt-cf-voice">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-cf-dur">
            <input type="checkbox" id="mt-cf-dur" class="inline mdl-checkbox__input" {{#if types.mt-cf.dur}}checked{{/if}} {{#unless types.mt-cf}}checked disabled{{/unless}}>
            <span class="mdl-checkbox__label">Rhythmic durations</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-cf-mel">
            <input type="checkbox" id="mt-cf-mel" class="inline mdl-checkbox__input" {{#if types.mt-cf.mel}}checked{{/if}} {{#unless types.mt-cf}}checked disabled{{/unless}}>
            <span class="mdl-checkbox__label">Melodic intervals</span>
          </label>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-sog" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-sog" class="inline mdl-checkbox__input cb" {{#if types.mt-sog}}checked{{/if}}>
          <span class="mdl-checkbox__label">Soggetto</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-sog-voice1">Voice</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-sog-voice1" id="mt-sog-voice1">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <div data-for="mt-sog">
            <button class="addVoice btn btn-primary" {{#unless types.mt-fg}}disabled{{/unless}}>
              <i class="material-icons">add</i>
            </button>
          </div>
          <div>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-sog-dur">
              <input type="checkbox" id="mt-sog-dur" class="inline mdl-checkbox__input" {{#if types.mt-sog.dur}}checked{{/if}} {{#unless types.mt-sog}}checked disabled{{/unless}}>
              <span class="mdl-checkbox__label">Rhythmic durations</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-sog-mel">
              <input type="checkbox" id="mt-sog-mel" class="inline mdl-checkbox__input" {{#if types.mt-sog.mel}}checked{{/if}} {{#unless types.mt-sog}}checked disabled{{/unless}}>
              <span class="mdl-checkbox__label">Melodic intervals</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-sog-ost">
              <input type="checkbox" id="mt-sog-ost" class="inline mdl-checkbox__input" {{#if types.mt-sog.ost}}checked{{/if}} {{#unless types.mt-sog}}disabled{{/unless}}>
              <span class="mdl-checkbox__label">Ostinato repetition</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-sog-per">
              <input type="checkbox" id="mt-sog-per" class="inline mdl-checkbox__input" {{#if types.mt-sog.per}}checked{{/if}} {{#unless types.mt-sog}}disabled{{/unless}}>
              <span class="mdl-checkbox__label">Periodic phrasing</span>
            </label>
          </div>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-csog" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-csog" class="inline mdl-checkbox__input cb" {{#if types.mt-csog}}checked{{/if}}>
          <span class="mdl-checkbox__label">Counter Soggetto</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-csog-voice">Voice</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-csog-voice" id="mt-csog-voice">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-csog-dur">
            <input type="checkbox" id="mt-csog-dur" class="inline mdl-checkbox__input" {{#if types.mt-csog.dur}}checked{{/if}} {{#unless types.mt-csog}}checked disabled{{/unless}}>
            <span class="mdl-checkbox__label">Rhythmic durations</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-cs-mel">
            <input type="checkbox" id="mt-csog-mel" class="inline mdl-checkbox__input" {{#if types.mt-csog.mel}}checked{{/if}} {{#unless types.mt-csog}}checked disabled{{/unless}}>
            <span class="mdl-checkbox__label">Melodic intervals</span>
          </label>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-cd" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-cd" class="inline mdl-checkbox__input cb" {{#if types.mt-cd}}checked{{/if}}>
          <span class="mdl-checkbox__label">Contrapuntal Duo</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-cd-voice1">Voice pairs</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-cd-voice1" id="mt-cd-voice1">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
              <select class="dialog_select" name="mt-cd-voice2" id="mt-cd-voice2">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-fg" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-fg" class="inline mdl-checkbox__input cb" {{#if types.mt-fg}}checked{{/if}}>
          <span class="mdl-checkbox__label">Fuga</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-fg-voice1">Voice</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-fg-voice1" id="mt-fg-voice1">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <div data-for="mt-fg">
            <button class="addVoice btn btn-primary" {{#unless types.mt-fg}}disabled{{/unless}}>
              <i class="material-icons">add</i>
            </button>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="(\\d{1,2}[\+-]){1,}" id="mt-fg-int" {{#unless types.mt-fg}}disabled{{/unless}} {{#if types.mt-fg}}value="{{types.mt-fg.int}}"{{/if}}>
            <label class="mdl-textfield__label" for="mt-fg-int">Intervals of imitative entries...</label>
            <span class="mdl-textfield__error">Input is not a series of intervals!</span>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="[LBSM]((\\d{1,2}\\/(?!$))+|\\d{1,2})+" id="mt-fg-tint" {{#unless types.mt-fg}}disabled{{/unless}} {{#if types.mt-fg}}value="{{types.mt-fg.tint}}"{{/if}}>
            <label class="mdl-textfield__label" for="mt-fg-tint">Time interval of entries...</label>
            <span class="mdl-textfield__error">Input is not a series of time intervals!</span>
          </div>
          <div>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect for="mt-fg-pe">
              <input type="radio" name="mt-fg-options" id="mt-fg-pe" class="inline mdl-radio__button" {{#unless types.mt-fg}}disabled{{/unless}} {{#if types.mt-fg.pe}}checked{{/if}}>
              <span class="mdl-radio__label">Periodic entries</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-fg-ste">
              <input type="radio" name="mt-fg-options" id="mt-fg-ste" class="inline mdl-radio__button" {{#unless types.mt-fg}}disabled{{/unless}} {{#if types.mt-fg.ste}}checked{{/if}}>
              <span class="mdl-radio__label">Strict entries</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-fg-fe">
              <input type="radio" name="mt-fg-options" id="mt-fg-fe" class="inline mdl-radio__button" {{#unless types.mt-fg}}disabled{{/unless}} {{#if types.mt-fg.fe}}checked{{/if}}>
              <span class="mdl-radio__label">Flexed entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-fg-se">
              <input type="checkbox" id="mt-fg-se" class="inline mdl-checkbox__input" {{#unless types.mt-fg}}disabled{{/unless}} {{#if types.mt-fg.se}}checked{{/if}}>
              <span class="mdl-checkbox__label">Sequential entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-fg-ie">
              <input type="checkbox" id="mt-fg-ie" class="inline mdl-checkbox__input" {{#unless types.mt-fg}}disabled{{/unless}} {{#if types.mt-fg.ie}}checked{{/if}}>
              <span class="mdl-checkbox__label">Inverted entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-fg-re">
              <input type="checkbox" id="mt-fg-re" class="inline mdl-checkbox__input" {{#unless types.mt-fg}}disabled{{/unless}} {{#if types.mt-fg.re}}checked{{/if}}>
              <span class="mdl-checkbox__label">Retrograde entries</span>
            </label>
          </div>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-id" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-id" class="inline mdl-checkbox__input cb" {{#if types.mt-id}}checked{{/if}}>
          <span class="mdl-checkbox__label">Imitative Duos</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-id-voice1">Voice pairs</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-id-voice1" id="mt-id-voice1">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
              <select class="dialog_select" name="mt-id-voice2" id="mt-id-voice2">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <div data-pair="true" data-for="mt-id">
            <button class="addVoice btn btn-primary" {{#unless types.mt-id}}disabled{{/unless}}>
              <i class="material-icons">add</i>
            </button>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="(\\d{1,2}[\+-]){1,}" id="mt-id-int" {{#if types.mt-id.int}}value="{{types.mt-id.int}}"{{/if}} {{#unless types.mt-id}}disabled{{/unless}}>
            <label class="mdl-textfield__label" for="mt-id-int">Intervals of imitative entries...</label>
            <span class="mdl-textfield__error">Input is not a series of intervals!</span>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="[LBSM]((\\d{1,2}\\/(?!$))+|\\d{1,2})+" id="mt-id-tint" {{#if types.mt-id.tint}}value="{{types.mt-id.tint}}"{{/if}} {{#unless types.mt-id}}disabled{{/unless}}>
            <label class="mdl-textfield__label" for="mt-id-tint">Time interval of entries...</label>
            <span class="mdl-textfield__error">Input is not a series of time intervals!</span>
          </div>
          <div>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-id-ste">
              <input type="radio" name="mt-id-options" id="mt-id-ste" class="inline mdl-radio__button" {{#if types.mt-id.ste}}checked{{/if}} {{#unless types.mt-id}}disabled{{/unless}}>
              <span class="mdl-radio__label">Strict entries</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-id-fe">
              <input type="radio" name="mt-id-options" id="mt-id-fe" class="inline mdl-radio__button" {{#if types.mt-id.fe}}checked{{/if}} {{#unless types.mt-id}}disabled{{/unless}}>
              <span class="mdl-radio__label">Flexed entries</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-id-fte">
              <input type="radio" name="mt-id-options" id="mt-id-fte" class="inline mdl-radio__button" {{#if types.mt-id.fte}}checked{{/if}} {{#unless types.mt-id}}disabled{{/unless}}>
              <span class="mdl-radio__label">Flexed tonal entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-id-ic">
              <input type="checkbox" id="mt-id-ic" class="inline mdl-checkbox__input" {{#if types.mt-id.ic}}checked{{/if}} {{#unless types.mt-id}}disabled{{/unless}}>
              <span class="mdl-checkbox__label">Invertible counterpoint</span>
            </label>
          </div>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-pe" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-pe" class="inline mdl-checkbox__input cb" {{#if types.mt-pe}}checked{{/if}}>
          <span class="mdl-checkbox__label">Periodic Entries</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-pe-voice1">Voice</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-pe-voice1" id="mt-pe-voice1">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <div data-for="mt-pe">
            <button class="addVoice btn btn-primary" {{#unless types.mt-pe}}disabled{{/unless}}>
              <i class="material-icons">add</i>
            </button>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="(\\d{1,2}[\+-]){1,}" id="mt-pe-int" {{#if types.mt-pe.int}}value="{{types.mt-pe.int}}"{{/if}} {{#unless types.mt-pe}}disable{{/unless}}>
            <label class="mdl-textfield__label" for="mt-pe-int">Intervals of imitative entries...</label>
            <span class="mdl-textfield__error">Input is not a series of intervals!</span>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="[LBSM]((\\d{1,2}\\/(?!$))+|\\d{1,2})+" id="mt-pe-tint" {{#if types.mt-pe.tint}}value="{{types.mt-pe.tint}}"{{/if}} {{#unless types.mt-pe}}disable{{/unless}}>
            <label class="mdl-textfield__label" for="mt-pe-tint">Time interval of entries...</label>
            <span class="mdl-textfield__error">Input is not a series of time intervals!</span>
          </div>
          <div>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-pe-ste">
              <input type="radio" name="mt-pe-options" id="mt-pe-ste" class="inline mdl-radio__button" {{#if types.mt-pe.ste}}checked{{/if}} {{#unless types.mt-pe}}disable{{/unless}}>
              <span class="mdl-radio__label">Strict entries</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-pe-fe">
              <input type="radio" name="mt-pe-options" id="mt-pe-fe" class="inline mdl-radio__button" {{#if types.mt-pe.fe}}checked{{/if}} {{#unless types.mt-pe}}disable{{/unless}}>
              <span class="mdl-radio__label">Flexed entries</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-pe-fte">
              <input type="radio" name="mt-pe-options" id="mt-pe-fte" class="inline mdl-radio__button" {{#if types.mt-pe.fte}}checked{{/if}} {{#unless types.mt-pe}}disable{{/unless}}>
              <span class="mdl-radio__label">Flexed tonal entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-pe-se">
              <input type="checkbox" id="mt-pe-se" class="inline mdl-checkbox__input" {{#if types.mt-pe.se}}checked{{/if}} {{#unless types.mt-pe}}disable{{/unless}}>
              <span class="mdl-checkbox__label">Sequential entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-pe-ae">
              <input type="checkbox" id="mt-pe-ae" class="inline mdl-checkbox__input" {{#if types.mt-pe.ae}}checked{{/if}} {{#unless types.mt-pe}}disable{{/unless}}>
              <span class="mdl-checkbox__label">Added entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-pe-ic">
              <input type="checkbox" id="mt-pe-ic" class="inline mdl-checkbox__input" {{#if types.mt-pe.ic}}checked{{/if}} {{#unless types.mt-pe}}disable{{/unless}}>
              <span class="mdl-checkbox__label">Invertible counterpoint</span>
            </label>
          </div>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-nid" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-nid" class="inline mdl-checkbox__input cb" {{#if types.mt-nid}}checked{{/if}}>
          <span class="mdl-checkbox__label">Non-Imitative Duos</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-nid-voice1">Voice pairs</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-nid-voice1" id="mt-nid-voice1">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
              <select class="dialog_select" name="mt-nid-voice2" id="mt-nid-voice2">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <div data-pair="true" data-for="mt-nid">
            <button class="addVoice btn btn-primary" {{#unless types.mt-nid}}disabled{{/unless}}>
              <i class="material-icons">add</i>
            </button>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="(\\d{1,2}[\+-]){1,}" id="mt-nid-int" {{#if types.mt-nid.int}}value="{{types.mt-nid.int}}"{{/if}} {{#unless types.mt-nid}}disabled{{/unless}}>
            <label class="mdl-textfield__label" for="mt-nid-int">Intervals of imitative entries...</label>
            <span class="mdl-textfield__error">Input is not a series of intervals!</span>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="[LBSM]((\\d{1,2}\\/(?!$))+|\\d{1,2})+" id="mt-nid-tint" {{#if types.mt-nid.tint}}value="{{types.mt-nid.tint}}"{{/if}} {{#unless types.mt-nid}}disabled{{/unless}}>
            <label class="mdl-textfield__label" for="mt-nid-tint">Time interval of entries...</label>
            <span class="mdl-textfield__error">Input is not a series of time intervals!</span>
          </div>
          <div>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-nid-ste">
              <input type="radio" name="mt-nid-options" id="mt-nid-ste" class="inline mdl-radio__button" {{#if types.mt-nid.ste}}checked{{/if}} {{#unless types.mt-nid}}disabled{{/unless}}>
              <span class="mdl-radio__label">Strict entries</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-nid-fe">
              <input type="radio" name="mt-nid-options" id="mt-nid-fe" class="inline mdl-radio__button" {{#if types.mt-nid.fe}}checked{{/if}} {{#unless types.mt-nid}}disabled{{/unless}}>
              <span class="mdl-radio__label">Flexed entries</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-nid-fte">
              <input type="radio" name="mt-nid-options" id="mt-nid-fte" class="inline mdl-radio__button" {{#if types.mt-nid.fte}}checked{{/if}} {{#unless types.mt-nid}}disabled{{/unless}}>
              <span class="mdl-radio__label">Flexed tonal entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-nid-se">
              <input type="checkbox" id="mt-nid-se" class="inline mdl-checkbox__input" {{#if types.mt-nid.se}}checked{{/if}} {{#unless types.mt-nid}}disabled{{/unless}}>
              <span class="mdl-checkbox__label">Sequential entries</span>
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-nid-ic">
              <input type="checkbox" id="mt-nid-ic" class="inline mdl-checkbox__input" {{#if types.mt-nid.ic}}checked{{/if}} {{#unless types.mt-nid}}disabled{{/unless}}>
              <span class="mdl-checkbox__label">Invertible counterpoint</span>
            </label>
          </div>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-hr" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-hr" class="inline mdl-checkbox__input cb" {{#if types.mt-hr}}checked{{/if}}>
          <span class="mdl-checkbox__label">Homorhythm</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-hr-voice1">Voice</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-hr-voice1" id="mt-hr-voice1">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <div data-for="mt-hr">
            <button class="addVoice btn btn-primary" {{#unless types.mt-hr}}disabled{{/unless}}>
              <i class="material-icons">add</i>
            </button>
          </div>
          <div>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-hr-s">
              <input type="radio" name="mt-hr-options" id="mt-hr-s" class="inline mdl-radio__button" {{#if types.mt-hr.s}}checked{{/if}} {{#unless types.mt-hr}}checked disabled{{/unless}}>
              <span class="mdl-radio__label">Simple</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-hr-st">
              <input type="radio" name="mt-hr-options" id="mt-hr-st" class="inline mdl-radio__button" {{#if types.mt-hr.st}}checked{{/if}} {{#unless types.mt-hr}}disabled{{/unless}}>
              <span class="mdl-radio__label">Staggered</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-hr-se">
              <input type="radio" name="mt-hr-options" id="mt-hr-se" class="inline mdl-radio__button" {{#if types.mt-hr.se}}checked{{/if}} {{#unless types.mt-hr}}disabled{{/unless}}>
              <span class="mdl-radio__label">Sequential</span>
            </label>
            <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-hr-fa">
              <input type="radio" name="mt-hr-options" id="mt-hr-fa" class="inline mdl-radio__button" {{#if types.mt-hr.fa}}checked{{/if}} {{#unless types.mt-hr}}disabled{{/unless}}>
              <span class="mdl-radio__label">Fauxbourdon</span>
            </label>
          </div>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-cad" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-cad" class="inline mdl-checkbox__input cb" {{#if types.mt-cad}}checked{{/if}}>
          <span class="mdl-checkbox__label">Cadences</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-cad-voice1">Voice</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-cad-voice1" id="mt-cad-voice1">
                <option value="">None</option>
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
              <select class="dialog_select" name="mt-cad-voice2" id="mt-cad-voice2">
                <option value="">None</option>
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-cad-a">
            <input type="radio" name="mt-int-options" id="mt-cad-a" class="inline mdl-radio__button" {{#if types.mt-cad.a}}checked{{/if}} {{#unless types.mt-cad}}checked disabled{{/unless}}>
            <span class="mdl-radio__label">Authentic</span>
          </label>
          <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-cad-ph">
            <input type="radio" name="mt-int-options" id="mt-cad-ph" class="inline mdl-radio__button" {{#if types.mt-cad.ph}}checked{{/if}} {{#unless types.mt-cad}}disabled{{/unless}}>
            <span class="mdl-radio__label">Phrygian</span>
          </label>
          <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-cad-p">
            <input type="radio" name="mt-int-options" id="mt-cad-p" class="inline mdl-radio__button" {{#if types.mt-cad.p}}checked{{/if}} {{#unless types.mt-cad}}disabled{{/unless}}>
            <span class="mdl-radio__label">Plagal</span>
          </label>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="[ABbCDEeFG]" id="mt-cad-tone" {{#if types.mt-cad.tone}}value="{{types.mt-cad.tone}}"{{/if}} {{#unless types.mt-cad}}disabled{{/unless}} required>
            <label class="mdl-textfield__label" for="mt-cad-tone">Final tone...</label>
          </div>
          <div class="selectGroup">
            <label class="select_label" for="mt-cad-dove_voice1">Dovetail voice</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-cad-dove_voice1" id="mt-cad-dove_voice1">
                <option value="">None</option>
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="\\d{1,2}[+-]" id="mt-cad-dove" {{#if types.mt-cad.dove}}value="{{types.mt-cad.dove}}"{{/if}} {{#unless types.mt-cad}}disabled{{/unless}}>
            <label class="mdl-textfield__label" for="mt-cad-voice">Dovetail interval...</label>
            <span class="mdl-textfield__error">Input is not an interval!</span>
          </div>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-int" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-int" class="inline mdl-checkbox__input cb" {{#if types.mt-int}}checked{{/if}}>
          <span class="mdl-checkbox__label">Interval patterns</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="selectGroup">
            <label class="select_label" for="mt-int-voice1">Voice</label><br/>
            <span class="group">
              <select class="dialog_select" name="mt-int-voice1" id="mt-int-voice1">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
              <select class="dialog_select" name="mt-int-voice2" id="mt-int-voice2">
                {{#each voices}}
                <option value="{{this}}">{{this}}</option>
                {{/each}}
              </select>
            </span>
          </div>

          <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-int-p6">
            <input type="radio" name="mt-int-options" id="mt-int-p6" class="inline mdl-radio__button" {{#if types.mt-int.p6}}checked{{/if}} {{#unless types.mt-int}}disabled{{/unless}}>
            <span class="mdl-radio__label">Parallel 6ths</span>
          </label>
          <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-int-p3">
            <input type="radio" name="mt-int-options" id="mt-int-p3" class="inline mdl-radio__button" {{#if types.mt-int.p3}}checked{{/if}} {{#unless types.mt-int}}disabled{{/unless}}>
            <span class="mdl-radio__label">Parallel 3rds (or 10ths)</span>
          </label>
          <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-int-c35">
            <input type="radio" name="mt-int-options" id="mt-int-c35" class="inline mdl-radio__button" {{#if types.mt-int.c35}}checked{{/if}} {{#unless types.mt-int}}disabled{{/unless}}>
            <span class="mdl-radio__label">Chain 3/5</span>
          </label>
          <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-int-c83">
            <input type="radio" name="mt-int-options" id="mt-int-c83" class="inline mdl-radio__button" {{#if types.mt-int.c83}}checked{{/if}} {{#unless types.mt-int}}disabled{{/unless}}>
            <span class="mdl-radio__label">Chain 83</span>
          </label>
          <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="mt-int-c65">
            <input type="radio" name="mt-int-options" id="mt-int-c65" class="inline mdl-radio__button" {{#if types.mt-int.c65}}checked{{/if}} {{#unless types.mt-int}}disabled{{/unless}}>
            <span class="mdl-radio__label">Chain 6/5</span>
          </label>
        </div>
      </div>
      <div class="mdl-shadow--2dp types">
        <label for="mt-fp" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="mt-fp" class="inline mdl-checkbox__input cb" {{#if types.mt-fp}}checked{{/if}}>
          <span class="mdl-checkbox__label">Form and process</span>
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div class="mdl-textfield mdl-js-textfield">
            <label class="mdl-textfield__label" for="mt-fp-text"></label>
            <textarea class="mdl-textfield__input" type="text" rows= "3" id="mt-fp-text" {{#unless types.mt-fp}}disabled{{/unless}}>{{#if types.mt-fp.text}}{{types.mt-fp.text}}{{/if}}</textarea>
          </div>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="mt-fp-ir">
            <input type="checkbox" id="mt-fp-ir" class="inline mdl-checkbox__input" {{#if types.mt-fp.ir}}checked{{/if}} {{#unless types.mt-fp}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">Internal repetition</span>
          </label>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" pattern="(\\d+-\\d+)(,\\d+-\\d+)*" id="mt-fp-r" {{#unless types.mt-fp}}disabled{{/unless}} {{#if types.mt-fp}}value="{{types.mt-fp.r}}"{{/if}}>
            <label class="mdl-textfield__label" for="mt-fp-r">Internal repetition range</label>
            <span class="mdl-textfield__error">Input is not a range of measure!</span>
          </div>
        </div>
      </div>
    </p>
    <h3>Comment</h3>
    <div class="mdl-textfield mdl-js-textfield">
      <label class="mdl-textfield__label" for="observ-comment"></label>
      <textarea class="mdl-textfield__input" type="text" rows="5" style="width: 80%;" id="observ-comment">{{#if comment}}{{comment}}{{/if}}</textarea>
    </div>
    <div class="messages mdl-shadow--2dp"></div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn btn-primary" id="save_score_observation">Save</button>
    <button type="button" class="btn close" id="cancel_score_observation">Cancel</button>
  </div>
`

export default Handlebars.compile(score_observation_tpl);