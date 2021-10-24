const fileInput = document.getElementById("choose-file");
let data;
let newData;
let matchedData = Array();
let matchedRows;

function processJSON(json) {
    let tempData;
    let errorMessage = `<text style='color:crimson'>
        The JSON file must be an array of objects.</text>`;
    if (!Array.isArray(json)) {
        resultsNone.innerHTML = errorMessage;
        return false;
    }
    let jsonSet = json.reduce((set, item) => set.add(typeof(item)), new Set());
    if(!(jsonSet.size == 1 && jsonSet.has("object"))) {
        resultsNone.innerHTML = errorMessage;
        return false;
    }
    let fields = Array();
    json.forEach((rowObject) => {
        Object.keys(rowObject).forEach((key) => {
            if (!fields.includes(key)) { fields.push(key); }
        });
    });
    tempData = json.map((row) => {
        return fields.map((fieldName) => { 
            if (row[fieldName]) {
                return (typeof(row[fieldName]) == "string") ?
                    row[fieldName] : JSON.stringify(row[fieldName]);
            } else {
                return ""; 
            }
        }); 
    });
    tempData.unshift(fields);
    return tempData;
}

function populateColumnDropdowns(columnNames) {
    ["1", "2", "3"].forEach((i) => {
        d3.select(`#column-selection-${i}`).html("").selectAll("option")
            .data(["(none)"].concat(columnNames)).enter()
            .append("option")
            .attr("value", (d) => d)
            .text((d) => d);
    });
}

function populateColumnsToDisplay(columnNames) {
    d3.select("#columns-to-show").html("");  // clear checkboxes
    let columnsToShow = d3.select("#columns-to-show").selectAll("input")
        .data(columnNames).enter().append("span");
    columnsToShow.append("input")
        .attr("id", (d) => `to-show-${d}`)
        .attr("class", () => "column-to-show")
        .attr("type", "checkbox")
        .property("checked", true);
    columnsToShow.insert("label")
        .attr("for", (d) => `to-show-${d}`)
        .html((d) => ` ${d}&nbsp;&nbsp;&nbsp;`);
}

function addColumnsToDisplayListeners(columnNames) {
    let columnsToShowNodes = document.getElementsByClassName("column-to-show");
    Array.from(columnsToShowNodes).forEach((node) => {
        node.addEventListener("change", () => {
            // TODO: many shared lines with concord(), maybe can refactor
            let columnNames = getColumnNames();
            let [searchColumnIndex1, searchColumnIndex2, searchColumnIndex3] =
                getSearchColumnIndices(columnNames); 
            let concordanceColumns = getConcordanceColumns(
                searchColumnIndex1, searchColumnIndex2, searchColumnIndex3);
            let [selectedColumns, selectedConcordColumns, columnsToDisplay] = 
                prepareColumns(columnNames, concordanceColumns);
            insertColumnHeaders(columnsToDisplay, selectedConcordColumns);
            matchedData = setMatchedData(matchedRows, selectedColumns);
            let [showStart, showEnd] = determineRowsToShow(matchedData.length);
            insertResults(matchedData.slice(showStart, showEnd));
            addResizerListeners();
            addSorterListeners();
            addTextAlignerListeners();
        });
    });
}

function readFile() {
    let reader = new FileReader();
    let columnHeaders = document.getElementById("column-headers").checked;
    filetype = fileInput.files[0].type;
    reader.onload = () => {    
        resetSearch();
        let csvTypes = [
            "text/csv", 
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ];
        if (csvTypes.includes(filetype)) {
            data = d3.csvParseRows(reader.result);
        } else if (filetype == "text/tab-separated-values") {
            data = d3.tsvParseRows(reader.result);
        } else if (filetype == "application/json") {
            data = processJSON(JSON.parse(reader.result));
        } else if (filetype == "text/plain") {
            data = reader.result.split('\n').map((line) => [line]);
        }
        if (!data) {
            resultsNone.innerHTML = `<text style='color:crimson'>
                Invalid file format.</text>`;
            return false; 
        }

        let columnNames = columnHeaders ? 
            data[0] : data[0].map((d, i) =>`Column ${i + 1}`);
        columnNames = renameColumnNames(columnNames);
        if (columnHeaders) { data[0] = columnNames; }

        // Replace null or undefined values with empty strings
        data.forEach((row, i) => {
            row.forEach((item, j) => { if (!item) { data[i][j] = ""; } });
        });
        populateColumnDropdowns(columnNames);
        populateColumnsToDisplay(columnNames);
        addColumnsToDisplayListeners(columnNames);        
    };
    reader.readAsText(fileInput.files[0]);
}

fileInput.addEventListener('change', () => {
    let filetype = fileInput.files[0].type;
    if (filetype == "application/json") {
        columnHeaders.checked = true;
        columnHeaders.disabled = true;
    } else {
        columnHeaders.disabled = false;
    }
    // Clear selections and results
    filterSelection1.innerHTML = "";
    filterSelection2.innerHTML = "";
    filterSelection3.innerHTML = "";
    resultsNone.innerHTML = "";
    resultsTable.innerHTML = "";
    showingStart.value = "1";
    showingEnd.textContent = "_";
    resultsTotal.textContent = "_";

    readFile();    
});
