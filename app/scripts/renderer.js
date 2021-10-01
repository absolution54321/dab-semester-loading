const path = window.require('path')
const ipcRenderer = window.require('electron').ipcRenderer
// const dialog = window.require('electron').dialog

const year = document.getElementById('year')
const term = document.getElementById('term')
const program = document.getElementById('program')
const totalEnrollementPlanned = document.getElementById('totalEnrollementPlanned')
const plannedStudents = document.getElementById('plannedStudents')
// const pattern = document.getElementById('pattern')
const form = document.getElementById('sem')

const search = document.getElementById('search')

const reset = document.getElementById('reset')

let terms = {
    1: document.getElementById('term1'),
    2: document.getElementById('term2'),
    3: document.getElementById('term3'),
    4: document.getElementById('term4'),
}
let COURSES = {
    1: [
        document.getElementById('DAB100 - Introduction To Data Analytics'),
        document.getElementById('DAB501 - Basic Statistics And Exploratory Data Analysis'),
        document.getElementById('DAB101 - Introduction To Artificial Intelligence'),
        document.getElementById('DAB102 - Information Management'),
        document.getElementById('DAB103 - Analytic Tools And Decision Making'),
    ],
    2: [
        document.getElementById('DAB200 - Machine Learning I'),
        document.getElementById('DAB201 - Data Visualization And Reporting'),
        document.getElementById('DAB502 - Advanced Statistics For Data Analytics'),
        document.getElementById('DAB202 - IT Service Management'),
        document.getElementById('DAB203 - Business Analytics And Decision Making'),
    ],
    3: [
        document.getElementById('DAB300 - Machine Learning II'),
        document.getElementById('DAB301 - Project Management Analytics'),
        document.getElementById('DAB302 - Ethics For Analytics'),
        document.getElementById('DAB303 - Marketing Analytics'),
        document.getElementById('DAB304 - Healthcare Analytics'),
    ],
    4: [
        document.getElementById('DAB400 - Supply Chain Analytics'),
        document.getElementById('DAB401 - Financial Analytics'),
        document.getElementById('DAB402 - Capstone Project'),
    ],
}

let options = {
    title: 'Export to',
    defaultPath: `C:\\Documents\\${Date.now()}.xlsx`,
    buttonLabel: 'Save',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
}

form.addEventListener('submit', function (event) {
    event.preventDefault()
    let data = {
        year: year.value,
        term: term.value,
        program: program.value,
        tep: totalEnrollementPlanned.value,
        pstud: plannedStudents.value,
        // pattern: pattern.value,
    }
    const valid = isValid(data)
    let term_val = term.value
    term_val = term_val.slice(-1)
    let courses = buildCourses(COURSES[term_val])
    data['courses'] = courses
    // console.log('Courses', courses)
    if (valid) {
        // console.log('valid')
        // console.log(data)
        ipcRenderer.send('form:send', data)
    } else {
        /**
         * To-Do: Add logic to show invalid fields
         */
        console.log('Invalid')
    }
})

/*ipcRenderer.on('form:reply', function (e, filename) {
    dialog.showMessageBox(`Your file is saved on ${filename}`)
})*/

function buildCourses(courses) {
    let invalid = courses.filter((course) => {
        return course.value === '' || course.value == undefined || course.value == null
    })
    if (invalid.length > 0) {
        invalid.forEach((course) => {
            course.classList.remove('valid')
            course.classList.add('invalid')
        })
    } else {
        return courses.map((course) => {
            return { id: course.id, pattern: course.value }
        })
    }
}
/**
 * searh for courses
 */
search.addEventListener('click', function (event) {
    for (let term in terms) terms[term].style = 'display: none;'
    let term_val = term.value
    term_val = term_val.slice(-1)
    // console.log('term_val', term_val)
    if (term_val === '') {
        term.classList.remove('valid')
        term.classList.add('invalid')
    }
    terms[term_val].style = ''
})

/**
 * Resert all fields
 */
reset.addEventListener('click', function (event) {
    for (let term in terms) terms[term].style = 'display: none;'
    for (let courses in COURSES) for (let course in courses) course.value = ''
    year.value = ''
    term.value = ''
    program.value = ''
    totalEnrollementPlanned.value = ''
    plannedStudents.value = ''
})

/**
 * Validators
 */
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
