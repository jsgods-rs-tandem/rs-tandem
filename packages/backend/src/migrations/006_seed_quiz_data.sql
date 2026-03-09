-- Categories
INSERT INTO quiz_categories (id, name_en, name_ru, description_en, description_ru) VALUES
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Basic JavaScript',
  'Основы JavaScript',
  'Core JavaScript concepts including variables, functions, closures, and prototypes.',
  'Основные концепции JavaScript: переменные, функции, замыкания и прототипы.'
),
(
  'a1b2c3d4-0002-0002-0002-000000000002',
  'CSS Fundamentals',
  'Основы CSS',
  'Essential CSS concepts including selectors, box model, flexbox, and grid.',
  'Ключевые концепции CSS: селекторы, блочная модель, flexbox и grid.'
)
ON CONFLICT (id) DO NOTHING;

-- Topics for Basic JavaScript
INSERT INTO quiz_topics (id, category_id, name_en, name_ru, description_en, description_ru, links) VALUES
(
  'b1b2c3d4-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Functions & Closures',
  'Функции и замыкания',
  'Understand how functions work in JavaScript, including scope, closures, and higher-order functions.',
  'Понимание работы функций в JavaScript, включая область видимости, замыкания и функции высшего порядка.',
  ARRAY[
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
    'https://javascript.info/closure'
  ]
),
(
  'b1b2c3d4-0002-0002-0002-000000000002',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Prototypes & Inheritance',
  'Прототипы и наследование',
  'Learn how JavaScript''s prototype chain works and how to use class-based and prototypal inheritance.',
  'Изучите работу цепочки прототипов JavaScript и использование классового и прототипного наследования.',
  ARRAY[
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain',
    'https://javascript.info/prototype-inheritance'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Topics for CSS Fundamentals
INSERT INTO quiz_topics (id, category_id, name_en, name_ru, description_en, description_ru, links) VALUES
(
  'b1b2c3d4-0003-0003-0003-000000000003',
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Box Model & Layout',
  'Блочная модель и макет',
  'Master the CSS box model, display types, and positioning to build precise layouts.',
  'Освойте блочную модель CSS, типы отображения и позиционирование для создания точных макетов.',
  ARRAY[
    'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model',
    'https://css-tricks.com/the-css-box-model/'
  ]
),
(
  'b1b2c3d4-0004-0004-0004-000000000004',
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Flexbox',
  'Flexbox',
  'Deep dive into CSS Flexbox for one-dimensional layout control.',
  'Глубокое погружение в CSS Flexbox для управления одномерным макетом.',
  ARRAY[
    'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout',
    'https://css-tricks.com/snippets/css/a-guide-to-flexbox/'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Questions for "Functions & Closures" topic
INSERT INTO quiz_questions (id, topic_id, sort_order, name_en, name_ru, code_snippet, explanation_en, explanation_ru) VALUES
(
  'c1b2c3d4-0001-0001-0001-000000000001',
  'b1b2c3d4-0001-0001-0001-000000000001',
  1,
  'What is a closure in JavaScript?',
  'Что такое замыкание в JavaScript?',
  NULL,
  'A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned.',
  'Замыкание — это функция, которая сохраняет доступ к переменным из внешней (охватывающей) области видимости даже после того, как внешняя функция завершила выполнение.'
),
(
  'c1b2c3d4-0002-0002-0002-000000000002',
  'b1b2c3d4-0001-0001-0001-000000000001',
  2,
  'What will the following code output?',
  'Что выведет следующий код?',
  'function makeCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}
const counter = makeCounter();
console.log(counter()); // ?
console.log(counter()); // ?',
  'Each call to the returned function increments and returns the shared `count` variable. The output is 1, then 2.',
  'Каждый вызов возвращённой функции увеличивает и возвращает общую переменную `count`. Результат: 1, затем 2.'
),
(
  'c1b2c3d4-0003-0003-0003-000000000003',
  'b1b2c3d4-0001-0001-0001-000000000001',
  3,
  'What is the difference between `var`, `let`, and `const`?',
  'В чём разница между `var`, `let` и `const`?',
  NULL,
  '`var` is function-scoped and hoisted. `let` and `const` are block-scoped. `const` cannot be reassigned after declaration.',
  '`var` имеет область видимости функции и поднимается. `let` и `const` имеют блочную область видимости. `const` нельзя переназначить после объявления.'
),
(
  'c1b2c3d4-0004-0004-0004-000000000004',
  'b1b2c3d4-0001-0001-0001-000000000001',
  4,
  'What is hoisting in JavaScript?',
  'Что такое всплытие (hoisting) в JavaScript?',
  NULL,
  'Hoisting is the behavior where variable and function declarations are moved to the top of their containing scope during compilation.',
  'Всплытие — это поведение, при котором объявления переменных и функций перемещаются в начало содержащей их области видимости во время компиляции.'
),
(
  'c1b2c3d4-0005-0005-0005-000000000005',
  'b1b2c3d4-0001-0001-0001-000000000001',
  5,
  'What does the following code output?',
  'Что выведет следующий код?',
  'for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}',
  'Because `var` is function-scoped and the loop completes before the callbacks run, all three callbacks print the final value of `i`, which is 3.',
  'Поскольку `var` имеет область видимости функции и цикл завершается до запуска колбэков, все три колбэка выводят финальное значение `i`, равное 3.'
)
ON CONFLICT (id) DO NOTHING;

-- Answers for question 1 (What is a closure?)
INSERT INTO quiz_answers (id, question_id, text_en, text_ru, is_correct) VALUES
('d1b2c3d4-0001-0001-0001-000000000001', 'c1b2c3d4-0001-0001-0001-000000000001',
  'A function that retains access to its outer scope variables after the outer function returns',
  'Функция, сохраняющая доступ к переменным внешней области видимости после завершения внешней функции',
  true),
('d1b2c3d4-0001-0001-0001-000000000002', 'c1b2c3d4-0001-0001-0001-000000000001',
  'A function that runs immediately upon definition',
  'Функция, выполняющаяся сразу после определения',
  false),
('d1b2c3d4-0001-0001-0001-000000000003', 'c1b2c3d4-0001-0001-0001-000000000001',
  'A function that cannot access variables from other scopes',
  'Функция, которая не может получить доступ к переменным из других областей видимости',
  false),
('d1b2c3d4-0001-0001-0001-000000000004', 'c1b2c3d4-0001-0001-0001-000000000001',
  'A method defined inside a class',
  'Метод, определённый внутри класса',
  false)
ON CONFLICT (id) DO NOTHING;

-- Answers for question 2 (makeCounter output)
INSERT INTO quiz_answers (id, question_id, text_en, text_ru, is_correct) VALUES
('d1b2c3d4-0002-0002-0002-000000000001', 'c1b2c3d4-0002-0002-0002-000000000002',
  '1, 2',
  '1, 2',
  true),
('d1b2c3d4-0002-0002-0002-000000000002', 'c1b2c3d4-0002-0002-0002-000000000002',
  '0, 1',
  '0, 1',
  false),
('d1b2c3d4-0002-0002-0002-000000000003', 'c1b2c3d4-0002-0002-0002-000000000002',
  '1, 1',
  '1, 1',
  false),
('d1b2c3d4-0002-0002-0002-000000000004', 'c1b2c3d4-0002-0002-0002-000000000002',
  'undefined, undefined',
  'undefined, undefined',
  false)
ON CONFLICT (id) DO NOTHING;

-- Answers for question 3 (var/let/const)
INSERT INTO quiz_answers (id, question_id, text_en, text_ru, is_correct) VALUES
('d1b2c3d4-0003-0003-0003-000000000001', 'c1b2c3d4-0003-0003-0003-000000000003',
  '`var` is function-scoped and hoisted; `let`/`const` are block-scoped; `const` cannot be reassigned',
  '`var` имеет область видимости функции и всплывает; `let`/`const` блочные; `const` нельзя переназначить',
  true),
('d1b2c3d4-0003-0003-0003-000000000002', 'c1b2c3d4-0003-0003-0003-000000000003',
  'They are all identical in behavior',
  'Они все одинаковы по поведению',
  false),
('d1b2c3d4-0003-0003-0003-000000000003', 'c1b2c3d4-0003-0003-0003-000000000003',
  '`const` is hoisted but `let` and `var` are not',
  '`const` всплывает, но `let` и `var` — нет',
  false),
('d1b2c3d4-0003-0003-0003-000000000004', 'c1b2c3d4-0003-0003-0003-000000000003',
  '`let` and `var` are function-scoped; `const` is block-scoped',
  '`let` и `var` имеют область видимости функции; `const` — блочную',
  false)
ON CONFLICT (id) DO NOTHING;

-- Answers for question 4 (hoisting)
INSERT INTO quiz_answers (id, question_id, text_en, text_ru, is_correct) VALUES
('d1b2c3d4-0004-0004-0004-000000000001', 'c1b2c3d4-0004-0004-0004-000000000004',
  'Variable and function declarations are moved to the top of their scope during compilation',
  'Объявления переменных и функций перемещаются в начало их области видимости во время компиляции',
  true),
('d1b2c3d4-0004-0004-0004-000000000002', 'c1b2c3d4-0004-0004-0004-000000000004',
  'The process of converting a function to an arrow function',
  'Процесс преобразования функции в стрелочную функцию',
  false),
('d1b2c3d4-0004-0004-0004-000000000003', 'c1b2c3d4-0004-0004-0004-000000000004',
  'When a variable is shared between multiple functions',
  'Когда переменная используется несколькими функциями одновременно',
  false),
('d1b2c3d4-0004-0004-0004-000000000004', 'c1b2c3d4-0004-0004-0004-000000000004',
  'When a function calls itself recursively',
  'Когда функция вызывает саму себя рекурсивно',
  false)
ON CONFLICT (id) DO NOTHING;

-- Answers for question 5 (var loop setTimeout)
INSERT INTO quiz_answers (id, question_id, text_en, text_ru, is_correct) VALUES
('d1b2c3d4-0005-0005-0005-000000000001', 'c1b2c3d4-0005-0005-0005-000000000005',
  '3, 3, 3',
  '3, 3, 3',
  true),
('d1b2c3d4-0005-0005-0005-000000000002', 'c1b2c3d4-0005-0005-0005-000000000005',
  '0, 1, 2',
  '0, 1, 2',
  false),
('d1b2c3d4-0005-0005-0005-000000000003', 'c1b2c3d4-0005-0005-0005-000000000005',
  '1, 2, 3',
  '1, 2, 3',
  false),
('d1b2c3d4-0005-0005-0005-000000000004', 'c1b2c3d4-0005-0005-0005-000000000005',
  'undefined, undefined, undefined',
  'undefined, undefined, undefined',
  false)
ON CONFLICT (id) DO NOTHING;
