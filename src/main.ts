interface FormElements {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  error: HTMLSpanElement;
  msg: string
}

type validationFn = (value: string) => boolean

const form = document.querySelector("#age-calculator-form") as HTMLFormElement
const day = document.querySelector("#day") as HTMLInputElement
const inputs = form.querySelectorAll('input') as NodeListOf<HTMLInputElement>
const labels = form.querySelectorAll('label') as NodeListOf<HTMLLabelElement>

const validateDay = (day: string) : boolean => {
  // Regular expression pattern to match a valid day (1-31)
  const pattern = /^(0?[1-9]|[1-2][0-9]|3[01])$/;
  // Test the input against the pattern
  return pattern.test(day)
}

const validateMonth = (month: string) => {
  const pattern = /^(0?[1-9]|1[0-2])$/;
  return pattern.test(month)
}

const validateYear = (year: string) => {
  const pattern = /^(19|20)\d{2}$/;
  return pattern.test(year)
}

declare const moment: any;
const validateDate = (day: string, month: string, year: string) : boolean => {
  const currentDate = moment().format("YYYY-MM-DD");

  const dateString = `${year}-${month}-${day}`
  const format = 'YYYY-MM-DD'
  const isValid = moment(dateString, format, true).isValid() && !moment(dateString).isAfter(currentDate)
  return isValid;
}

const checkEmptyField = () => {
  let isValid = false
  inputs.forEach((input) => {
    const label = input.previousElementSibling as HTMLLabelElement
    const error = input.nextElementSibling as HTMLSpanElement
    if(input.value === '') {
      input.className = "input invalid"
      label.className = "label err"
      error.textContent = "This field is required"
      isValid = false
    }else {
      input.className = "input"
      label.className = "label"
      error.textContent = ""
      isValid = true
    }
  })
  return isValid
}

const validateInput = (elements: FormElements, validationFn: validationFn) => {
  const { input, label, error, msg } = elements;
  const isValid = validationFn(input.value)
  
  if(!isValid) {
    input.className = "input invalid"
    error.textContent = msg
    label.className = "label err"
  }else {
    input.className = "input"
    error.textContent = ""
    label.className = "label"
  }

  return isValid
}
const invalidDay = 'Must be a valid day'
const invalidMonth = 'Must be a valid month'
const invalidYear = 'Must be a valid year'

const validateEachField = () => {
  let isValid = false
  inputs.forEach((input) => {
    const label = input.previousElementSibling as HTMLLabelElement
    const error = input.nextElementSibling as HTMLSpanElement

    if (input.name === 'day') {
      isValid = validateInput({ input, label, error, msg: invalidDay }, validateDay);
    } else if (input.name === 'month') {
      isValid =validateInput({ input, label, error, msg: invalidMonth }, validateMonth);
    } else if (input.name === 'year') {
      isValid = validateInput({ input, label, error, msg: invalidYear }, validateYear);
    } 
  })

  return isValid
}

const validateDateExist = () => {
  const day = inputs[0]
  const error = day.nextElementSibling as HTMLSpanElement
  const month = inputs[1]
  const year = inputs[2]
  const isValid = validateDate(day.value, month.value, year.value)
  if(!isValid) {
    day.className = "input invalid"
    labels[0].className = "label err"
    error.textContent = "Must be a valid date"
    month.className = "input invalid"
    labels[1].className = "label err"
    year.className = "input invalid"
    labels[2].className = "label err"
  }
  return isValid
}

const submitForm = (event: Event) => {
  if (!checkEmptyField()) return;
  if (!validateEachField()) return;
  if (!validateDateExist()) return;
  
  const day = document.querySelector('#day-result') as HTMLSpanElement
  const month = document.querySelector('#month-result') as HTMLSpanElement
  const year = document.querySelector('#year-result') as HTMLSpanElement
  const hyphens = document.querySelectorAll('.hyphens') as NodeListOf<HTMLSpanElement>
  const birthday = `${inputs[2].value}-${inputs[1].value}-${inputs[0].value}`
  const age = calculateAge(birthday)

  hyphens.forEach(item => item.classList.add('active'))
  
  day.textContent = age.days
  day.className = 'active'
  month.textContent = age.months
  month.className = 'active'
  year.textContent = age.years
  year.className = 'active'
  event.preventDefault()
}

function calculateAge(birthday: string) {
  const today = moment()
  const birthDate = moment(birthday, 'YYYY-MM-DD')

  const years = today.diff(birthDate, 'years')
  birthDate.add(years, 'years')

  const months = today.diff(birthDate, 'months')
  birthDate.add(months, 'months')

  const days = today.diff(birthDate, 'days')

  return {
    years: years,
    months: months,
    days: days
  }
}