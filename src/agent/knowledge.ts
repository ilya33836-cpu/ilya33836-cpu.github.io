import type { ServiceKey } from './types'

export const GREETING =
  'Здравствуйте! Я Nova — AI-консультант. Помогу подобрать подходящий формат проекта, расскажу о демо-работах и подготовлю техническое описание. Что вы хотите разработать?'

export const PRICE_DISCLAIMER =
  'Точная стоимость зависит от функционала и определяется после обсуждения проекта.'

export const DEMO_WARNING =
  'Небольшое предупреждение: демо размещены на бесплатном зарубежном хостинге. Первое открытие может занимать до 20–60 секунд, так как сервер автоматически запускается после простоя.'

export const RENDER_WARNING =
  'Если вход в аккаунт не сработал с первого раза — повторите попытку после полной загрузки сервера. Это особенность бесплатного Render.'

export type ServiceInfo = {
  key: ServiceKey
  name: string
  desc: string
  /** Начальная цена. null — стоимость определяется только после обсуждения. */
  from: string | null
  term: string | null
  functions: string[]
}

export const services: Record<Exclude<ServiceKey, 'unknown'>, ServiceInfo> = {
  landing: {
    key: 'landing',
    name: 'Landing Page',
    desc: 'Современные сайты для малого бизнеса.',
    from: 'от 20 000 ₽',
    term: '5–10 дней',
    functions: ['Главная', 'Услуги', 'Прайс', 'Онлайн-заявка'],
  },
  corporate: {
    key: 'corporate',
    name: 'Корпоративный сайт',
    desc: 'Сайты компаний с несколькими страницами.',
    from: null,
    term: '1–2 недели',
    functions: ['Главная', 'О компании', 'Услуги', 'Кейсы', 'Контакты'],
  },
  webapp: {
    key: 'webapp',
    name: 'Web App',
    desc: 'Веб-приложения с личными кабинетами.',
    from: null,
    term: null,
    functions: ['Личный кабинет', 'Роли и доступы', 'Панель администратора'],
  },
  crm: {
    key: 'crm',
    name: 'Сайт + CRM',
    desc: 'Сайт с админ-панелью, CRM-модулями и личным кабинетом.',
    from: 'от 100 000 ₽',
    term: '2–5 недель',
    functions: ['Клиентская база', 'Воронка продаж', 'Задачи и напоминания', 'Отчёты'],
  },
  saas: {
    key: 'saas',
    name: 'SaaS',
    desc: 'Облачные цифровые платформы.',
    from: null,
    term: '3–8 недель',
    functions: ['Онбординг', 'Доска задач', 'Календарь', 'Аналитика', 'Тарифы'],
  },
  bot: {
    key: 'bot',
    name: 'Telegram-бот',
    desc: 'Автоматизация записи, уведомлений и общения.',
    from: 'от 15 000 ₽',
    term: '1–2 недели',
    functions: ['Запись', 'Напоминания', 'Интеграция с CRM'],
  },
  automation: {
    key: 'automation',
    name: 'Автоматизация бизнеса',
    desc: 'Связываем заявки, CRM, таблицы, почту, Telegram и AI в один процесс.',
    from: 'от 80 000 ₽',
    term: null,
    functions: ['Обработка заявок', 'Интеграция CRM и Telegram', 'Уведомления', 'Отчёты'],
  },
  ai: {
    key: 'ai',
    name: 'AI-агент',
    desc: 'Интеллектуальные консультанты для сайтов и бизнеса.',
    from: null,
    term: '1–3 недели',
    functions: ['Диалог с посетителем', 'Квалификация лидов', 'Отчётность'],
  },
}

export type DemoInfo = {
  title: string
  url: string
  type: string
  note: string
  needsAuth?: boolean
  accounts?: string[]
}

export const demos: Record<string, DemoInfo> = {
  dentaline: {
    title: 'Dentaline',
    url: 'https://ilya33836-cpu.github.io/dentaline-site/',
    type: 'Landing Page',
    note: 'современный лендинг частной стоматологии с записью, услугами и ценами',
  },
  northBarber: {
    title: 'North Barber',
    url: 'https://ilya33836-cpu.github.io/north-barber-landing/',
    type: 'Landing Page',
    note: 'тёмный премиальный лендинг барбершопа',
  },
  formaHome: {
    title: 'Forma Home',
    url: 'https://ilya33836-cpu.github.io/forma-home/',
    type: 'Landing Page',
    note: 'лендинг студии дизайна интерьеров и архитектуры в стиле современного минимализма',
  },
  autohub: {
    title: 'AUTOHUB',
    url: 'https://autohub-frontend-4hmz.onrender.com',
    type: 'Web App / CRM',
    note: 'платформа автосервиса с личным кабинетом, историей обслуживания, онлайн-записью и административной CRM',
    needsAuth: true,
    accounts: [
      'admin — admin@autohub.ru, пароль Admin-Demo-2026 (админ)',
      'manager — manager@autohub.ru, пароль Manager-Demo-2026 (менеджер)',
      'client — client@example.com, пароль Client-Demo-2026 (клиент)',
    ],
  },
  nexora: {
    title: 'NEXORA',
    url: 'https://nexora-frontend-e5bo.onrender.com',
    type: 'SaaS',
    note: 'платформа управления проектами и командами с Kanban, календарём и аналитикой',
    needsAuth: true,
    accounts: ['demo@nexora.app', 'пароль demo1234, роль admin'],
  },
  nova: {
    title: 'AI Sales Agent',
    url: 'https://nova-digital-frontend-wom5.onrender.com',
    type: 'AI',
    note: 'интеллектуальный консультант, который сам определяет тип проекта и формирует техническое описание',
    needsAuth: true,
    accounts: ['admin@nova-digital.ai', 'пароль ChangeMeImmediately!2024'],
  },
}

export const objections: { match: RegExp; answer: string }[] = [
  {
    match: /дорого|бюджет|нет денег|слишком много|много стоит/i,
    answer:
      'Можно начать с минимальной версии проекта и постепенно расширять функционал. Такой подход позволяет быстрее запуститься и уменьшить стартовый бюджет.',
  },
  {
    match: /просто красивый|красивый сайт|просто сайт/i,
    answer:
      'Тогда лучше всего подойдёт Landing Page. Он отлично подходит для презентации услуг и получения заявок.',
  },
  {
    match: /не знаю что выбрать|не понимаю что|не знаю с чего|помогите выбрать|не понятно/i,
    answer:
      'Расскажите, чем занимается ваш бизнес и какую задачу должен решать сайт — я помогу определить оптимальный формат.',
  },
]
