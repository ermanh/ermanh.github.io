function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function columnNamesHaveDuplicates(columnNames) {
    let columnNamesSet = new Set();
    columnNames.forEach((name) => columnNamesSet.add(name));
    return columnNamesSet.size !== columnNames.length;
}

function renameColumnNames(columnNames) {
    let newColumnNames = Array();
    let dictionary = {};
    columnNames.forEach((name) => {
        let newName = name;
        if (RegExp(/^\s*$/).exec(newName)) { newName = "Unnamed"; }
        if (!dictionary[newName]) {
            dictionary[newName] = 1;
            newColumnNames.push(newName);
        } else {
            dictionary[newName] += 1;
            newColumnNames.push(`${newName} (${dictionary[newName]})`);
        }
    });
    while (columnNamesHaveDuplicates(newColumnNames)) {  // Rename duplicates
        newColumnNames = renameColumnNames(newColumnNames); 
    }
    return newColumnNames;
}

function populateFilterValues(whichFilter, minQuantity) {
    let filterValueMaxLength = 200;
    let columnValue = document.getElementById(
        `column-selection-${whichFilter}`).value;
    if (columnValue == "(none)") { return null; }

    let columnIndex;
    if (columnHeaders.checked) {
        let dictionary = {};  // {column name: index}
        for (let i = 0; i < data[0].length; i++) { dictionary[data[0][i]] = i; }
        columnIndex = dictionary[columnValue];
    } else {
        columnIndex = RegExp(/\d+/).exec(columnValue)[0] - 1;
    }

    let startingRowIndex = columnHeaders.checked ? 1 : 0;
    let valueCount = {};
    for (i = startingRowIndex; i < data.length; i++) {
        let datum = data[i][columnIndex];
        valueCount[datum] = (valueCount[datum] || 0) + 1;
    }
    let values = Object.keys(valueCount).sort((a, b) => { 
        return a.toLowerCase().localeCompare(b.toLowerCase()); 
    });
    values = values.filter((value) => valueCount[value] >= Number(minQuantity));

    let filterSelection = d3.select(`#filter-selection-${whichFilter}`);
    filterSelection.html(""); // clear menu
    filterSelection.selectAll("option").data(values).enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => {
            if (d.length > filterValueMaxLength) {
                return `${d.slice(0,filterValueMaxLength)}&hellip; ` +
                    `(${valueCount[d]})`;
            }
            if (d === "") { return `(empty) (${valueCount[d]})`; } 
            return `${d} (${valueCount[d]})`; 
        });
}

function makeResizable(div, adjacentIsRight) {
    let position, thisColumn, adjacentColumn, thisWidth, adjacentWidth;

    let mousemoveListener = (e) => {
        let traveled = adjacentIsRight ? 
            e.pageX - position : position - e.pageX;
        thisColumn.style.width = `${thisWidth + traveled}px`;
        adjacentColumn.style.width = `${adjacentWidth - traveled}px`; 
    };

    let mouseupListener = () => {
        document.getElementsByTagName("body")[0].style.cursor = "auto";
        document.removeEventListener('mousemove', mousemoveListener);
        document.removeEventListener('mouseup', mouseupListener);
    };

    div.addEventListener('mousedown', (e) => {
        e.preventDefault();
        document.getElementsByTagName("body")[0].style.cursor = "col-resize";
        position = e.pageX;
        thisColumn = div.parentElement;
        adjacentColumn = adjacentIsRight ? 
            thisColumn.nextElementSibling : thisColumn.previousElementSibling;
        thisWidth = thisColumn.offsetWidth;
        adjacentWidth = adjacentColumn.offsetWidth;
        document.addEventListener('mousemove', mousemoveListener);
        document.addEventListener('mouseup', mouseupListener);
    });
}

function escapeHTML(string) {
    newstring = string.replace(RegExp(/&/, 'g'), '&amp;');
    newstring = newstring.replace(RegExp(/</, 'g'), '&lt;');
    newstring = newstring.replace(RegExp(/>/, 'g'), '&gt;');
    newstring = newstring.replace(RegExp(/\"/, 'g'), '&quot;');
    newstring = newstring.replace(RegExp(/\'/, 'g'), '&#39;');
    return newstring;
}

function unescapeHTML(string) {
    newstring = string.replace(RegExp(/&lt;/, 'g'), '<');
    newstring = newstring.replace(RegExp(/&gt;/, 'g'), '>');
    newstring = newstring.replace(RegExp(/&quot;/, 'g'), '"');
    newstring = newstring.replace(RegExp(/&#39;/, 'g'), "'");
    newstring = newstring.replace(RegExp(/&amp;/, 'g'), '&');
    return newstring;
}

function iterHtmlSafeReplace(string, re, tagOpen, tagClose) {
    let newString = '';
    let myArray;
    let prevIndex = 0;
    let prevMatchLength = 0;
    while ((myArray = re.exec(string)) !== null) {
        match = myArray[0];
        index = myArray.index;
        preMatch = string.slice(prevIndex + prevMatchLength, index);
        newString += `${escapeHTML(preMatch)}` +
                     `${tagOpen}${escapeHTML(match)}${tagClose}`;
        prevIndex = index;
        prevMatchLength = match.length;
    }
    newString += escapeHTML(
        string.slice(prevIndex + prevMatchLength, string.length));
    return newString;
}

function fullwordBoundaries(pattern, searchInputValue) {
    let beginning = searchInputValue.match(/^\w/) ? "\\b" : "";
    let end = searchInputValue.match(/\w$/) ? "\\b" : "";
    return `${beginning}${pattern}${end}`;
}

function formatPadStart(
    i, concordCutoffValue, maxBefore, beforeLengths, 
    ellipsisHTML, ellipsisRegExp, sliceStartIndex
) {
    let padStart;
    let sliceStartIndexNew = sliceStartIndex;
    if (concordCutoffValue < maxBefore && concordCutoffValue > 0) {
        // number of &nbps; to add at the beginning
        let startCutoffDiff = concordCutoffValue - beforeLengths[i];
        if (startCutoffDiff < 0) { startCutoffDiff = 0; }               
        padStart = '&nbsp;'.repeat(startCutoffDiff);
        
        let cutIntoStart = (concordCutoffValue < beforeLengths[i]);
        if (concordCutoffValue < maxBefore) {
            padStart = cutIntoStart ? 
                padStart + ellipsisHTML : padStart + '&nbsp;';
        } 
        if (cutIntoStart) {
            sliceStartIndexNew = beforeLengths[i] - concordCutoffValue;
        }
    } else {
        padStart = '&nbsp;'.repeat(maxBefore - beforeLengths[i]);
    }
    // Add breaking space
    if (ellipsisRegExp.exec(padStart)) {
        padStart = padStart.replace(ellipsisRegExp, " " + ellipsisHTML);
    } else {
        padStart += " "; 
    }
    return [padStart, sliceStartIndexNew];
}

function formatPadEnd(
    i, concordCutoffValue, maxAfter, afterLengths, 
    ellipsisHTML, ellipsisRegExp, sliceEndIndex
) {
    let padEnd;
    let sliceEndIndexNew = sliceEndIndex;
    if (concordCutoffValue < maxAfter && concordCutoffValue > 0) {
        // number of &nbps; to add at the end
        let endCutoffDiff = concordCutoffValue - afterLengths[i];
        if (endCutoffDiff < 0) { endCutoffDiff = 0; }
        padEnd = '&nbsp;'.repeat(endCutoffDiff);
        
        let cutIntoEnd = (concordCutoffValue < afterLengths[i]);
        if (concordCutoffValue < maxAfter) {
            padEnd = cutIntoEnd ? ellipsisHTML + padEnd : '&nbsp;' + padEnd;
        }
        if (cutIntoEnd) {
            sliceEndIndexNew -= (afterLengths[i] - concordCutoffValue);
        }
    } else {
        padEnd = '&nbsp;'.repeat(maxAfter - afterLengths[i]);
    }
    // Add breaking space
    if (ellipsisRegExp.exec(padEnd)) {
        padEnd = padEnd.replace(ellipsisRegExp, ellipsisHTML + " ");
    } else {
        padEnd = " &nbsp;" + padEnd; 
    }
    return [padEnd, sliceEndIndexNew];
}

function getHiliteRegExps(oneTwoOrThree) {
    let beforeRE, hilitedRE;
    if (oneTwoOrThree == "1") {
        beforeRE = RegExp(/^(.*?)<text class="hilite1">/);
        hilitedRE = RegExp(/<text class="hilite1">.+?<\/text>/);
    } else if (oneTwoOrThree == "2") {
        beforeRE = RegExp(/^(.*?)<text class="hilite2">/);
        hilitedRE = RegExp(/<text class="hilite2">.+?<\/text>/);
    } else if (oneTwoOrThree == "3") {
        beforeRE = RegExp(/^(.*?)<text class="hilite3">/);
        hilitedRE = RegExp(/<text class="hilite3">.+?<\/text>/);
    }
    return [beforeRE, hilitedRE];
}

function padConcordance(i, concordanceColumn, concordCutoffValue) {
    // concordCutoffValue: no. of spaces to each side of the searched pattern
    concordCutoffValue = Number(concordCutoffValue);
    let ellipsisHTML = '<text style="color:gray">&hellip;</text>';
    let ellipsisRegExp = RegExp(escapeRegExp(ellipsisHTML));
    let [beforeRE, hilitedRE] = getHiliteRegExps(i);
    let afterRE = RegExp(/.*?<\/text>(.*)$/);
    let beforeLengths = concordanceColumn.map((el) => {
        return unescapeHTML(beforeRE.exec(el).pop()).length;
    });
    let afterLengths = concordanceColumn.map((el) => {
        return unescapeHTML(afterRE.exec(el).pop()).length;
    });
    let maxBefore = beforeLengths.reduce((a, b) => Math.max(a, b));
    let maxAfter = afterLengths.reduce((a, b) => Math.max(a, b));
    let newColumn = Array();
    for (let i = 0; i < concordanceColumn.length; i++) {
        htmlOriginal = concordanceColumn[i];
        hilited = hilitedRE.exec(htmlOriginal);
        beforeHilited = unescapeHTML(htmlOriginal.slice(0, hilited.index));
        afterHilited = unescapeHTML(htmlOriginal.slice(
            hilited.index + hilited[0].length, htmlOriginal.length));
        let html = `${beforeHilited}${hilited[0]}${afterHilited}`;

        let [padStart, sliceStartIndex] = formatPadStart(i, concordCutoffValue, 
            maxBefore, beforeLengths, ellipsisHTML, ellipsisRegExp, 0);
        let [padEnd, sliceEndIndex] = formatPadEnd(i, concordCutoffValue, 
            maxAfter, afterLengths, ellipsisHTML, ellipsisRegExp, html.length);
        
        newHtml = html.slice(sliceStartIndex, sliceEndIndex);
        hilited = hilitedRE.exec(newHtml);
        beforeHilited = escapeHTML(newHtml.slice(0, hilited.index));
        afterHilited = escapeHTML(newHtml.slice(
            hilited.index + hilited[0].length, newHtml.length));
        newColumn.push(`${padStart}${beforeHilited}${hilited[0]}` + 
                       `${afterHilited}${padEnd}`);
    }
    return newColumn;
}

function enforceHilites() {
    let hilitedOnes = document.getElementsByClassName("hilite1");
    Array.from(hilitedOnes).forEach((el) => {
        el.style.color = colorPicker1.value;
        el.style.backgroundColor = bgColorPicker1.value;
    });
    let hilitedTwos = document.getElementsByClassName("hilite2");
    Array.from(hilitedTwos).forEach((el) => {
        el.style.color = colorPicker2.value;
        el.style.backgroundColor = bgColorPicker2.value;
    });
    let hilitedThrees = document.getElementsByClassName("hilite3");
    Array.from(hilitedThrees).forEach((el) => {
        el.style.color = colorPicker3.value;
        el.style.backgroundColor = bgColorPicker3.value;
    });
}

function enforceLightDarkMode() {
    isDark = darkControl.classList.contains("is-dark");
    document.body.style.backgroundColor = isDark ? 
        colors.dark.back : colors.light.back;
    document.body.style.color = isDark ? colors.dark.fore : colors.light.fore;
    resultsDiv.style.color = isDark ? colors.dark.fore : colors.light.fore;
    resultsHeader.style.color = isDark ? "#b8ffff" : "#0047ab";
    resultsHeader.style.backgroundColor = isDark ? 
        colors.dark.back : colors.light.back;
    resultsHeader.style.borderBottom = isDark ? 
        "1px solid gray" : "1px solid white";
    
    sortableTH = document.getElementsByClassName("sortable");
    Array.from(sortableTH).forEach((th) => {
        th.style.backgroundColor = isDark ? 
            colors.dark.thBack : colors.light.thBack;
        th.style.color = isDark ? 
            colors.dark.thFore : colors.light.thFore;
        th.style.border = isDark ? 
            `2px solid ${colors.dark.thBorder}` : 
            `1px solid ${colors.light.thBorder}`;
    });
    resultsTD = document.getElementsByClassName("results-td");
    Array.from(resultsTD).forEach((cell) => {
        cell.style.backgroundColor = isDark ? 
            colors.dark.tdBack : colors.light.tdBack;
        cell.style.color = isDark ? 
            colors.dark.fore : colors.light.fore;
        cell.style.border = isDark? 
            "0.5px solid gray" : "0.5px solid lightgray";
    });
    if (isDark) {
        // pickers 1
        if (colorPicker1.value == colors.light.picker1) {
            colorPicker1.value = colors.dark.picker1; 
            colorPickerDiv1.style.backgroundColor = colors.dark.picker1;
        }
        if (bgColorPicker1.value == colors.light.bgPicker1) { 
            bgColorPicker1.value = colors.dark.bgPicker1; 
            bgColorPickerDiv1.style.backgroundColor = colors.dark.bgPicker1;
        }
        // pickers 2, second search hider
        if (colorPicker2.value == colors.light.picker2) {
            colorPicker2.value = colors.dark.picker2; 
            colorPickerDiv2.style.backgroundColor = colors.dark.picker2;
            secondSearchHider.style.stroke = colors.dark.picker2;
        }
        if (bgColorPicker2.value == colors.light.bgPicker2) { 
            bgColorPicker2.value = colors.dark.bgPicker2; 
            bgColorPickerDiv2.style.backgroundColor = colors.dark.bgPicker2;
            secondSearchHider.style.backgroundColor = colors.dark.bgPicker2;
        }
        // pickers 3, third search hider
        if (colorPicker3.value == colors.light.picker3) {
            colorPicker3.value = colors.dark.picker3; 
            colorPickerDiv3.style.backgroundColor = colors.dark.picker3;
            thirdSearchHider.style.stroke = colors.dark.picker3;
        }
        if (bgColorPicker3.value == colors.light.bgPicker3) { 
            bgColorPicker3.value = colors.dark.bgPicker3; 
            bgColorPickerDiv3.style.backgroundColor = colors.dark.bgPicker3;
            thirdSearchHider.style.backgroundColor = colors.dark.bgPicker3;
        }
    } else {
        // pickers 1
        if (colorPicker1.value == colors.dark.picker1) {
            colorPicker1.value = colors.light.picker1; 
            colorPickerDiv1.style.backgroundColor = colors.light.picker1;
        }
        if (bgColorPicker1.value == colors.dark.bgPicker1) { 
            bgColorPicker1.value = colors.light.bgPicker1; 
            bgColorPickerDiv1.style.backgroundColor = colors.light.bgPicker1;
        }
        // pickers 2, second search hider
        if (colorPicker2.value == colors.dark.picker2) {
            colorPicker2.value = colors.light.picker2; 
            colorPickerDiv2.style.backgroundColor = colors.light.picker2;
            secondSearchHider.style.stroke = colors.light.picker2;
        }
        if (bgColorPicker2.value == colors.dark.bgPicker2) { 
            bgColorPicker2.value = colors.light.bgPicker2; 
            bgColorPickerDiv2.style.backgroundColor = colors.light.bgPicker2;
            secondSearchHider.style.backgroundColor = colors.light.bgPicker2;
        }
        // pickers 3, third search hider
        if (colorPicker3.value == colors.dark.picker3) {
            colorPicker3.value = colors.light.picker3;
            colorPickerDiv3.style.backgroundColor = colors.light.picker3;
            thirdSearchHider.style.stroke = colors.light.picker3;
        }
        if (bgColorPicker3.value == colors.dark.bgPicker3) { 
            bgColorPicker3.value = colors.light.bgPicker3; 
            bgColorPickerDiv3.style.backgroundColor = colors.light.bgPicker3;
            thirdSearchHider.style.backgroundColor = colors.light.bgPicker3;
        }
    }
}

function updatePageView() {
    if (resultsTable.innerHTML !== "") {
        let showStart = Number(showingStart.value);
        let showEnd = showStart + Number(showRows.value) - 1;
        if (showEnd > matchedData.length && matchedData.length > 0) { 
            showEnd = matchedData.length; 
        }
        showingEnd.textContent = String(showEnd);
        insertResults(matchedData.slice(showStart - 1, showEnd));
    }
}

function replaceSortableRows() {
    let showStart = Number(showingStart.value) - 1;
    let showEnd = Number(showingEnd.textContent);
    resultsTableD3.selectAll("tr.sortable-row").remove();
    matchedData.slice(showStart, showEnd).forEach((row) => {
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

function resetSearch() {
    resultsNone.innerHTML = "";
    let isDark = darkControl.classList.contains("is-dark");
    let darkOrLight = isDark ? "dark" : "light";
    secondSearchHider.style.stroke = colors[darkOrLight].picker2;
    thirdSearchHider.style.stroke = colors[darkOrLight].picker3;
    ["1", "2", "3"].forEach((i) => {
        document.getElementById(`column-selection-${i}`).value = "(none)";
        document.getElementById(`filter-control-${i}`).checked = false;
        document.getElementById(`filter-min-span-${i}`).style.display = "none";
        document.getElementById(`filter-min-${i}`).value = "2";
        document.getElementById(`filter-row-${i}`).style.display = "none";
        document.getElementById(`filter-selection-${i}`).innerHTML = "";
        document.getElementById(`search-row-${i}`).style.display = "block";
        document.getElementById(`search-input-${i}`).value = "";
        document.getElementById(`search-input-${i}`).disabled = true;
        document.getElementById(`full-words-${i}`).checked = true;
        document.getElementById(`full-words-${i}`).disabled = true;
        document.getElementById(`regex-${i}`).checked = false;
        document.getElementById(`regex-${i}`).disabled = true;
        document.getElementById(`match-where-${i}`)
            .value = `match-anywhere-${i}`;
        document.getElementById(`match-where-${i}`).disabled = true;
        document.getElementById(`case-sensitive-${i}`).checked = false;
        document.getElementById(`case-sensitive-${i}`).disabled = true;
        document.getElementById(`concordance-display-${i}`).checked = true;
        document.getElementById(`concordance-display-${i}`).disabled = true;
        document.getElementById(`concordance-cutoff-${i}`).value = "50";
        document.getElementById(`concordance-cutoff-${i}`).disabled = true;
        document.getElementById(`findall-${i}`).checked = false;
        document.getElementById(`findall-${i}`).disabled = true;
        document.getElementById(`picker-${i}`).disabled = true;
        document.getElementById(`bg-picker-${i}`).disabled = true;
        let pColor = colors[darkOrLight][`picker${i}`];
        let pBgColor = colors[darkOrLight][`bgPicker${i}`];
        document.getElementById(`picker-${i}`).value = pColor;
        document.getElementById(`bg-picker-${i}`).value = pBgColor;
        document.getElementById(`picker-div-${i}`)
            .style.backgroundColor = pColor;
        document.getElementById(`bg-picker-div-${i}`)
            .style.backgroundColor = pBgColor;
        document.getElementById(`picker-div-${i}`).style.opacity = "0.3";
        document.getElementById(`bg-picker-div-${i}`).style.opacity = "0.3";
    });
}
