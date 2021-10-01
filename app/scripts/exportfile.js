// const XLSX = require('xlsx')
const XLSX = require('exceljs')
const { CONSTANTS } = require('./contansts')

exports.export = function (payload) {
    let courses = payload.courses
    courses = courses.map((course) => {
        course.patt = course.pattern.split('-')
        return course
    })
    // console.log(courses)
    /*x = {
        year: year.value,
        term: term.value,
        program: program.value,
        tep: totalEnrollementPlanned.value,
        pstud: plannedStudents.value,
        pattern: pattern.value,
    }*/
    // let courses = CONSTANTS.TERMS[Number(payload.term.slice(-1))] // fetch courses for term
    let total_sections = Math.ceil(payload.tep / payload.pstud) // calculate no. of sections required
    let sections = []
    for (let i = 1; i <= total_sections; i++) sections.push('00' + i) // generate sections

    let layouts = []
    for (let j = 0; j < courses.length; j++) {
        let course = courses[j]
        for (let i = 0; i < sections.length; i++) {
            let layout = []
            layout.push(course.id)
            layout.push(sections[i])
            layout.push(payload.pstud)
            layout.push('Lecture - Faculty')
            layout.push(course.patt[0])
            layout.push(course.pattern)
            layout.push('Classroom with WiFi')
            layout.push('')
            layout.push('')
            layout.push('')
            if (course.patt.length > 1) {
                layouts.push(layout)
                layout = []
                // layout.push(course.id)
                layout.push('')
                layout.push(sections[i])
                layout.push(payload.pstud)
                layout.push('Lab - Faculty')
                layout.push(course.patt[1])
                layout.push(course.pattern)
                layout.push('Classroom with WiFi')
                layout.push('')
                layout.push('')
                layout.push('')
            }
            layouts.push(layout)
        }
    }
    payload['rows'] = layouts
    const xls = new ExcelGenerator(payload)
    xls.init()
    xls.process()
}

class ExcelGenerator {
    #wb = null
    payload = null
    constructor(payload) {
        this.#wb = new XLSX.Workbook()
        this.payload = payload
    }
    init() {
        this.#wb.creator = 'dab.loader'
        this.#wb.lastModifiedBy = 'dab.loader'
        this.#wb.created = new Date()
        this.#wb.modified = new Date()
        this.#wb.lastPrinted = new Date()
    }
    #addTable(ws) {
        ws.addTable({
            name: 'Semster Loading',
            ref: 'A10',
            headerRow: true,
            columns: [
                { name: 'Course ID' },
                { name: 'Section' },
                { name: 'Planned Students' },
                { name: 'Component' },
                { name: 'Hours/Week' },
                { name: 'Pattern' },
                { name: 'Room Type' },
                { name: 'Final Exam?' },
                { name: 'Recommended Instructor' },
                { name: 'Comments' },
            ],
            rows: this.payload.rows,
        })
    }
    #addInfo(ws) {
        let cell = ws.getCell('A1')
        cell.value = CONSTANTS.COURSE_NAME

        cell = ws.getCell('A3')
        cell.value = CONSTANTS.COLLEGE_NAME

        cell = ws.getCell('A5')
        cell.value = 'Program:'
        cell = ws.getCell('B5')
        cell.value = this.payload.program

        cell = ws.getCell('A6')
        cell.value = 'Campus:'

        cell = ws.getCell('B6')
        cell.value = CONSTANTS.CAMPUS

        cell = ws.getCell('A8')
        cell.value = this.payload.term

        cell = ws.getCell('J6')
        cell.value = 'YEAR: ' + this.payload.year
    }
    #beautify(ws) {
        ws.getCell('A1').font = { size: 16, bold: true }
        ws.getCell('A3').font = { size: 12, bold: true }
        ws.getCell('A5').font = { size: 12, bold: true }
        ws.getCell('B5').font = { size: 12, bold: true }
        ws.getCell('A6').font = { size: 12, bold: true }
        ws.getCell('B6').font = { size: 12, bold: true }
        ws.getCell('A8').font = { size: 12, bold: true }
        ws.getCell('J6').font = { size: 12, bold: true }
    }
    process() {
        let ws = this.#wb.addWorksheet(this.payload.term)
        this.#addTable(ws)
        this.#addInfo(ws)
        this.#beautify(ws)
        this.#save()
    }
    #save() {
        this.#wb.xlsx.writeFile('aa.xlsx')
    }
}

/*const xl = new ExcelGenerator({
    term: 'AAL01',
    rows: [['DAB100 - Introduction To Data Analytics', '001', 40, 'Lecture - Faculty', 3, 3, 'Classroom with WiFi', '', '', '']],
    program: 'B018',
    year: '2021',
    term: 'AAL01',
})
xl.init()
xl.process()*/

this.export({
    year: '2021',
    term: 'AAL01',
    program: 'B018',
    tep: 80,
    pstud: 40,
    courses: [
        { id: 'DAB100 - Introduction To Data Analytics', pattern: '3' },
        { id: 'DAB501 - Basic Statistics And Exploratory Data Analysis', pattern: '3-2' },
        { id: 'DAB101 - Introduction To Artificial Intelligence', pattern: '2' },
        { id: 'DAB102 - Information Management', pattern: '1-2' },
        { id: 'DAB103 - Analytic Tools And Decision Making', pattern: '3-2' },
    ],
})
