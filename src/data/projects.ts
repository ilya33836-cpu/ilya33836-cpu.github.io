export type ProjectAccount = {
  role: string
  login?: string
  email?: string
  password?: string
}

export type Project = {
  id: string
  title: string
  category: string
  description: string
  url: string
  image: string
  /** Запасное превью, если основной файл не найден. */
  fallbackImage?: string
  /** Галерея экранов для модального окна. */
  gallery?: string[]
  /** Демо-доступы для авторизации. */
  accounts?: ProjectAccount[]
  stack: string[]
  features: string[]
  featured: boolean
  /** Демо на бесплатном хостинге: первый запуск до 60 сек, вход может потребовать повтора. */
  coldStart?: boolean
  /** Некоторые лендинги доступны только через VPN. */
  vpn?: boolean
}

export const projects: Project[] = [
  {
    id: 'autohub',
    title: 'AUTOHUB',
    category: 'WEB APP / CRM',
    description:
      'Цифровая платформа автосервиса с личным кабинетом клиента, историей обслуживания, онлайн-записью и административной CRM.',
    url: 'https://autohub-frontend-4hmz.onrender.com',
    image: '/projects/autohub-1.png',
    fallbackImage: '/projects/autohub.svg',
    gallery: [
      '/projects/autohub-1.png',
      '/projects/autohub-2.png',
      '/projects/autohub-6.png',
      '/projects/autohub-5.png',
      '/projects/autohub-7.png',
      '/projects/autohub-8.png',
      '/projects/autohub-9.png',
    ],
    stack: ['React', 'FastAPI', 'PostgreSQL'],
    features: [
      'Личный кабинет клиента',
      'История обслуживания автомобиля',
      'Онлайн-запись на сервис',
      'Административная CRM',
    ],
    featured: true,
    coldStart: true,
    accounts: [
      { role: 'admin', login: 'admin', email: 'admin@autohub.ru', password: 'Admin-Demo-2026' },
      {
        role: 'manager',
        login: 'manager',
        email: 'manager@autohub.ru',
        password: 'Manager-Demo-2026',
      },
      {
        role: 'client',
        login: 'client',
        email: 'client@example.com',
        password: 'Client-Demo-2026',
      },
    ],
  },
  {
    id: 'nexora',
    title: 'NEXORA',
    category: 'SAAS',
    description:
      'Платформа управления проектами и командами с Kanban, календарём, аналитикой и рабочими пространствами.',
    url: 'https://nexora-frontend-e5bo.onrender.com',
    image: '/projects/nexora-1.png',
    fallbackImage: '/projects/nexora.svg',
    gallery: [
      '/projects/nexora-1.png',
      '/projects/nexora-2.png',
      '/projects/nexora-3.png',
      '/projects/nexora-4.png',
      '/projects/nexora-5.png',
    ],
    stack: ['React', 'FastAPI'],
    features: [
      'Kanban-доска задач',
      'Календарь и планирование',
      'Аналитика по проектам',
      'Рабочие пространства команд',
    ],
    featured: true,
    coldStart: true,
    accounts: [{ role: 'admin', email: 'demo@nexora.app', password: 'demo1234' }],
  },
  {
    id: 'ai-sales-agent',
    title: 'AI SALES AGENT',
    category: 'AI',
    description:
      'AI-консультант, который помогает клиенту определить тип проекта, собирает требования и формирует готовый Lead.',
    url: 'https://nova-digital-frontend-wom5.onrender.com',
    image: '/projects/nova-1.png',
    fallbackImage: '/projects/ai-sales-agent.svg',
    gallery: [
      '/projects/nova-1.png',
      '/projects/nova-2.png',
      '/projects/nova-3.png',
      '/projects/nova-4.png',
    ],
    stack: ['React', 'AI', 'FastAPI'],
    features: [
      'Определение типа проекта',
      'Уточняющие вопросы по задаче',
      'Сбор требований в диалоге',
      'Готовый структурированный Lead',
    ],
    featured: true,
    coldStart: true,
    accounts: [
      { role: 'admin', email: 'admin@nova-digital.ai', password: 'ChangeMeImmediately!2024' },
    ],
  },
  {
    id: 'dentaline',
    title: 'DENTALINE',
    category: 'LANDING PAGE',
    description:
      'Современный лендинг частной стоматологии с записью, услугами и ценами.',
    url: 'https://ilya33836-cpu.github.io/dentaline-site/',
    image: '/projects/dentaline-1.png',
    fallbackImage: '/projects/dentaline.svg',
    gallery: [
      '/projects/dentaline-1.png',
      '/projects/dentaline-2.png',
      '/projects/dentaline-3.png',
      '/projects/dentaline-4.png',
    ],
    stack: ['Дизайн', 'Адаптивность', 'Анимации'],
    features: ['Онлайн-запись', 'Каталог услуг и цены', 'Адаптивный дизайн'],
    featured: false,
    vpn: true,
  },
  {
    id: 'north-barber',
    title: 'NORTH BARBER',
    category: 'LANDING PAGE',
    description: 'Премиальный сайт барбершопа с тёмным минималистичным дизайном.',
    url: 'https://ilya33836-cpu.github.io/north-barber-landing/',
    image: '/projects/north-barber-1.png',
    fallbackImage: '/projects/north-barber.svg',
    gallery: [
      '/projects/north-barber-1.png',
      '/projects/north-barber-2.png',
      '/projects/north-barber-3.png',
      '/projects/north-barber-4.png',
    ],
    stack: ['Дизайн', 'Адаптивность', 'Анимации'],
    features: ['Тёмная визуальная подача', 'Минималистичный интерфейс', 'Адаптивный дизайн'],
    featured: false,
    vpn: true,
  },
  {
    id: 'forma-home',
    title: 'FORMA HOME',
    category: 'LANDING PAGE',
    description: 'Студия дизайна интерьеров и архитектуры в стиле современного минимализма.',
    url: 'https://ilya33836-cpu.github.io/forma-home/',
    image: '/projects/forma-home-1.png',
    fallbackImage: '/projects/forma-home.svg',
    gallery: [
      '/projects/forma-home-1.png',
      '/projects/forma-home-2.png',
      '/projects/forma-home-3.png',
      '/projects/forma-home-4.png',
    ],
    stack: ['Дизайн', 'Адаптивность', 'Анимации'],
    features: [
      'Портфолио студии',
      'Современный минимализм',
      'Адаптивный дизайн',
    ],
    featured: false,
    vpn: true,
  },
]

export const featuredProjects = projects.filter((project) => project.featured)
export const landingProjects = projects.filter((project) => !project.featured)
