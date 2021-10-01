const path = window.require('path')
const ipcRenderer = window.require('electron').ipcRenderer

const year = document.getElementById('year')
const term = document.getElementById('term')
const program = document.getElementById('program')
const totalEnrollementPlanned = document.getElementById('totalEnrollementPlanned')
const plannedStudents = document.getElementById('plannedStudents')
const pattern = document.getElementById('pattern')
const form = document.getElementById('sem')

form.addEventListener('submit', function (event) {
    event.preventDefault()
    let data = {
        year: year.value,
        term: term.value,
        program: program.value,
        tep: totalEnrollementPlanned.value,
        pstud: plannedStudents.value,
        pattern: pattern.value,
    }
    const valid = isValid(data)
    if (valid) {
        ipcRenderer.send('form:send', data)
    } else {
        /**
         * To-Do: Add logic to show invalid fields
         */
        console.log('Invalid')
    }
})

const validator = {
    year: (v) => {
        if (!v || v === '') return false
        return true
    },
    term: (v) => {
        if (!v || v === '') return false
        return true
    },
    program: (v) => {
        if (!v || v === '') return false
        return true
    },
    tep: (v) => {
        if (!v || v === '') return false
        return true
    },
    pstud: (v) => {
        if (!v || v === '') return false
        return true
    },
    pattern: (v) => {
        if (!v || v === '') return false
        return true
    },
}

function isValid(data) {
    if (!data || Object.keys(data).length == 0) return false
    for (key in data) {
        if (!validator[key](data[key])) return false
    }
    return true
}
