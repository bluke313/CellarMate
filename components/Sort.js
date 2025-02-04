// generic sorter
export function sort(list, attribute, order = 'desc') {

    var secondAttribute = 'rating';
    if (secondAttribute === attribute) {
        secondAttribute = 'id';
    }
    
    const sortedList = [...list].sort((a, b) => {
        if (a[attribute] < b[attribute]) {
            // reverse sorting direction for number attributes
            if ((typeof list[0][attribute] === 'number') !== (order === 'asc')) {
                return 1;
            }
            return -1;
        }
        else if (a[attribute] > b[attribute]) {
            // reverse sorting direction for number attributes
            if ((typeof list[0][attribute] === 'number') !== (order === 'asc')) {
                return -1;
            }
            return 1;
        }
        else {
            if (a[secondAttribute] < b[secondAttribute]) {
                // reverse sorting direction for number attributes
                if (typeof list[0][secondAttribute] === 'number') {
                    return 1;
                }
                return -1;
            }
            else if (a[secondAttribute] > b[secondAttribute]) {
                // reverse sorting direction for number attributes
                if (typeof list[0][secondAttribute] === 'number') {
                    return -1;
                }
                return 1;
            }
            else {
                return 0;
            }
        }
    });

    // var i = 0;
    // for (const wine of sortedList) {
    //     console.log(i, wine.variety );
    //     i++;
    // }

    return sortedList;
}