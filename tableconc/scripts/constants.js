const colors = {
    "light": {
        "fore": "#000000",          // black
        "back": "#b0c4de",          // --lightsteelblue
        "thFore": "#2a3347",        // --dark-blue
        "thBack": "#b0c4de",        // --lightsteelblue
        "thBorder": "#ffffff",      // white
        "tdBack": "#ffffff",        // white
        "picker1": "#ff0000",       // --red
        "picker2": "#0c5eec",       // --blue
        "picker3": "#008000",       // green
        "bgPicker1": "#fcdad8",     // light red
        "bgPicker2": "#d3e2fa",     // light blue
        "bgPicker3": "#e0edd3"      // light green
    }, 
    "dark": {
        "fore": "#cecece",          // white
        "back": "#2a2a2a",          // dark gray
        "thFore": "#b0c4de",        // lightsteelblue
        "thBack": "#2a2a2a",        // dark gray
        "thBorder": "#808080",      // gray
        "tdBack": "#222222",        // darker gray
        "picker1": "#ffda0d",       // cadmium yellow
        "picker2": "#00ffff",       // cyan
        "picker3": "#ff00ff",       // magenta
        "bgPicker1": "#363636",     // dark gray
        "bgPicker2": "#363636",     // dark gray
        "bgPicker3": "#363636"      // dark gray
    }
};

// Top Stuff
const lightControl = document.getElementById("light-control");
const darkControl = document.getElementById("dark-control");

const controls = document.getElementById("controls");
const hideControls = document.getElementById("hide-controls");
const columnControls = document.getElementById("columnselect");
const hideColumnControls = document.getElementById("hide-column-controls");

const chooseFile = document.getElementById("choose-file");
const columnHeaders = document.getElementById("column-headers");

const secondSearch = document.getElementById("second-search");
const secondSearchHider = document.getElementById("second-search-hider");
const thirdSearch = document.getElementById("third-search");
const thirdSearchHider = document.getElementById("third-search-hider");

const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-button");
const resetButton = document.getElementById("reset-button");

const resultsDiv = document.getElementById("results");
const resultsTable = document.getElementById("results-table");
const resultsTableD3 = d3.select("#results-table");
const resultsHeader = document.getElementById("results-header");
const resultsTotal = document.getElementById("results-total");
const resultsNone = document.getElementById("results-none");
const showRows = document.getElementById("show-rows");
const showingStart = document.getElementById("showing-start");
const showingEnd = document.getElementById("showing-end");
const previousPage = document.getElementById("previous-page");
const nextPage = document.getElementById("next-page");
const veryStart = document.getElementById("very-start");
const veryEnd = document.getElementById("very-end");

// Search One
const columnSelection1 = document.getElementById("column-selection-1");
const filterControl1 = document.getElementById("filter-control-1");
const searchRow1 = document.getElementById("search-row-1");
const filterRow1 = document.getElementById("filter-row-1");
const filterSelection1 = document.getElementById("filter-selection-1");
const filterMinSpan1 = document.getElementById("filter-min-span-1");
const filterMin1 = document.getElementById("filter-min-1");
const searchInput1 = document.getElementById("search-input-1");
const regexSelection1 = document.getElementById("regex-1");
const fullWords1 = document.getElementById("full-words-1");
const caseSensitive1 = document.getElementById("case-sensitive-1");
const matchWhere1 = document.getElementById("match-where-1");
const matchEntire1 = document.getElementById("match-entire-1");
const matchBeginning1 = document.getElementById("match-beginning-1");
const matchEnd1 = document.getElementById("match-end-1");
const findall1 = document.getElementById("findall-1");
const concordanceDisplay1 = document.getElementById("concordance-display-1");
const concordanceCutoff1 = document.getElementById("concordance-cutoff-1");
const colorPicker1 = document.getElementById("picker-1");
const colorPickerDiv1 = document.getElementById("picker-div-1");
const bgColorPicker1 = document.getElementById("bg-picker-1");
const bgColorPickerDiv1 = document.getElementById("bg-picker-div-1");

// Search Two
const columnSelection2 = document.getElementById("column-selection-2");
const filterControl2 = document.getElementById("filter-control-2");
const searchRow2 = document.getElementById("search-row-2");
const filterRow2 = document.getElementById("filter-row-2");
const filterSelection2 = document.getElementById("filter-selection-2");
const filterMinSpan2 = document.getElementById("filter-min-span-2");
const filterMin2 = document.getElementById("filter-min-2");
const searchInput2 = document.getElementById("search-input-2");
const regexSelection2 = document.getElementById("regex-2");
const fullWords2 = document.getElementById("full-words-2");
const caseSensitive2 = document.getElementById("case-sensitive-2");
const matchWhere2 = document.getElementById("match-where-2");
const matchEntire2 = document.getElementById("match-entire-2");
const matchBeginning2 = document.getElementById("match-beginning-2");
const matchEnd2 = document.getElementById("match-end-2");
const findall2 = document.getElementById("findall-2");
const concordanceDisplay2 = document.getElementById("concordance-display-2");
const concordanceCutoff2 = document.getElementById("concordance-cutoff-2");
const colorPicker2 = document.getElementById("picker-2");
const colorPickerDiv2 = document.getElementById("picker-div-2");
const bgColorPicker2 = document.getElementById("bg-picker-2");
const bgColorPickerDiv2 = document.getElementById("bg-picker-div-2");

// Search Three
const columnSelection3 = document.getElementById("column-selection-3");
const filterControl3 = document.getElementById("filter-control-3");
const searchRow3 = document.getElementById("search-row-3");
const filterRow3 = document.getElementById("filter-row-3");
const filterSelection3 = document.getElementById("filter-selection-3");
const filterMinSpan3 = document.getElementById("filter-min-span-3");
const filterMin3 = document.getElementById("filter-min-3");
const searchInput3 = document.getElementById("search-input-3");
const regexSelection3 = document.getElementById("regex-3");
const fullWords3 = document.getElementById("full-words-3");
const caseSensitive3 = document.getElementById("case-sensitive-3");
const matchWhere3 = document.getElementById("match-where-3");
const matchEntire3 = document.getElementById("match-entire-3");
const matchBeginning3 = document.getElementById("match-beginning-3");
const matchEnd3 = document.getElementById("match-end-3");
const findall3 = document.getElementById("findall-3");
const concordanceDisplay3 = document.getElementById("concordance-display-3");
const concordanceCutoff3 = document.getElementById("concordance-cutoff-3");
const colorPicker3 = document.getElementById("picker-3");
const colorPickerDiv3 = document.getElementById("picker-div-3");
const bgColorPicker3 = document.getElementById("bg-picker-3");
const bgColorPickerDiv3 = document.getElementById("bg-picker-div-3");
