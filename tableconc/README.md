# TableConc
Version 1.0.0-beta

TableConc is a concordance search tool for tabular data. 

This web tool is designed for users who want to apply search conditions on multiple sets of related data (different columns in a table) for manual inspection and analysis. 

Try out [TableConc](https://ermanh.github.io/tableconc).

## Supported Files
- .csv
- .tsv
- .txt (entire file treated as a single column)
- .json (must contain only one array of objects, non-string values will be stringified)

## Supported Functions
Search
- Apply queries on up to 3 different columns simultaneously (logical AND)
- Regular expressions

Matched pattern display
- Customize text and background highlight colors
- Concordance display
- Limit length of concordance display

Filter
- Filter a column by its values
- Limit filter options by how many times the values occur

Sort
- Sort a column by ascending or descending order
- Sort a concordance column by word position relative to the matched pattern
- Sort the table by the original index in the file

Other table functions
- Select which columns to show
- Adjust the width of data columns
- Change text alignment
- Customize the number of rows displayed

Website display
- Light/dark modes
- Hide certain sections to increase data viewing space
- Table header sticks to the top of the viewport when scrolled
