
// ~~~ Columns to display ~~~
columnHeaders.addEventListener('change', () => {
    filterSelection1.innerHTML = "";
    filterSelection2.innerHTML = "";
    filterSelection3.innerHTML = "";
    searchInput1.disabled = true;
    searchInput2.disabled = true;
    searchInput3.disabled = true;
    if (chooseFile.value) { readFile(); }
});

// ~~~ Hide Controls ~~~
hideControls.addEventListener('click', () => {
    if (controls.style.display != 'none') {
        controls.style.display = 'none';
    } else {
        controls.style.display = 'block';
    }
    
});
hideColumnControls.addEventListener('click', () => {
    if (columnControls.style.display != 'none') {
        columnControls.style.display = 'none';
    } else {
        columnControls.style.display = 'block';
    }
});

// ~~~ Second & Third Search Hiders ~~~
secondSearchHider.addEventListener('click', () => {
    if (secondSearch.style.display == 'block') {
        secondSearch.style.display = 'none';
        secondSearchHider.innerHTML = '<path d="M1,6 L11,6 M6,1 L6,11" />';
    } else {
        secondSearch.style.display = 'block';
        secondSearchHider.innerHTML = '<path d="M1,6 L11,6" />';
    }
});
thirdSearchHider.addEventListener('click', () => {
    if (thirdSearch.style.display == 'block') {
        thirdSearch.style.display = 'none';
        thirdSearchHider.innerHTML = '<path d="M1,6 L11,6 M6,1 L6,11" />';
    } else {
        thirdSearch.style.display = 'block';
        thirdSearchHider.innerHTML = '<path d="M1,6 L11,6" />';
    }
});

// ~~~ Light and Dark Mode Controls ~~~
lightControl.addEventListener('mouseover', () => {
    if (lightControl.classList.contains('is-dark')) {
        lightControl.style.opacity = '1';
    }
});
lightControl.addEventListener('mouseout', () => {
    if (lightControl.classList.contains('is-dark')) {
        lightControl.style.opacity = '0.5';
    }
});
lightControl.addEventListener('click', () => {
    if (lightControl.classList.contains('is-dark')) {
        lightControl.classList.replace('is-dark', 'is-light');
        lightControl.style.backgroundColor = 'steelblue';
        lightControl.style.stroke = 'khaki';
        lightControl.style.fill = 'khaki';
        lightControl.style.opacity = '1';
        darkControl.classList.replace('is-dark', 'is-light');
        darkControl.style.backgroundColor = '#384a73';
        darkControl.style.fill = 'orange';
        darkControl.style.opacity = '0.5';
        enforceLightDarkMode();
        enforceHilites();
    }
});

darkControl.addEventListener('mouseover', () => {
    if (darkControl.classList.contains('is-light')) {
        darkControl.style.opacity = '1';
    }
});
darkControl.addEventListener('mouseout', () => {
    if (darkControl.classList.contains('is-light')) {
        darkControl.style.opacity = '0.5';
    }
});
darkControl.addEventListener('click', () => {
    if (darkControl.classList.contains('is-light')) {
        darkControl.classList.replace('is-light', 'is-dark');
        darkControl.style.backgroundColor = 'steelblue';
        darkControl.style.fill = 'khaki';
        darkControl.style.opacity = '1';
        lightControl.classList.replace('is-light', 'is-dark');
        lightControl.style.backgroundColor = '#384a73';
        lightControl.style.stroke = 'orange';
        lightControl.style.fill = 'orange';
        lightControl.style.opacity = '0.5';
        enforceLightDarkMode();
        enforceHilites();
    }
});


// ~~~~~~~~~~ SEARCH 1 ~~~~~~~~~~

// ~~~ Filter Control 1 ~~~
filterControl1.addEventListener('change', () => {
    if (filterControl1.checked) {
        searchRow1.style.display = 'none';
        filterRow1.style.display = 'inline-block';
        filterMinSpan1.style.display = 'inline-block';
        if (columnSelection1.innerHTML !== "") { 
            populateFilterValues('1', filterMin1.value); 
        }
    } else {
        searchRow1.style.display = 'block';
        filterRow1.style.display = 'none';
        filterMinSpan1.style.display = 'none';
    }
});

filterMin1.addEventListener('keypress', (e) => {
    if (!/^\d$/.test(e.key)) { e.preventDefault(); }
});
filterMin1.addEventListener('focusout', () => {
    if (filterMin1.value <= 0) { filterMin1.value = '1'; }
});
filterMin1.addEventListener('input', () => {
    if (columnSelection1.value && columnSelection1.value !== '(none)') {
        populateFilterValues('1', filterMin1.value);
    }
});

// ~~~ Search Type 1 ~~~
// Selecting "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection1.addEventListener('change', () => {
    if (regexSelection1.checked) {
        caseSensitive1.checked = true;
        fullWords1.checked = false;
        fullWords1.disabled = true;
        matchWhere1.disabled = true;
    } else {
        caseSensitive1.checked = false;
        fullWords1.checked = true;
        fullWords1.disabled = false;
        matchWhere1.disabled = false;
    }
});

// ~~~ Match Where 1 ~~~
matchWhere1.addEventListener('change', () => {
    let value = matchWhere1.value;
    if (value == 'match-entire-1') {
        fullWords1.disabled = true;
        concordanceDisplay1.disabled = true;
        concordanceCutoff1.disabled = true;
        regexSelection1.disabled = true;
        findall1.disabled = true;
        findall1.checked = false;
    } else if (['match-beginning-1', 'match-end-1'].includes(value)) {
        fullWords1.disabled = false;
        concordanceDisplay1.disabled = false;
        concordanceCutoff1.disabled = false;
        regexSelection1.disabled = true;
        findall1.disabled = true;
        findall1.checked = false;
    } else if (value == 'match-anywhere-1') {
        fullWords1.disabled = false;
        concordanceDisplay1.disabled = false;
        concordanceCutoff1.disabled = false;
        regexSelection1.disabled = false;
        findall1.disabled = false;
    }
});

// ~~~ Concordance Cutoff 1 ~~~
concordanceDisplay1.addEventListener('change', () => {
    if (concordanceDisplay1.checked) {
        concordanceCutoff1.disabled = false;
    } else {
        concordanceCutoff1.disabled = true;
    }
});

// ~~~ Findall 1 ~~~
findall1.addEventListener('change', () => {
    if (findall1.checked) {
        concordanceDisplay1.checked = false;
        concordanceDisplay1.disabled = true;
        concordanceCutoff1.disabled = true;
        matchWhere1.value = 'match-anywhere-1';
    } else {
        concordanceDisplay1.checked = true;
        concordanceDisplay1.disabled = false;
        concordanceCutoff1.disabled = false;
        if (regexSelection1.checked == false) {
            matchWhere1.disabled = false;
        }
    }
});

// ~~~ Column Selection 1 ~~~
columnSelection1.addEventListener('change', () => {
    if (columnSelection1.value == '(none)') {
        filterSelection1.innerHTML = "";  // Clear filter values
        // Disable all selections
        searchInput1.value = "";
        searchInput1.disabled = true;
        regexSelection1.disabled = true;
        fullWords1.disabled = true;
        caseSensitive1.disabled = true;
        matchWhere1.disabled = true;
        findall1.disabled = true;
        concordanceDisplay1.disabled = true;
        concordanceCutoff1.disabled = true;
        colorPickerDiv1.style.opacity = '0.3';
        bgColorPickerDiv1.style.opacity = '0.3';
        colorPicker1.disabled = true;
        bgColorPicker1.disabled = true;
        if (columnSelection2.value == '(none)' && 
            columnSelection3.value == '(none)') 
        { 
            searchButton.disabled = true; 
        }
    } else {
        // Populate filter values if "Filter by value" checked
        if (filterControl1.checked) { 
            populateFilterValues('1', filterMin1.value); 
        }
        // Enable all selections
        searchInput1.disabled = false;
        regexSelection1.disabled = false;
        fullWords1.disabled = false;
        caseSensitive1.disabled = false;
        matchWhere1.disabled = false;
        findall1.disabled = false;
        concordanceDisplay1.disabled = false;
        if (concordanceDisplay1.checked) { 
            concordanceCutoff1.disabled = false; 
        }
        colorPickerDiv1.style.opacity = '1';
        bgColorPickerDiv1.style.opacity = '1';
        colorPicker1.disabled = false;
        bgColorPicker1.disabled = false;
        searchButton.disabled = false;
        resetButton.disabled = false;
    }
    columnSelection2.childNodes.forEach((node) => {
        if (node.value !== '(none)') {
            node.disabled = [columnSelection1.value, 
                             columnSelection3.value].includes(node.value);
        }
    });
    columnSelection3.childNodes.forEach((node) => {
        if (node.value !== '(none)') {
            node.disabled = [columnSelection1.value,
                             columnSelection2.value].includes(node.value);
        }
    });
});

// ~~~ Color Pickers 1 ~~~
colorPicker1.addEventListener('change', () => {
    let newColor = colorPicker1.value;
    colorPickerDiv1.style.backgroundColor = newColor;
    let hilitedOnes = document.getElementsByClassName('hilite1');
    Array.from(hilitedOnes).forEach((el) => {
        el.style.color = newColor;
    });
});
colorPickerDiv1.style.backgroundColor = colorPicker1.value;

bgColorPicker1.addEventListener('change', () => {
    let newColor = bgColorPicker1.value;
    bgColorPickerDiv1.style.backgroundColor = newColor;
    let hilitedOnes = document.getElementsByClassName('hilite1');
    Array.from(hilitedOnes).forEach((el) => {
        el.style.backgroundColor = newColor; 
    });
});
bgColorPickerDiv1.style.backgroundColor = bgColorPicker1.value;


// ~~~~~~~~~~ SEARCH 2 ~~~~~~~~~~

// ~~~ Filter Control 2 ~~~
filterControl2.addEventListener('change', () => {
    if (filterControl2.checked) {
        searchRow2.style.display = 'none';
        filterRow2.style.display = 'inline-block';
        filterMinSpan2.style.display = 'inline-block';
        if (columnSelection2.innerHTML !== "") { 
            populateFilterValues('2', filterMin2.value); 
        }
    } else {
        searchRow2.style.display = 'block';
        filterRow2.style.display = 'none';
        filterMinSpan2.style.display = 'none';
    }
});
filterMin2.addEventListener('keypress', (e) => {
    if (!/^\d$/.test(e.key)) { e.preventDefault(); }
});
filterMin2.addEventListener('focusout', () => {
    if (filterMin2.value <= 0) { filterMin2.value = '1'; }
});
filterMin2.addEventListener('input', () => {
    if (columnSelection2.value && columnSelection2.value !== '(none)') {
        populateFilterValues('2', filterMin2.value);
    }
});

// ~~~ Search Type 2 ~~~
// Selecting "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection2.addEventListener('change', () => {
    if (regexSelection2.checked) {
        caseSensitive2.checked = true;
        fullWords2.checked = false;
        fullWords2.disabled = true;
        matchWhere2.disabled = true;
    } else {
        caseSensitive2.checked = false;
        fullWords2.checked = true;
        fullWords2.disabled = false;
        matchWhere2.disabled = false;
    }
});

// ~~~ Match Where 2 ~~~
matchWhere2.addEventListener('change', () => {
    let value = matchWhere2.value;
    if (value == 'match-entire-2') {
        fullWords2.disabled = true;
        concordanceDisplay2.disabled = true;
        concordanceCutoff2.disabled = true;
        regexSelection2.disabled = true;
        findall2.disabled = true;
        findall2.checked = false;
    } else if (['match-beginning-2', 'match-end-2'].includes(value)) {
        fullWords2.disabled = false;
        concordanceDisplay2.disabled = false;
        concordanceCutoff2.disabled = false;
        regexSelection2.disabled = true;
        findall2.disabled = true;
        findall2.checked = false;
    } else if (value == 'match-anywhere-2') {
        fullWords2.disabled = false;
        concordanceDisplay2.disabled = false;
        concordanceCutoff2.disabled = false;
        regexSelection2.disabled = false;
        findall2.disabled = false;
    }
});

// ~~~ Concordance Cutoff 2 ~~~
concordanceDisplay2.addEventListener('change', () => {
    if (concordanceDisplay2.checked) {
        concordanceCutoff2.disabled = false;
    } else {
        concordanceCutoff2.disabled = true;
    }
});

// ~~~ Findall 2 ~~~
findall2.addEventListener('change', () => {
    if (findall2.checked) {
        concordanceDisplay2.checked = false;
        concordanceDisplay2.disabled = true;
        concordanceCutoff2.disabled = true;
        matchWhere2.value = 'match-anywhere-2';
    } else {
        concordanceDisplay2.checked = true;
        concordanceDisplay2.disabled = false;
        concordanceCutoff2.disabled = false;
        if (regexSelection2.checked == false) {
            matchWhere2.disabled = false;
        }
    }
});

// ~~~ Column Selection 2 ~~~
columnSelection2.addEventListener('change', () => {
    if (columnSelection2.value == '(none)') {
        filterSelection2.innerHTML = "";  // Clear filter values
        // Disable all selections
        searchInput2.value = "";
        searchInput2.disabled = true;
        regexSelection2.disabled = true;
        fullWords2.disabled = true;
        caseSensitive2.disabled = true;
        matchWhere2.disabled = true;
        findall2.disabled = true;
        concordanceDisplay2.disabled = true;
        concordanceCutoff2.disabled = true;
        colorPickerDiv2.style.opacity = '0.3';
        bgColorPickerDiv2.style.opacity = '0.3';
        colorPicker2.disabled = true;
        bgColorPicker2.disabled = true;
        if (columnSelection1.value == '(none)' &&
            columnSelection3.value == '(none)') 
        { 
            searchButton.disabled = true; 
        }
    } else {
        // Populate filter values if "Filter by value" checked
        if (filterControl2.checked) { 
            populateFilterValues('2', filterMin2.value); 
        }
        // Enable all selections
        searchInput2.disabled = false;
        regexSelection2.disabled = false;
        fullWords2.disabled = false;
        caseSensitive2.disabled = false;
        matchWhere2.disabled = false;
        findall2.disabled = false;
        concordanceDisplay2.disabled = false;
        if (concordanceDisplay2.checked) { 
            concordanceCutoff2.disabled = false; 
        }
        colorPickerDiv2.style.opacity = '1';
        bgColorPickerDiv2.style.opacity = '1';
        colorPicker2.disabled = false;
        bgColorPicker2.disabled = false;
        searchButton.disabled = false;
        resetButton.disabled = false;
    }
    columnSelection1.childNodes.forEach((node) => {
        if (node.value !== '(none)') {
            node.disabled = [columnSelection2.value, 
                             columnSelection3.value].includes(node.value);
        }
    });
    columnSelection3.childNodes.forEach((node) => {
        if (node.value !== '(none)') {
            node.disabled = [columnSelection1.value, 
                             columnSelection2.value].includes(node.value);
        }
    });
});

// ~~~ Color Pickers 2 ~~~
colorPicker2.addEventListener('change', () => {
    let newColor = colorPicker2.value;
    colorPickerDiv2.style.backgroundColor = newColor;
    let hilitedTwos = document.getElementsByClassName('hilite2');
    Array.from(hilitedTwos).forEach((el) => {
        el.style.color = newColor;
    });
    secondSearchHider.style.stroke = newColor;
});
colorPickerDiv2.style.backgroundColor = colorPicker2.value;

bgColorPicker2.addEventListener('change', () => {
    let newColor = bgColorPicker2.value;
    bgColorPickerDiv2.style.backgroundColor = newColor;
    let hilitedTwos = document.getElementsByClassName('hilite2');
    Array.from(hilitedTwos).forEach((el) => {
        el.style.backgroundColor = newColor;
    });
    secondSearchHider.style.backgroundColor = newColor;
});
bgColorPickerDiv2.style.backgroundColor = bgColorPicker2.value;


// ~~~~~~~~~~ SEARCH 3 ~~~~~~~~~~

// ~~~ Filter Control 3 ~~~
filterControl3.addEventListener('change', () => {
    if (filterControl3.checked) {
        searchRow3.style.display = 'none';
        filterRow3.style.display = 'inline-block';
        filterMinSpan3.style.display = 'inline-block';
        if (columnSelection3.innerHTML !== "") { 
            populateFilterValues('3', filterMin3.value); 
        }
    } else {
        searchRow3.style.display = 'block';
        filterRow3.style.display = 'none';
        filterMinSpan3.style.display = 'none';
    }
});
filterMin3.addEventListener('keypress', (e) => {
    if (!/^\d$/.test(e.key)) { e.preventDefault(); }
});
filterMin3.addEventListener('focusout', () => {
    if (filterMin3.value <= 0) { filterMin3.value = '1'; }
});
filterMin3.addEventListener('input', () => {
    if (columnSelection3.value && columnSelection3.value !== '(none)') {
        populateFilterValues('3', filterMin3.value);
    }
});

// ~~~ Search Type 3 ~~~
// Selecting "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection3.addEventListener('change', () => {
    if (regexSelection3.checked) {
        caseSensitive3.checked = true;
        fullWords3.checked = false;
        fullWords3.disabled = true;
        matchWhere3.disabled = true;
    } else {
        caseSensitive3.checked = false;
        fullWords3.checked = true;
        fullWords3.disabled = false;
        matchWhere3.disabled = false;
    }
});

// ~~~ Match Where 3 ~~~
matchWhere3.addEventListener('change', () => {
    let value = matchWhere3.value;
    if (value == 'match-entire-3') {
        fullWords3.disabled = true;
        concordanceDisplay3.disabled = true;
        concordanceCutoff3.disabled = true;
        regexSelection3.disabled = true;
        findall3.disabled = true;
        findall3.checked = false;
    } else if (['match-beginning-3', 'match-end-3'].includes(value)) {
        fullWords3.disabled = false;
        concordanceDisplay3.disabled = false;
        concordanceCutoff3.disabled = false;
        regexSelection3.disabled = true;
        findall3.disabled = true;
        findall3.checked = false;
    } else if (value == 'match-anywhere-3') {
        fullWords3.disabled = false;
        concordanceDisplay3.disabled = false;
        concordanceCutoff3.disabled = false;
        regexSelection3.disabled = false;
        findall3.disabled = false;
    }
});

// ~~~ Concordance Cutoff 3 ~~~
concordanceDisplay3.addEventListener('change', () => {
    if (concordanceDisplay3.checked) {
        concordanceCutoff3.disabled = false;
    } else {
        concordanceCutoff3.disabled = true;
    }
});

// ~~~ Findall 3 ~~~
findall3.addEventListener('change', () => {
    if (findall3.checked) {
        concordanceDisplay3.checked = false;
        concordanceDisplay3.disabled = true;
        concordanceCutoff3.disabled = true;
        matchWhere3.value = 'match-anywhere-3';
    } else {
        concordanceDisplay3.checked = true;
        concordanceDisplay3.disabled = false;
        concordanceCutoff3.disabled = false;
        if (regexSelection3.checked == false) {
            matchWhere3.disabled = false;
        }
    }
});

// ~~~ Column Selection 3 ~~~
columnSelection3.addEventListener('change', () => {
    if (columnSelection3.value == '(none)') {
        filterSelection3.innerHTML = "";  // Clear filter values
        // Disable all selections
        searchInput3.value = "";
        searchInput3.disabled = true;
        regexSelection3.disabled = true;
        fullWords3.disabled = true;
        caseSensitive3.disabled = true;
        matchWhere3.disabled = true;
        findall3.disabled = true;
        concordanceDisplay3.disabled = true;
        concordanceCutoff3.disabled = true;
        colorPickerDiv3.style.opacity = '0.3';
        bgColorPickerDiv3.style.opacity = '0.3';
        colorPicker3.disabled = true;
        bgColorPicker3.disabled = true;
        if (columnSelection1.value == '(none)' && 
            columnSelection2.value == '(none)') 
        { 
            searchButton.disabled = true; 
        }
    } else {
        // Populate filter values if "Filter by value" checked
        if (filterControl3.checked) { 
            populateFilterValues('3', filterMin3.value); 
        }
        // Enable all selections
        searchInput3.disabled = false;
        regexSelection3.disabled = false;
        fullWords3.disabled = false;
        caseSensitive3.disabled = false;
        matchWhere3.disabled = false;
        findall3.disabled = false;
        concordanceDisplay3.disabled = false;
        if (concordanceDisplay3.checked) { 
            concordanceCutoff3.disabled = false; 
        }
        colorPickerDiv3.style.opacity = '1';
        bgColorPickerDiv3.style.opacity = '1';
        colorPicker3.disabled = false;
        bgColorPicker3.disabled = false;
        searchButton.disabled = false;
        resetButton.disabled = false;
    }
    columnSelection1.childNodes.forEach((node) => {
        if (node.value !== '(none)') {
            node.disabled = [columnSelection2.value,
                             columnSelection3.value].includes(node.value);
        }
    });
    columnSelection2.childNodes.forEach((node) => {
        if (node.value !== '(none)') {
            node.disabled = [columnSelection1.value,
                             columnSelection3.value].includes(node.value);
        }
    });
});

// ~~~ Color Pickers 3 ~~~
colorPicker3.addEventListener('change', () => {
    let newColor = colorPicker3.value;
    colorPickerDiv3.style.backgroundColor = newColor;
    let hilitedThrees = document.getElementsByClassName('hilite3');
    Array.from(hilitedThrees).forEach((el) => { 
        el.style.color = newColor; 
    });
    thirdSearchHider.style.stroke = newColor;
});
colorPickerDiv3.style.backgroundColor = colorPicker3.value;

bgColorPicker3.addEventListener('change', () => {
    let newColor = bgColorPicker3.value;
    bgColorPickerDiv3.style.backgroundColor = newColor;
    let hilitedThrees = document.getElementsByClassName('hilite3');
    Array.from(hilitedThrees).forEach((el) => { 
        el.style.backgroundColor = newColor;
    });
    thirdSearchHider.style.backgroundColor = newColor;
});
bgColorPickerDiv3.style.backgroundColor = bgColorPicker3.value;


// ~~~ Showing controls ~~~
showingStart.addEventListener('keypress', (e) => {
    if (!/^\d$/.test(e.key)) { e.preventDefault(); } 
});
showingStart.addEventListener('focusout', () => {
    if (showingStart.value <= 0) { showingStart.value = 1; }
    if (resultsTotal.textContent !== '_' && 
        Number(showingStart.value) > Number(resultsTotal.textContent)) 
    {
        showingStart.value = resultsTotal.textContent;
    }
    updatePageView();
});
showingStart.addEventListener('input', () => {
    previousPage.disabled = Number(showingStart.value) <= 1;
    veryStart.disabled = Number(showingStart.value) <= 1;
    updatePageView();
});

showRows.addEventListener('keypress', (e) => {
    if (!/^\d$/.test(e.key)) { e.preventDefault(); }
});
showRows.addEventListener('focusout', () => {
    value = Number(showRows.value);
    if (value > 5000) { 
        showRows.value = '5000'; 
    } else if (value <= 0) {
        showRows.value = '1';
    }
});
showRows.addEventListener('input', () => {
    nextPage.disabled = (Number(showingStart.value) + Number(showRows.value) >=
        matchedData.length) || 
        (Number(showingEnd.textContent) >= matchedData.length);
    veryEnd.disabled = (Number(showingStart.value) + Number(showRows.value) >=
        matchedData.length) || 
        (Number(showingEnd.textContent) >= matchedData.length);
    updatePageView();
});

// MutationObserver for showingEnd
const showingEndConfig = { 
    characterData: false, attributes: false, childList: true, subtree: false };
const showingEndCallback = (mutations, observer) => {
    nextPage.disabled = (showingEnd.textContent == '_' || 
                         Number(showingEnd.textContent) >= matchedData.length);
    veryEnd.disabled = (showingEnd.textContent == '_' || 
                        Number(showingEnd.textContent) >= matchedData.length);
};
const showingEndObserver = new MutationObserver(showingEndCallback);
showingEndObserver.observe(showingEnd, showingEndConfig);

previousPage.addEventListener('click', () => {
    let showStart = Number(showingStart.value) - Number(showRows.value);
    if (showStart < 1) { showStart = 1; }
    let showEnd = showStart + Number(showRows.value) - 1;
    if (showEnd > matchedData.length) { showEnd = matchedData.length; }
    showingStart.value = String(showStart);
    showingEnd.textContent = String(showEnd);
    replaceSortableRows();

    previousPage.disabled = showStart <= 1;
    veryStart.disabled = showStart <= 1;
    nextPage.disabled = showEnd >= matchedData.length;
    veryEnd.disabled = showEnd >= matchedData.length;
});
nextPage.addEventListener('click', () => {
    let showStart = Number(showingStart.value) + Number(showRows.value);
    if (showStart > matchedData.length) { showStart = matchedData.length; }
    let showEnd = showStart + Number(showRows.value) - 1;
    if (showEnd > matchedData.length) { showEnd = matchedData.length; }
    showingStart.value = String(showStart);
    showingEnd.textContent = String(showEnd);
    replaceSortableRows();

    previousPage.disabled = showStart <= 1;
    veryStart.disabled = showStart <= 1;
    nextPage.disabled = showEnd >= matchedData.length;
    veryEnd.disabled = showEnd >= matchedData.length;
});
veryStart.addEventListener('click', () => {
    let showStart = 1;
    let showEnd = Number(showRows.value);
    if (showEnd > matchedData.length) { showEnd = matchedData.length; }
    showingStart.value = String(showStart);
    showingEnd.textContent = String(showEnd);
    replaceSortableRows();

    previousPage.disabled = true;
    veryStart.disabled = true;
    nextPage.disabled = showEnd >= matchedData.length;
    veryEnd.disabled = showEnd >= matchedData.length;
});
veryEnd.addEventListener('click', () => {
    let showStart = matchedData.length - Number(showRows.value) + 1;
    if (showStart < 1) { showStart = 1; }
    let showEnd = matchedData.length;
    showingStart.value = String(showStart);
    showingEnd.textContent = String(showEnd);
    replaceSortableRows();

    previousPage.disabled = showStart <= 1;
    veryStart.disabled = showStart <= 1;
    nextPage.disabled = true;
    veryEnd.disabled = true;
});
