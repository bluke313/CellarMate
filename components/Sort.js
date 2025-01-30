export function sort(list, setSortedList, attribute, order = 'desc') {
    const sortedList = [...list].sort((a, b) => {

        if (a[attribute] < b[attribute]) 
            return -1;
        else if (a[attribute > b[attribute]]) 
            return 1;
        else 
            return 0;

    });

    if (order === 'asc') {
        sortedList.reverse();
    }
    
    if (typeof list[0][attribute] === 'number') {
        sortedList.reverse();
    }

    // var i = 0;
    // for (const wine of sortedList) {
    //     console.log(i, wine.variety );
    //     i++;
    // }

    setSortedList(sortedList);
}