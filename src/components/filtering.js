import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);
export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                        // используйте name как значение и текстовое содержимое
                        let opt = document.createElement("option");
                        opt.setAttribute('value', name);
                        opt.textContent = name;
                        return opt                      // @todo: создать и вернуть тег опции
                      })
        )
     })
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if(action && action.classList && action.classList.contains("clear")){
            const parent = action.parentElement;
            const input = parent.querySelector('input');
            const field = action.dataset.field;
            input.value = '';
            state[field] = '';
        }
        
        // @todo: #4.5 — отфильтровать данные используя компаратор
        
        const from = state.totalFrom !== '' && state.totalFrom != null ? Number(state.totalFrom) : null;
        const to = state.totalTo !== '' && state.totalTo != null ? Number(state.totalTo) : null;

        return data.filter((row) => {
            const total = Number(row.total);

            if (from !== null && total < from) return false;
            if (to !== null && total > to) return false;

            const { totalFrom, totalTo, ...restState } = state;
            return compare(row, restState);
        });
    }
}