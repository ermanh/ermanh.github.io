const resultsTimeout = 100;

function getConcordanceColumns(
    searchColumnIndex1, searchColumnIndex2, searchColumnIndex3
) {
    let concordanceColumns = Array();
    if (searchInput1.value !== "" && concordanceDisplay1.checked) {
        concordanceColumns.push(searchColumnIndex1);
    }
    if (searchInput2.value !== "" && concordanceDisplay2.checked) {
        concordanceColumns.push(searchColumnIndex2);
    }
    if (searchInput3.value !== "" && concordanceDisplay3.checked) {
        concordanceColumns.push(searchColumnIndex3);
    }
    return concordanceColumns;
}

function prepareColumns(columnNames, concordanceColumns) {
    // Which columns are selected for display (array of trues & falses)
    let selectedColumns = Array();
    inputs = document.getElementById("columns-to-show")
                     .getElementsByTagName("input");
    Array.from(inputs).forEach((input) => selectedColumns.push(input.checked));
    
    let columnsToDisplay = Array();
    let selectedConcordColumns = Array();
    columnNames.forEach((d, i) => {
        if (selectedColumns[i]) {
            columnsToDisplay.push(d);
            selectedConcordColumns.push(concordanceColumns.includes(i));  
        }
    });
    // Add original line number & result index column
    selectedColumns.unshift(true, true);
    selectedConcordColumns.unshift(false, false);
    columnsToDisplay.unshift("", ""); 
    return [selectedColumns, selectedConcordColumns, columnsToDisplay];
}

function determineThClasses(i) {
    if (i > 1) {
        return "sortable";
    } else if (i == 1) {
        return "sortable result-original-index";
    } else if (i == 0) {
        return "result-index";
    }
}

function determineThInnerHTML(d, i, totalColumns, selectedConcordColumns) {
    let isFinalColumn = (i == totalColumns - 1);
    let taggedData = `<pre>${d}</pre>`;
    let sorter = `<div class="sort" id="i${i}">&equiv;</div>`;
    if (selectedConcordColumns[i]) {
        sorter += `<input id="concord-column-sort-${i}" class="concord-sorter"
                    type="number" value="0" max="10" min="-10"
                    style="border-radius:3px;padding:0 2px;width:30px;"
                    onKeyDown="return false">`;
        sorter += `&nbsp;<div class="infotip">&nbsp;i&nbsp;
                       <span class="infotiptext">
                           Set which word relative to the highlighted text to 
                           sort by. 
                           <span style="color:#2f70a5">
                               (E.g., -1 = first word to the left).</span>
                           <br><br>
                           If the highlighted text is inside a word, 
                           the entire word is position 0. 
                           <span style="color:#2f70a5">
                               ("Word" here means consecutive non-space 
                               characters.)</span>
                       </span>
                   </div>`;
    }
    let resizerLeft = `<div class="resize-left"></div>`;
    let resizerRight = `<div class="resize-right"></div>`;
    if (i > 2) {
        return (isFinalColumn) ?
            `${resizerLeft}${taggedData}${sorter}` :
            `${resizerLeft}${taggedData}${sorter}${resizerRight}`;
    } else if (i == 2) {
        return (isFinalColumn) ? 
            `${taggedData}${sorter}` :
            `${taggedData}${sorter}${resizerRight}`;
    } else if (i == 1) {  // return sorter for original-index column
        return `<div class="sort line-number" id="i${i}">&#x25B2;</div>`;
    } else if (i == 0) {  // return text aligner
        return `<svg id="text-align-control" class="align-left" 
                 height="13", width="15">
                    <path d="M0,3 L8,3 M0,6 L13,6 M0,9 L8,9 M0,12 L13,12"/>
                </svg>`;
    }
}

function insertColumnHeaders(columnsToDisplay, selectedConcordColumns) {
    resultsTable.innerHTML = "";
    resultsTableD3.append("tr")
        .attr("id", "sticky")
        .selectAll("th")
        .data(columnsToDisplay).enter()
        .append("th")
        .attr("class", (d, i) => determineThClasses(i))
        .html((d, i) => determineThInnerHTML(
            d, i, columnsToDisplay.length, selectedConcordColumns));
}

function setMatchedData(matchedRows, selectedColumns) {
    let matchedData = Array();
    matchedRows.forEach((rowIndex, resultIndex) => {
        let row = JSON.parse(JSON.stringify(newData[rowIndex]));
        row.unshift(String(rowIndex));
        row.unshift(String(resultIndex + 1));
        row = row.filter((d, j) => selectedColumns[j]);
        matchedData.push(row);
    });
    return matchedData;
}

function determineRowsToShow(totalRows) {
    let showStart = showingStart.value - 1;
    let showEnd = showStart + Math.min(showRows.value, totalRows);
    showEnd = showEnd > totalRows ? totalRows : showEnd;
    showingStart.value = showStart + 1;
    showingEnd.textContent = `${showEnd}`;
    return [showStart, showEnd]; 
}

function getRelativePositionWord(data, position) {
    if (position == 0) {
        let regExp = /[^ ]*?<text class="hilite\d">.+?<\/text>[^ ]*/;
        return regExp.exec(data)[0];
    } else if (position < 0) {
        let regExp = /^(.*?)<text class="hilite\d">/;
        let beforeArray = regExp.exec(data)[1].split(' ').reverse();
        let beforeString = beforeArray[Math.abs(position)];
        return beforeString ? beforeString : "";
    } else if (position > 0) {
        let regExp = /<text class="hilite\d">.+?<\/text>(.*)$/;
        let afterArray = regExp.exec(data)[1].split(' ');
        return afterArray[position] ? afterArray[position] : "";
    }
}

function sortByColumn(columnToSort, order, rows, concordSortInput) {
    return rows.sort((a, b) => {
        let aString = a[columnToSort];
        let bString = b[columnToSort];
        if (columnToSort == "1") {
            return (order == "ascending") ? 
                Number(aString) - Number(bString) : 
                Number(bString) - Number(aString);
        } else {
            if (concordSortInput) {
                let position = Number(concordSortInput.value);
                let aWord = getRelativePositionWord(aString, position);
                let bWord = getRelativePositionWord(bString, position);
                return (order == "ascending") ?
                    aWord.localeCompare(bWord) : 
                    bWord.localeCompare(aWord);
            } else {
                return (order == "ascending") ?
                    aString.localeCompare(bString) : 
                    bString.localeCompare(aString);
            }
        }
    });
}

function sortRows(columnToSort, order, concordSortInput) {
    matchedData = sortByColumn(
        columnToSort, order, matchedData, concordSortInput);
    matchedData = matchedData.map((row, i) => {
        return row.map((item, j) => (j == 0) ? String(i + 1) : item);
    });
    replaceSortableRows();
}

function addResizerListeners() {
    document.querySelectorAll("div.resize-right").forEach((div) => {
        makeResizable(div, adjacentIsRight=true);
    });
    document.querySelectorAll("div.resize-left").forEach((div) => {
        makeResizable(div, adjacentIsRight=false);
    });
}

function addSorterListeners() {
    sorters = document.querySelectorAll(".sort");
    sorters.forEach((sorter) => {
        sorter.addEventListener('mouseover', 
            () => sorter.style.color = "coral");
        sorter.addEventListener('mouseout', 
            () => sorter.style.color = "steelblue");
        sorter.addEventListener('click', (e) => {
            let columnIndex = sorter.id.slice(1);
            let concordSortInput = document.getElementById(
                `concord-column-sort-${columnIndex}`);
            let text = sorter.innerHTML;
            if (text == "\u2261" || text == "\u25BC") { 
                sorters.forEach((sorter) => sorter.innerHTML = "&equiv;");
                sorter.innerHTML = "&#x25B2;"; 
                sortRows(sorter.id.slice(1), "ascending", concordSortInput);
            } else if (text == "\u25B2") { 
                sorter.innerHTML = "&#x25BC;"; 
                sortRows(sorter.id.slice(1), "descending", concordSortInput);
            }
        });
    });
}

function addTextAlignerListeners() {
    textAligner = document.getElementById("text-align-control");
    if (textAligner) {
        textAligner.addEventListener("mouseover", 
            () => textAligner.style.stroke = "yellow" );
        textAligner.addEventListener("mouseout", 
            () => textAligner.style.stroke = "#2a3347" );
        textAligner.addEventListener("click", () => {
            if (textAligner.classList.contains("align-left")) {
                textAligner.innerHTML = `
                    <path d="M3,3 L10,3 M0,6 L13,6 M3,9 L10,9 M0,12 L13,12"/>`;
                textAligner.classList.replace("align-left", "align-center");
                d3.selectAll("td.results-td").style("text-align", "center");
            } else if (textAligner.classList.contains("align-center")) {
                textAligner.innerHTML = `
                    <path d="M5,3 L13,3 M1,6 L13,6 M5,9 L13,9 M1,12 L13,12"/>`;
                textAligner.classList.replace("align-center", "align-right");
                d3.selectAll("td.results-td").style("text-align", "right");
            } else if (textAligner.classList.contains("align-right")) {
                textAligner.innerHTML = `
                    <path d="M0,3 L8,3 M0,6 L12,6 M0,9 L8,9 M0,12 L12,12"/>`;
                textAligner.classList.replace("align-right", "align-left");
                d3.selectAll("td.results-td").style("text-align", "left");
            }
        });
    }
}

function insertResults(rows) {
    resultsNone.innerHTML = "";
    resultsTableD3.selectAll("tr.sortable-row").remove();
    rows.forEach((row) => {
        resultsTableD3.append("tr")
            .attr("class", "sortable-row")
            .selectAll("td").data(row).enter()
                .append("td")
                .attr("class", (d, i) => {
                    if (i > 1) {
                        return "results-td";
                    } else if (i == 1) {
                        return "result-original-index";
                    } else if (i == 0) {
                        return "result-index";
                    }
                })
                .html((d) => {
                    if (!d.includes('<text class="hilite')) {
                        d = escapeHTML(d);
                    }
                    return `<pre>${d}</pre>`;
                });
    }); 
    enforceLightDarkMode();
    enforceHilites();
}

function constructRegex(i) {
    let pattern;
    let flags = "";
    let caseSensitive = document.getElementById(`case-sensitive-${i}`);
    let findall = document.getElementById(`findall-${i}`);
    let regexSelection = document.getElementById(`regex-${i}`);
    let searchInput = document.getElementById(`search-input-${i}`);
    let fullWords = document.getElementById(`full-words-${i}`);
    let matchWhere = document.getElementById(`match-where-${i}`);
    if (!caseSensitive.checked) { flags = `${flags}i`; }
    if (findall.checked) {
        flags = `${flags}g`;
        if (regexSelection.checked) {
            pattern = searchInput.value;
        } else {
            pattern = escapeRegExp(searchInput.value);
            if (fullWords.checked) {
                pattern = fullwordBoundaries(pattern, searchInput.value);
            }
        }
    } else {
        if (regexSelection.checked) {
            pattern = `^(.*?)(${searchInput.value})(.*)$`;
        } else {
            pattern = escapeRegExp(searchInput.value);
            if (fullWords.checked) {
                pattern = fullwordBoundaries(pattern, searchInput.value);
            }
            if (matchWhere.value == `match-entire-${i}`) {
                pattern = `^(${pattern})$`;
            } else if (matchWhere.value == `match-beginning-${i}`) {
                pattern = `^(${pattern})(.*)$`;
            } else if (matchWhere.value == `match-end-${i}`) {
                pattern = `^(.*?)(${pattern})$`;
            } else {
                pattern = `^(.*?)(${pattern})(.*)$`;
            }
        }
    }
    return RegExp(pattern, flags);
}

function createHilitedString(i, str, re, tagOpen, tagClose) {
    let regexSelection = document.getElementById(`regex-${i}`);
    let matchWhere = document.getElementById(`match-where-${i}`);
    let findall = document.getElementById(`findall-${i}`);
    let htmlSafeString;
    if (regexSelection.checked || 
        matchWhere.value == `match-anywhere-${i}`)
    {
        if (findall.checked) {
            htmlSafeString = iterHtmlSafeReplace(
                str, re, tagOpen, tagClose);
        } else {
            htmlSafeString = str.replace(re, (_, g1, g2, g3) => {
                return `${escapeHTML(g1)}${tagOpen}` +
                        `${escapeHTML(g2)}${tagClose}` + 
                        `${escapeHTML(g3)}`; });
        }
    } else if (matchWhere.value == `match-entire-${i}`) {
        htmlSafeString = str.replace(re, (_, g1) => {
            return `${tagOpen}${escapeHTML(g1)}${tagClose}`; });
    } else if (matchWhere.value == `match-beginning-${i}`) {
        htmlSafeString = str.replace(re, (_, g1, g2) => {
            return `${tagOpen}${escapeHTML(g1)}${tagClose}` +
                    `${escapeHTML(g2)}`; });
    } else if (matchWhere.value == `match-end-${i}`) {
        htmlSafeString = str.replace(re1, (_, g1, g2) => {
            return `${escapeHTML(g1)}${tagOpen}` + 
                    `${escapeHTML(g2)}${tagClose}`; });
    }
    return htmlSafeString;
}

function recordMatchedRows_CreateHilitedStrings(
    i, startingRowIndex, searchColumnIndex, re, matchedRows, newData
) {
    let tagOpen = `<text class="hilite${i}">`;
    let tagClose = "</text>";

    for (let j = startingRowIndex; j < data.length; j++) {
        let str = data[j][searchColumnIndex];
        if (str.match(re)) {
            matchedRows.push(j);
            let htmlSafeString = createHilitedString(
                i, str, re, tagOpen, tagClose);
            newData[j][searchColumnIndex] = htmlSafeString;
        }
    }
}

function processSearchInput(
    i, startingRowIndex, searchColumnIndex, data, newData
) 
{
    let matchedRows = Array();
    let filterControl = document.getElementById(`filter-control-${i}`);
    let filterSelection = document.getElementById(`filter-selection-${i}`);
    let searchInput = document.getElementById(`search-input-${i}`);
    if (filterControl.checked) {  // Use an existing value to filter
        if (typeof(filterSelection.value == "string")) {
            for (let j = startingRowIndex; j < data.length; j++) {
                let str = data[j][searchColumnIndex];
                if (str == filterSelection.value) { matchedRows.push(j); }
            }
        }
    } else {  // Use the search function
        if (searchInput.value !== "") {
            let re = constructRegex(i);
            recordMatchedRows_CreateHilitedStrings(i, startingRowIndex,
                searchColumnIndex, re, matchedRows, newData);
        }
    }
    return matchedRows;
}


function determineMatchedRows(matchedRows1, matchedRows2, matchedRows3, 
                              matchedRows) {
    let inputValid1 = (
        (!filterControl1.checked && searchInput1.value !== "") ||
        (filterControl1.checked && typeof(filterSelection1.value) == "string")
    );
    let inputValid2 = (
        (!filterControl2.checked && searchInput2.value !== "") ||
        (filterControl2.checked && typeof(filterSelection2.value) == "string")
    );
    let inputValid3 = (
        (!filterControl3.checked && searchInput3.value !== "") ||
        (filterControl3.checked && typeof(filterSelection3.value) == "string")
    );
    if (inputValid1) { matchedRows = matchedRows1; }
    if (inputValid2) {
        matchedRows = inputValid1 ? 
            matchedRows.filter((x) => matchedRows2.includes(x)) : matchedRows2;
    }
    if (inputValid3) {
        matchedRows = (inputValid1 || inputValid2) ?
            matchedRows.filter((x) => matchedRows3.includes(x)) : matchedRows3;
    }
    return matchedRows;
}

function padEachSearch(i, searchColumnIndex, matchedRows, newData) {
    let filterControl = document.getElementById(`filter-control-${i}`);
    let concordDisplay = document.getElementById(`concordance-display-${i}`);
    let searchInput = document.getElementById(`search-input-${i}`);
    let concordCutoff = document.getElementById(`concordance-cutoff-${i}`);
    if (!filterControl.checked && concordDisplay.checked && 
        searchInput.value !== "")
    {
        let concordStrings = matchedRows.map((j) => {
            return newData[j][searchColumnIndex]; 
        });
        concordStrings = padConcordance(i, concordStrings, concordCutoff.value);
        matchedRows.forEach((j) => {
            newData[j][searchColumnIndex] = concordStrings.shift();
        });
    }
}

function padResults(searchColumnIndex1, searchColumnIndex2, searchColumnIndex3,
                    matchedRows, newData) {
    if (matchedRows.length > 0) {
        padEachSearch("1", searchColumnIndex1, matchedRows, newData);
        padEachSearch("2", searchColumnIndex2, matchedRows, newData);
        padEachSearch("3", searchColumnIndex3, matchedRows, newData);
    }
}

function showTotalResults(numberOfResults) {
    setTimeout(() => { resultsTotal.textContent = `${numberOfResults}`; }, 
               resultsTimeout);
}

function showNoResults() {
    resultsTable.innerHTML = "";
    let resultText = "No results for ";
    if (searchInput1.value !== "" || filterSelection1.value) {
        let value1 = (searchInput1.value !== "") ? 
            searchInput1.value : filterSelection1.value;
        resultText = resultText + `"${value1}"`;
        if (searchInput2.value !== "" || filterSelection2.value ||
            searchInput3.value !== "" || filterSelection3.value) 
        {
            resultText = resultText + " and ";
        }
    }
    if (searchInput2.value !== "" || filterSelection2.value) {
        let value2 = (searchInput2.value !== "") ? 
            searchInput2.value : filterSelection2.value;
        resultText = resultText + `"${value2}"`;
        if (searchInput3.value !== "" || filterSelection3.value) {
            resultText = resultText + " and ";
        }
    }
    if (searchInput3.value !== "" || filterSelection3.value) {
        let value3 = (searchInput3.value !== "") ? 
            searchInput3.value : filterSelection3.value;
        resultText = resultText + `"${value3}"`;
    }
    showingStart.value = "1";
    showingEnd.textContent = "_";
    resultsTotal.textContent = "_";
    resultsNone.textContent = "";
    previousPage.disabled = true;
    nextPage.disabled = true;
    resultText = `<span style="color:#ff0000">${resultText}</span>`;
    setTimeout(() => { resultsNone.innerHTML = resultText; }, resultsTimeout);
}

function getColumnNames() {
    return columnHeaders.checked ? 
        data[0] : data[0].map((d, i) => `Column ${i + 1}`);
}

function getSearchColumnIndices(columnNames) {
    let colObj = {};  // { columnName: index }
    for (let i = 0; i < columnNames.length; i++) { colObj[columnNames[i]] = i; }
    return [colObj[columnSelection1.value], 
            colObj[columnSelection2.value], 
            colObj[columnSelection3.value]];
}

function concordSearch() {
    newData = JSON.parse(JSON.stringify(data));
    
    let startingRowIndex = columnHeaders.checked ? 1 : 0;    
    let columnNames = getColumnNames();
    let [searchColumnIndex1, searchColumnIndex2, searchColumnIndex3] =
        getSearchColumnIndices(columnNames);

    let matchedRows1 = processSearchInput(
        "1", startingRowIndex, searchColumnIndex1, data, newData);
    let matchedRows2 = processSearchInput(
        "2", startingRowIndex, searchColumnIndex2, data, newData);
    let matchedRows3 = processSearchInput(
        "3", startingRowIndex, searchColumnIndex3, data, newData);
    matchedRows = determineMatchedRows(
        matchedRows1, matchedRows2, matchedRows3, matchedRows);
    padResults(searchColumnIndex1, searchColumnIndex2, searchColumnIndex3,
               matchedRows, newData);
    
    // Show results
    if (matchedRows.length > 0) {
        showingStart.value = 1;
        showTotalResults(matchedRows.length);
        const concordanceColumns = getConcordanceColumns(
            searchColumnIndex1, searchColumnIndex2, searchColumnIndex3);
        const [selectedColumns, selectedConcordColumns, columnsToDisplay] = 
            prepareColumns(columnNames, concordanceColumns);
        insertColumnHeaders(columnsToDisplay, selectedConcordColumns);
        matchedData = setMatchedData(matchedRows, selectedColumns);
        const [showStart, showEnd] = determineRowsToShow(matchedData.length);
        insertResults(matchedData.slice(showStart, showEnd));
        addResizerListeners();
        addSorterListeners();
        addTextAlignerListeners();
    } else {
        showNoResults();
    }
}

searchBox.addEventListener('submit', concordSearch);
