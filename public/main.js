"use strict";
const form = document.querySelector("#age-calculator-form");
const day = document.querySelector("#day");
const inputs = form.querySelectorAll('input');
const labels = form.querySelectorAll('label');
const validateDay = (day) => {
    // Regular expression pattern to match a valid day (1-31)
    const pattern = /^(0?[1-9]|[1-2][0-9]|3[01])$/;
    // Test the input against the pattern
    return pattern.test(day);
};
const validateMonth = (month) => {
    const pattern = /^(0?[1-9]|1[0-2])$/;
    return pattern.test(month);
};
const validateYear = (year) => {
    const pattern = /^(19|20)\d{2}$/;
    return pattern.test(year);
};
const validateDate = (day, month, year) => {
    const currentDate = moment().format("YYYY-MM-DD");
    const dateString = `${year}-${month}-${day}`;
    const format = 'YYYY-MM-DD';
    const isValid = moment(dateString, format, true).isValid() && !moment(dateString).isAfter(currentDate);
    return isValid;
};
const checkEmptyField = () => {
    let isValid = false;
    inputs.forEach((input) => {
        const label = input.previousElementSibling;
        const error = input.nextElementSibling;
        if (input.value === '') {
            input.className = "input invalid";
            label.className = "label err";
            error.textContent = "This field is required";
            isValid = false;
        }
        else {
            input.className = "input";
            label.className = "label";
            error.textContent = "";
            isValid = true;
        }
    });
    return isValid;
};
const validateInput = (elements, validationFn) => {
    const { input, label, error, msg } = elements;
    const isValid = validationFn(input.value);
    if (!isValid) {
        input.className = "input invalid";
        error.textContent = msg;
        label.className = "label err";
    }
    else {
        input.className = "input";
        error.textContent = "";
        label.className = "label";
    }
    return isValid;
};
const invalidDay = 'Must be a valid day';
const invalidMonth = 'Must be a valid month';
const invalidYear = 'Must be a valid year';
const validateEachField = () => {
    let isValid = false;
    inputs.forEach((input) => {
        const label = input.previousElementSibling;
        const error = input.nextElementSibling;
        if (input.name === 'day') {
            isValid = validateInput({ input, label, error, msg: invalidDay }, validateDay);
        }
        else if (input.name === 'month') {
            isValid = validateInput({ input, label, error, msg: invalidMonth }, validateMonth);
        }
        else if (input.name === 'year') {
            isValid = validateInput({ input, label, error, msg: invalidYear }, validateYear);
        }
    });
    return isValid;
};
const validateDateExist = () => {
    const day = inputs[0];
    const error = day.nextElementSibling;
    const month = inputs[1];
    const year = inputs[2];
    const isValid = validateDate(day.value, month.value, year.value);
    if (!isValid) {
        day.className = "input invalid";
        labels[0].className = "label err";
        error.textContent = "Must be a valid date";
        month.className = "input invalid";
        labels[1].className = "label err";
        year.className = "input invalid";
        labels[2].className = "label err";
    }
    return isValid;
};
const submitForm = (event) => {
    if (!checkEmptyField())
        return;
    if (!validateEachField())
        return;
    if (!validateDateExist())
        return;
    const day = document.querySelector('#day-result');
    const month = document.querySelector('#month-result');
    const year = document.querySelector('#year-result');
    const hyphens = document.querySelectorAll('.hyphens');
    const birthday = `${inputs[2].value}-${inputs[1].value}-${inputs[0].value}`;
    const age = calculateAge(birthday);
    hyphens.forEach(item => item.classList.add('active'));
    day.textContent = age.days;
    day.className = 'active';
    month.textContent = age.months;
    month.className = 'active';
    year.textContent = age.years;
    year.className = 'active';
    event.preventDefault();
};
function calculateAge(birthday) {
    const today = moment();
    const birthDate = moment(birthday, 'YYYY-MM-DD');
    const years = today.diff(birthDate, 'years');
    birthDate.add(years, 'years');
    const months = today.diff(birthDate, 'months');
    birthDate.add(months, 'months');
    const days = today.diff(birthDate, 'days');
    return {
        years: years,
        months: months,
        days: days
    };
}
