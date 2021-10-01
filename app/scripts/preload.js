const M = require('materialize-css')

window.addEventListener('DOMContentLoaded', function () {
    var elems = document.getElementById('year')
    let date = new Date()
    let curryr = date.getFullYear()
    for (var i = curryr; i <= curryr + 3; i++) {
        let option = document.createElement('option')
        option.value = option.innerHTML = i
        // select.appendChild(option)
        elems.appendChild(option)
    }
    const select = M.FormSelect.init(elems, {})
})
