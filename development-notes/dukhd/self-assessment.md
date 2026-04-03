# Self-Assessment: Diana Dukhovskaya
**GitHub:** [dukhd](https://github.com/dukhd)  
**Pull Request:** [link](https://github.com/jsgods-rs-tandem/rs-tandem/pull/205)  
**Total self score:** 215

## 📋 Personal Features Table

|**Category**|**Feature**|**Description**|**PR Link**|**Score**|
|---|---|---|---|---|
|**Setup**|Monorepo Setup (NPM Workspaces)|Orchestrated the project structure for seamless Front/Back development.|[PR #6](https://github.com/jsgods-rs-tandem/rs-tandem/pull/6#issue-3953486564)|—|
|**My Components**|**Rich UI Screen**: Home page + 404|Designed and implemented the home and not found page.|[PR #90](https://github.com/jsgods-rs-tandem/rs-tandem/pull/90#issue-4041335360) [PR #113](https://github.com/jsgods-rs-tandem/rs-tandem/pull/113#issue-4073936925) [PR #141](https://github.com/jsgods-rs-tandem/rs-tandem/pull/141#issue-4084815475)|+20|
|—|Button component|Reusable UI button with multiple variants.|[PR #51](https://github.com/jsgods-rs-tandem/rs-tandem/pull/51#issue-3992409296)|—|
|—|Accordion component|Expandable UI sections for FAQ.|[PR #111](https://github.com/jsgods-rs-tandem/rs-tandem/pull/111#issue-4071915924)|—|
|—|Logo component|Branding component.|[PR #44](https://github.com/jsgods-rs-tandem/rs-tandem/pull/44#issue-3984832564)|—|
|—|Footer component|Informational footer with credentials and github link to the project.|[PR #74](https://github.com/jsgods-rs-tandem/rs-tandem/pull/74#issue-4017856525)|—|
|**My Components**|**Rich UI Screen**: Profile page|User profile with ability edit name, email, password and choose avatar.|[PR #168](https://github.com/jsgods-rs-tandem/rs-tandem/pull/168#issue-4115829300)|+20|
|**My Components**|**Rich UI Screen**: Header + Nav + Sidebar + Mobile Menu|Top bar with logo and language, theme controls. Responsive navigation system with layout-aware states.|[PR #54](https://github.com/jsgods-rs-tandem/rs-tandem/pull/54#issue-3997003823) [PR #70](https://github.com/jsgods-rs-tandem/rs-tandem/pull/70#issue-4016772095) [PR #83](https://github.com/jsgods-rs-tandem/rs-tandem/pull/83#issue-4038287245) [PR #203](https://github.com/jsgods-rs-tandem/rs-tandem/pull/203#issue-4182215878)|+20|
|**My Components**|**Rich UI Screen**: Card component + Team Board|Reusable card component. And built the team section/team page.|[PR #93](https://github.com/jsgods-rs-tandem/rs-tandem/pull/93#issue-4042257707) [PR #98](https://github.com/jsgods-rs-tandem/rs-tandem/pull/98#issue-4045711429)|+20|
|**Backend & Data**|**Custom Backend**: SQL Migrations|Database schema expansion and data synchronization logic. Implemented `ProfilesService` for business logic processing.|[PR #168](https://github.com/jsgods-rs-tandem/rs-tandem/pull/168#issue-4115829300)|+30|
|**Backend & Data**|**Backend Framework**: NestJS | Usage of NestJS|[PR #168](https://github.com/jsgods-rs-tandem/rs-tandem/pull/168#issue-4115829300)|+10|
|**Frameworks**|**Angular**|Usage of Angular.|—|+10|
|**UI & Interaction**|**Theme Switcher**|Light/Dark mode toggle using CSS variables.|[PR #73](https://github.com/jsgods-rs-tandem/rs-tandem/pull/73#issue-4017839235)|+10|
|**UI & Interaction**|**Responsive Design**|Full mobile optimization (down to 320px).|—|+5|
|**UI & Interaction**|**Accessibility (a11y)**|Keyboard navigation and ARIA labels implementation.|—|+10|
|**UI & Interaction**|**Advanced Animations**|Interactive UI elements and smooth page transitions.|[PR #179](https://github.com/jsgods-rs-tandem/rs-tandem/pull/179#issue-4130595410) [PR #190](https://github.com/jsgods-rs-tandem/rs-tandem/pull/190#issue-4161672622)|+10|
|**UI & Interaction**|**i18n**|Multi-language (ru/en) support.|[PR #199](https://github.com/jsgods-rs-tandem/rs-tandem/pull/199#issue-4173516887)|+10|
|**Architecture**|**API Layer**|Abstracted service layer to decouple UI from API logic.|—|+10|
|**Architecture**|**Design Patterns**: Facade Pattern|Used the Facade pattern to simplify state management.|[PR #168](https://github.com/jsgods-rs-tandem/rs-tandem/pull/168#issue-4115829300) [PR #199](https://github.com/jsgods-rs-tandem/rs-tandem/pull/199#issue-4173516887)|+10|
|**Quality**|**Unit Tests (Basic)**|20%+ test coverage for core personal logic.|—|+10|
|**Quality**|**Unit Tests (Full)**|50%+ test coverage including edge cases.|—|+10|
|**TOTAL**||||**215**|


## 🛠 Unit Tests Coverage
<img width="650" height="371" alt="Average Coverage (%)" src="https://github.com/user-attachments/assets/83b2d629-c858-4bf2-a83f-3f363568803d" />
<img width="623" height="714" alt="image" src="https://github.com/user-attachments/assets/b507a4e9-8970-47a9-a414-a53804a640a4" />


## 🛠 Work Description & Feature Components
Этот проект стал для меня точкой профессиональной трансформации: от базовых знаний разметки до создания архитектурно сложного **Full-stack приложения** на стеке **Angular + NestJS**. В роли **Team Lead** и разработчика я прошла через все этапы жизненного цикла ПО: от проектирования инфраструктуры монорепозитория и дизайна в Figma до написания серверной логики и тонкой настройки UX-анимаций. Мой фокус был направлен на чистоту кода, масштабируемость системы и инклюзивность интерфейса.

### 1. Инфраструктура и DevOps

- **Инициализация монорепозитория:** Настроила структуру проекта на базе **NPM Workspaces**, объединив фронтенд (Angular), бэкенд (NestJS) и общие типы (shared).
- **Автоматизация контроля качества:**
    - Внедрена система Git-хуков через **Husky**.
    - **Pre-commit:** автоматическая проверка линтинга (ESLint, Prettier) и типов (typecheck).
    - **Pre-push:** реализован кастомный Bash-скрипт для защиты основной ветки (валидация имен веток, запуск тестов во всех воркспейсах).
    - **Commitlint:** строгий контроль формата сообщений коммитов.
- **Документация:** Создала стандарты разработки для команды, включая структуру папок, правила именования веток и шаблон Pull Request.

### 2. Дизайн и UI-Kit

- **Проектирование:** Разработала в Figma полный [дизайн-макет](https://www.figma.com/design/eK5bfZBxMZEyRYodB8GXZl/Final?node-id=0-1&t=Tk0FvdcgD7aP5Tt5-1) лендинга, и др. Подготовила Style Guide (цвета, типографика, переменные). Описала все переменные в соответствующих scss файлах [PR #39](https://github.com/jsgods-rs-tandem/rs-tandem/pull/39#issue-3977829216) [PR #162](https://github.com/jsgods-rs-tandem/rs-tandem/pull/162#issue-4108706856).
- **Разработка UI-компонентов:**
    - Реализовала «умный» компонент **Button**, автоматически меняющий тег (`button`/`a`) и стили в зависимости от контекста. Решила проблему доступности (A11y) и блокировки неактивных ссылок.
    - Создала переиспользуемые компоненты: **Accordion**, **Logo**, **Card**, **Header** и **Footer**.
    - Внедрена поддержка тем (Light/Dark) с синхронизацией с системными настройками и сохранением в LocalStorage.

### 3. Frontend-разработка и UX

- **Главная страница:** Реализовала лендинг, включающий блоки с описанием проекта, модулей, FAQ и информацией о команде. Построила страницу на базе созданных ранее переиспользуемых компонентов (**Accordion, Logo, Card, Header, Footer**).
- **Адаптивная навигация:** Создала компонент боковой навигации, который меняет набор ссылок в зависимости от статуса авторизации. Реализовала логику трансформации навигации в мобильное меню (бургер-меню) при ширине экрана менее **768px**.
- **Smart Anchor Navigation:** Разработала **ScrollSpy Service** на базе `IntersectionObserver`. Это позволило реализовать плавную якорную навигацию с автоматическим подсвечиванием активного пункта меню при скролле.
- **Страница 404:** Создала кастомную страницу ошибки с контекстной логикой возврата (на главную или в библиотеку) в зависимости от того, залогинен ли пользователь.
- **Страница профиля:** Создала страницу профиля и реализован функционал редактирования данных пользователя (username, email, GitHub, password) и система выбора аватаров с интерактивной каруселью.
- **Анимации:**
    - Использовала **Angular Animations** для мобильного меню и переходов состояний.
    - Внедрена технология **View Transitions** для плавных переходов между страницами (с программным обходом ошибок `AbortError` при прерывании транзакций например при переходе по анчор линкам).
    - Добавлены визуальные эффекты: последовательное появление карточек при скролле и анимация карточки-ссылки на RS School.
- **Интернационализация (i18n):** Реализовала полную локализацию всех мною созданных компонентов (RU/EN), учитывая семантичные **aria-labels** и **alt**-тексты для изображений.

### 4. Backend и архитектура

- **Работа с БД:** Самостоятельно реализовала **SQL-миграции** для расширения схемы базы данных. Добавила новые поля для хранения путей к аватарам и GitHub-аккаунтов, обеспечив консистентность данных.
- **NestJS:** Разработала и интегрировала серверную логику для обработки расширенных данных пользователя.
- **Паттерны проектирования:** Внедрен паттерн **Facade** для управления состоянием профиля. Это позволило полностью изолировать компоненты от логики работы со стором, сделав UI-слой «глупым», что значительно упростило unit-тестирование.
- **Оптимизация:** Реализовала логику кеширования данных на стороне фасада. Это позволило исключить избыточные сетевые запросы (304 Not Modified) и мгновенно отображать данные при повторных переходах на страницу профиля, улучшая UX.

### 5. Контроль качества и командная работа

- **Unit-тестирование:** Обеспечила покрытие более **50%** личного кода тестами на базе **Vitest**. Настроила интерактивную визуализацию покрытия через **Vitest UI**, что помогло оперативно выявлять и закрывать «слепые зоны» в логике. [PR #104](https://github.com/jsgods-rs-tandem/rs-tandem/pull/104#issue-4065869410)
- **Code Review:** Провела серию тщательных ревью для команды, фокусируясь на архитектурной чистоте, переиспользовании стилей и доступности.
- **Team Management (Team Lead):**
    - Координировала выбор технологического стека и декомпозицию задач.
    - Организовывала митинги: от подготовки **Agenda** до фиксации итогов (**Meeting Notes**) и контроля выполнения планов.
    - Осуществляла мониторинг обновлений ТЗ, своевременно информируя команду и адаптируя рабочий процесс.
    - Отвечала за административную часть: заполнение форм, аудит выполнения командных критериев.

