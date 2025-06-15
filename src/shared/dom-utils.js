// ------------------------------------------
// 📊 Calculated Value Helpers
// ------------------------------------------

export function setCalculatedValue(id, value) {
    const el = document.getElementById(id);
    if (el) {
        const str = value.toFixed(2);
        el.dataset.value = str;
        el.innerText = `${str} PLN`;
    }
}

export function getCalculatedValue(id) {
    const el = document.getElementById(id);
    return el?.dataset.value ? parseFloat(el.dataset.value) || 0 : 0;
}