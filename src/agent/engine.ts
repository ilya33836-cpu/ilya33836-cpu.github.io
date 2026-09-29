import { contact } from '../data/site'
import {
  DEMO_WARNING,
  PRICE_DISCLAIMER,
  RENDER_WARNING,
  demos,
  objections,
  services,
} from './knowledge'
import type { Brain, Message, Profile, ServiceKey, Suggestion, Turn } from './types'

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[!,.?;:()"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const has = (text: string, words: string[]) => words.some((word) => text.includes(word))

const niches: { name: string; words: string[] }[] = [
  {
    name: 'стоматология',
    words: ['стоматолог', 'клиник', 'зуб', 'имплант', 'ортодонт', 'десен'],
  },
  { name: 'барбершоп', words: ['барбершоп', 'барбер', 'стрижк', 'бритье'] },
  {
    name: 'интерьеры и дизайн',
    words: ['интерьер', 'архитектур', 'дизайн', 'ремонт', 'мебель'],
  },
  {
    name: 'автосервис',
    words: ['автосервис', 'автомобил', 'авто ', 'шиномонтаж', 'запчаст', 'машин'],
  },
  { name: 'общепит', words: ['ресторан', 'кафе', 'кофейн', 'пиццери', 'кухн', 'столов'] },
  { name: 'фитнес', words: ['фитнес', 'спортзал', 'тренажер', 'йога'] },
  { name: 'бьюти', words: ['салон красот', 'красот', 'парикмахер', 'ногт', 'маникюр'] },
  { name: 'медицина', words: ['медицин', 'врач', 'поликлиник', 'больниц'] },
  { name: 'юриспруденция', words: ['юрист', 'адвокат', 'юридическ'] },
  { name: 'ритейл', words: ['магазин', 'каталог', 'товар', 'одежд', 'ecommerce'] },
  { name: 'образование', words: ['школ', 'курс', 'обучени', 'образовани', 'репетитор'] },
  { name: 'агентство', words: ['агентств', 'маркетинг', 'продвижени', 'реклам'] },
  { name: 'it и технологии', words: ['разработк', 'софт', 'стартап', 'технолог'] },
]

const typeRules: { key: ServiceKey; words: string[] }[] = [
  { key: 'saas', words: ['saas', 'платформ', 'подписк', 'тариф', 'абонемент'] },
  {
    key: 'crm',
    words: ['crm', 'воронк', 'продаж', 'клиентск', 'управлени клиент', 'задач для менеджер'],
  },
  {
    key: 'ai',
    words: ['chat bot', 'чат-бот', 'чатгпт', 'ai ', 'ии ', 'искусственн', 'нейросет', 'агент', 'ассистент'],
  },
  { key: 'bot', words: ['telegram', 'телеграм', 'телега', 'тг ', 'бот', 'напоминан', 'уведомлени'] },
  {
    key: 'automation',
    words: ['автоматизац', 'автоматизир', 'связать систем', 'интегрир', 'сценари'],
  },
  {
    key: 'webapp',
    words: [
      'личный кабинет',
      'кабинет',
      'web app',
      'веб-приложени',
      'приложени',
      'внутренн систем',
      'дашборд',
      'портал',
    ],
  },
  {
    key: 'corporate',
    words: ['корпоративн', 'компани', 'магазин', 'каталог', 'несколько страниц', 'многостраничн'],
  },
  { key: 'landing', words: ['лендинг', 'landing', 'одностранич', 'визитк', 'сайт для', 'промо'] },
]

type TypeKey = Exclude<ServiceKey, 'unknown'>

const typeQuestions: Record<TypeKey, { ask: string; chips: Suggestion[] }> = {
  landing: {
    ask: 'Понял, это лендинг. Что важно показать на сайте: услуги и цены, работы или онлайн-запись?',
    chips: [
      { label: 'Услуги и цены', send: 'Услуги и цены' },
      { label: 'Портфолио', send: 'Портфолио работ' },
      { label: 'Онлайн-запись', send: 'Да, нужна онлайн-запись' },
    ],
  },
  corporate: {
    ask: 'Понял, это корпоративный сайт. Нужны ли отдельные страницы услуг и кейсы?',
    chips: [
      { label: 'Да, страницы услуг', send: 'Да, нужны страницы услуг и кейсы' },
      { label: 'Только общие разделы', send: 'Только общие разделы' },
    ],
  },
  webapp: {
    ask: 'Понял, это веб-приложение. Нужен ли личный кабинет с авторизацией?',
    chips: [
      { label: 'Да, нужен кабинет', send: 'Да, нужен личный кабинет' },
      { label: 'Без кабинета', send: 'Кабинет не нужен' },
    ],
  },
  crm: {
    ask: 'Понял, это сайт + CRM. Что важнее: воронка продаж или клиентская база с историей?',
    chips: [
      { label: 'Воронка продаж', send: 'Воронка продаж' },
      { label: 'Клиентская база', send: 'Клиентская база с историей' },
    ],
  },
  saas: {
    ask: 'Понял, это SaaS-платформа. Какие задачи решает продукт в первую очередь?',
    chips: [
      { label: 'Задачи и проекты', send: 'Задачи и проекты' },
      { label: 'Команды и доступы', send: 'Команды и роли' },
      { label: 'Аналитика', send: 'Аналитика и отчёты' },
    ],
  },
  bot: {
    ask: 'Понял, это Telegram-бот. Для записи клиентов, уведомлений или связи с CRM?',
    chips: [
      { label: 'Запись клиентов', send: 'Запись клиентов' },
      { label: 'Уведомления', send: 'Уведомления' },
      { label: 'Связь с CRM', send: 'Связка с CRM' },
    ],
  },
  automation: {
    ask: 'Понял, речь про автоматизацию. Какие процессы нужно связать: заявки, CRM, Telegram, почту или таблицы?',
    chips: [
      { label: 'Заявки и CRM', send: 'Заявки и CRM' },
      { label: 'Telegram и таблицы', send: 'Telegram и таблицы' },
      { label: 'Почта и уведомления', send: 'Почта и уведомления' },
    ],
  },
  ai: {
    ask: 'Понял, это AI-агент. Где он должен работать: на сайте, в Telegram или во внутренней системе?',
    chips: [
      { label: 'На сайте', send: 'На сайте' },
      { label: 'В Telegram', send: 'В Telegram' },
      { label: 'Во внутренней системе', send: 'Во внутренней системе' },
    ],
  },
}

/** Какие вопросы имеют смысл для каждого типа проекта. */
type Slot = {
  key: keyof Profile
  ask: string
  /** Если не задано — вопрос уместен для любого типа. */
  applies?: TypeKey[]
  chips?: Suggestion[]
}

const slots: Slot[] = [
  {
    key: 'needsCabinet',
    ask: 'Нужен ли личный кабинет с авторизацией?',
    applies: ['webapp', 'crm', 'saas', 'corporate'],
    chips: [
      { label: 'Да, нужен кабинет', send: 'Да, нужен личный кабинет' },
      { label: 'Не нужен', send: 'Кабинет не нужен' },
    ],
  },
  {
    key: 'needsLeads',
    ask: 'Нужны онлайн-заявки или запись прямо на сайте?',
    applies: ['landing', 'corporate', 'webapp', 'crm', 'saas'],
    chips: [
      { label: 'Да, нужна запись', send: 'Да, нужна онлайн-запись' },
      { label: 'Пока не нужно', send: 'Заявки пока не нужны' },
    ],
  },
  {
    key: 'hasLogo',
    ask: 'Есть ли логотип и фирменный стиль?',
    applies: ['landing', 'corporate', 'webapp', 'saas'],
    chips: [
      { label: 'Есть', send: 'Есть логотип и фирменный стиль' },
      { label: 'Нет, нужен с нуля', send: 'Логотипа нет, нужно придумать' },
    ],
  },
  { key: 'deadline', ask: 'Когда планируете запуск?' },
  { key: 'contact', ask: 'Оставьте Telegram, чтобы передать заявку разработчику.' },
]

const findContact = (raw: string) => {
  const email = raw.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/)
  if (email) return email[0]
  const handle = raw.match(/@[\w.]{3,}/)
  if (handle && !/^@(username|user|login)$/i.test(handle[0])) return handle[0]
  const phone = raw.match(/\+?\d[\d\s()-]{9,}\d/)
  if (phone) return phone[0].replace(/\s+/g, ' ')
  return undefined
}

const NEGATED = /(не нужен|не нужна|не нужно|не требуется|без)\s+(личный\s+|личного\s+)?(кабинет\w*|авторизаци\w*|логин\w*|вход\w*|облако|дашборд\w*)|кабинет\w*\s+не\s+нужн\w*|кабинет\w*\s+не\s+нужен/g

const findDeadline = (text: string) => {
  if (/срочно|быстро|как можно быстрее|прямо сейчас|побыстрее/.test(text)) return 'срочно'
  const days = text.match(/(?:^|\s)(\d{1,2})\s*(дней|день|дн)/)
  if (days) return `через ${days[1]} дн.`
  const weeks = text.match(/(?:^|\s)(\d|две|три)\s*(недель|недели|недел)/)
  if (weeks) return `через ${weeks[1]} нед.`
  if (/месяц|мес /.test(text)) return 'в течение месяца'
  return undefined
}

/** Названия демо, которые посетитель может назвать прямо в сообщении. */
const demoAliases: Record<string, keyof typeof demos> = {
  autohub: 'autohub',
  автохаб: 'autohub',
  nexora: 'nexora',
  нексора: 'nexora',
  'ai sales': 'nova',
  'sales agent': 'nova',
  nova: 'nova',
  dentaline: 'dentaline',
  'north barber': 'northBarber',
  northbarber: 'northBarber',
  'forma home': 'formaHome',
  forma: 'formaHome',
}

class LocalBrain implements Brain {
  private profile: Profile = {}
  private asked = new Set<string>()
  private turns = 0
  private recommended = false
  private newNiche: string | null = null
  private newType: TypeKey | null = null
  /** AI-агент, который работает по базе знаний клиента. */
  private knowledgeBase = false
  /** Последнее сообщение пользователя — по нему ищем прямое название демо. */
  private lastText = ''
  /** Агент только что задал вопрос — следующее сообщение считаем ответом на него. */
  private awaitingAnswer = false

  reset() {
    this.profile = {}
    this.asked.clear()
    this.turns = 0
    this.recommended = false
    this.newNiche = null
    this.newType = null
    this.knowledgeBase = false
    this.awaitingAnswer = false
  }

  async reply(_history: Message[], input: string): Promise<Turn> {
    this.turns += 1
    const raw = input.trim()
    const text = normalize(raw)
    this.lastText = text
    this.absorb(raw, text)
    const answering = this.awaitingAnswer
    this.awaitingAnswer = false

    if (text === 'другое' || text === 'иное' || text === 'другой бизнес') {
      this.asked.delete('nicheIntro')
      return {
        text: 'Понял. Напишите одним словом, чем занимается ваш бизнес — например, «ремонт» или «школа».',
        suggestions: this.defaultSuggestions(),
      }
    }

    const objection = objections.find((item) => item.match.test(text))
    if (objection) {
      return { text: objection.answer, suggestions: this.defaultSuggestions() }
    }

    // Тип проекта определён в текущем сообщении — задаём профильный вопрос.
    if (this.newType) {
      if (this.newType === 'ai' && this.knowledgeBase) return this.knowledgeBaseQuestion()
      return this.typeQuestion(this.newType)
    }

    // Вопрос про логин и пароль важнее уточнений — отвечаем сразу по текущему демо.
    if (/логин|парол|уч[её]тн|данные для входа|как войти|как зайти|демо-доступ/.test(text)) {
      return this.credentialsAnswer()
    }

    if (
      !answering &&
      !this.profile.projectType &&
      has(text, [
        'нужен сайт',
        'нужна страница',
        'хочу сайт',
        'хочу лендинг',
        'нужен лендинг',
        'нужна страничка',
        'нужен сайт-визитка',
      ])
    ) {
      return this.typePicker()
    }

    if (this.newNiche && !this.profile.projectType && !this.asked.has('nicheIntro')) {
      this.asked.add('nicheIntro')
      return this.typePicker(`Понял, ${this.newNiche}. Что нужно сделать?`)
    }

    if (this.isTypeOnly(text)) {
      return this.typeQuestion(this.profile.projectType as TypeKey)
    }

    if (
      !answering &&
      has(text, [
        'умеете',
        'умеешь',
        'чем занимаетесь',
        'что делаете',
        'какие услуги',
        'услуги',
        'что можно заказать',
        'возможности',
      ])
    ) {
      return { text: this.servicesAnswer(), suggestions: this.defaultSuggestions() }
    }

    if (has(text, ['резюме', 'подведи итог', 'подведи', 'сделай вывод', 'готовый заказ', 'собери заявку'])) {
      if (this.profile.contact) return this.summary()
      this.asked.add('contact')
      return {
        text: 'Почти готово. Оставьте Telegram, и я соберу готовое резюме проекта для разработчика.',
        suggestions: [{ label: 'Указать контакт', focus: true }],
      }
    }

    if (/сколько стоит|стоимост|какая цена|цена проекта|почем|сколько будет стоить|ценник/.test(text)) {
      return this.priceAnswer()
    }

    if (/срок|сколько времени|когда будет|дедлайн|успеете|когда планируете|долго ли/.test(text)) {
      return this.termAnswer()
    }

    if (!answering && has(text, ['пример', 'покажите', 'посмотреть', 'демо', 'кейс', 'портфолио', 'работы'])) {
      return this.demoAnswer()
    }

    if (this.smallTalk(text)) {
      return {
        text: 'Привет! Расскажите, что хотите разработать: лендинг, веб-приложение, CRM, Telegram-бот или AI-агент?',
        suggestions: this.defaultSuggestions(),
      }
    }

    if (this.needsNiche()) {
      const question = this.nicheQuestion()
      if (question) return question
    }

    if (this.readyForSummary()) return this.summary()

    if (this.profile.projectType && this.turns >= 2 && !this.recommended) {
      return this.recommend()
    }

    const question = this.askSlots()
    if (question) return question

    if (!this.profile.contact) {
      this.asked.add('contact')
      return {
        text: 'Чтобы передать заявку разработчику, оставьте Telegram. Всё остальное уже учёл.',
        suggestions: [{ label: 'Указать контакт', focus: true }],
      }
    }

    return this.summary()
  }

  private absorb(raw: string, text: string) {
    this.newNiche = null
    this.newType = null

    if (/баз[аеы] знаний|по базе знаний|знани[яе]/.test(text)) this.knowledgeBase = true

    if (!this.profile.niche) {
      const found = niches.find((item) => item.words.some((word) => text.includes(word)))
      if (found) {
        this.profile.niche = found.name
        this.newNiche = found.name
      }
    }

    if (!this.profile.projectType) {
      const typeText = text.replace(NEGATED, ' ')
      const found = typeRules.find((item) => item.words.some((word) => typeText.includes(word)))
      if (found) {
        this.profile.projectType = found.key
        this.newType = found.key as TypeKey
        this.asked.add('projectType')
      }
    }

    if (/не нужен кабинет|без кабинета|кабинет не нужен/.test(text)) {
      this.profile.needsCabinet = false
      this.asked.add('needsCabinet')
    } else if (/нужен кабинет|нужен личный кабинет|кабинет|авторизаци|вход/.test(text)) {
      this.profile.needsCabinet = true
      this.asked.add('needsCabinet')
    }

    if (/не нужны заявки|без заявок|заявки не нужны|без записи/.test(text)) {
      this.profile.needsLeads = false
      this.asked.add('needsLeads')
    } else if (/нужны заявки|нужна запись|онлайн-запись|форма заявки|обратн|заявк|запис/.test(text)) {
      this.profile.needsLeads = true
      this.asked.add('needsLeads')
    }

    if (/есть логотип|логотип есть|уже есть лого|фирменный стиль есть/.test(text)) {
      this.profile.hasLogo = true
      this.asked.add('hasLogo')
    } else if (/нет логотип|без логотип|нужно логотип|нарисовать логотип|придумать логотип/.test(text)) {
      this.profile.hasLogo = false
      this.asked.add('hasLogo')
    }

    const deadline = findDeadline(text)
    if (deadline) {
      this.profile.deadline = deadline
      this.asked.add('deadline')
    }

    const found = findContact(raw)
    if (found) {
      this.profile.contact = found
      this.asked.add('contact')
    }
  }

  private isTypeOnly(text: string) {
    const alone =
      /^(лендинг|landing page|landing|корпоративный сайт|корпоративник|web app|веб-приложение|приложение|crm|система|saas|платформа|телеграм бот|телеграм-бот|telegram бот|бот|ai-агент|ai агент|ии-агент|агент)$/
    if (alone.test(text) && this.asked.has('projectType')) {
      const found = typeRules.find((item) => item.words.some((word) => text.includes(word)))
      if (found) this.profile.projectType = found.key
      return Boolean(found)
    }
    return false
  }

  private smallTalk(text: string) {
    return /^(привет|здравствуй|здравствуйте|добрый день|доброе утро|добрый вечер|хай|hi|hello|тест|привет!)$/.test(
      text,
    )
  }

  private readyForSummary() {
    return Boolean(
      this.profile.projectType &&
        this.profile.projectType !== 'unknown' &&
        this.profile.contact &&
        this.pendingSlots().length === 0,
    )
  }

  /** Вопросы, которые ещё имеет смысл задать для текущего типа проекта. */
  private pendingSlots() {
    const type = this.profile.projectType as TypeKey | undefined
    return slots.filter(
      (slot) => !this.asked.has(slot.key) && (!slot.applies || !type || slot.applies.includes(type)),
    )
  }

  private askSlots(): Turn | null {
    const pending = this.pendingSlots()
    if (pending.length === 0) return null
    const asked = pending.slice(0, 2)
    asked.forEach((slot) => this.asked.add(slot.key))
    const last = asked[asked.length - 1]
    const items: Suggestion[] = []
    asked.forEach((slot) => {
      if (slot.chips) items.push(...slot.chips)
    })
    if (last.key === 'contact') items.push({ label: 'Указать контакт', focus: true })
    return { text: asked.map((slot) => slot.ask).join(' '), suggestions: items.slice(0, 4) }
  }

  private typeQuestion(type: TypeKey): Turn {
    this.asked.add('projectType')
    this.awaitingAnswer = true
    const question = typeQuestions[type]
    return { text: question.ask, suggestions: question.chips }
  }

  /** Отдельный сценарий: AI-агент, который отвечает по базе знаний клиента. */
  private knowledgeBaseQuestion(): Turn {
    this.asked.add('projectType')
    this.awaitingAnswer = true
    this.knowledgeBase = true
    return {
      text: 'Понял, AI-агент по базе знаний. Что за база: документы и инструкции, каталог товаров или внутренняя база компании?',
      suggestions: [
        { label: 'Документы и инструкции', send: 'База — документы и инструкции' },
        { label: 'Каталог товаров', send: 'База — каталог товаров' },
        { label: 'База знаний компании', send: 'База знаний компании' },
      ],
    }
  }

  /** Выбор формата проекта: не предлагаем нишу, пока непонятно, что нужно. */
  private typePicker(prelude?: string): Turn {
    this.asked.add('projectType')
    this.awaitingAnswer = true
    return {
      text: prelude ? `${prelude}` : 'Что нужно сделать?',
      suggestions: [
        { label: 'Лендинг', send: 'Лендинг' },
        { label: 'Сайт с кабинетом', send: 'Нужен веб-приложение с личным кабинетом' },
        { label: 'Сайт + CRM', send: 'Нужна CRM для компании' },
        { label: 'Telegram-бот', send: 'Telegram-бот' },
        { label: 'AI-агент', send: 'AI-агент' },
        { label: 'AI-агент по базе знаний', send: 'AI-агент по базе знаний' },
      ],
    }
  }

  private nicheQuestion(): Turn | null {
    if (this.profile.niche || this.asked.has('nicheIntro')) return null
    this.asked.add('nicheIntro')
    return {
      text: 'Понял. Что за бизнес — для какого проекта делаем?',
      suggestions: [
        { label: 'Автосервис', send: 'Бизнес — автосервис' },
        { label: 'Медицина', send: 'Бизнес — медицина' },
        { label: 'Ресторан', send: 'Бизнес — ресторан' },
        { label: 'Салон красоты', send: 'Бизнес — салон красоты' },
        { label: 'Другое', send: 'Другое' },
      ],
    }
  }

  /** Ниша влияет только на демо и контент — спрашиваем её один раз и не для всех типов. */
  private needsNiche() {
    const type = this.profile.projectType
    return (type === 'landing' || type === 'corporate') && !this.profile.niche
  }

  private defaultSuggestions(): Suggestion[] {
    const type = this.profile.projectType as TypeKey | undefined

    if (!type) {
      return [
        { label: 'Лендинг', send: 'Лендинг' },
        { label: 'Telegram-бот', send: 'Telegram-бот' },
        { label: 'Сайт + CRM', send: 'Нужна CRM для компании' },
        { label: 'AI-агент', send: 'AI-агент' },
      ]
    }

    const items: Suggestion[] = [
      { label: 'Сколько стоит?', send: 'Сколько стоит?' },
      { label: 'Показать пример', send: 'Покажите примеры' },
    ]
    if (!this.profile.contact) items.push({ label: 'Оставить контакт', focus: true })
    return items
  }

  private service(): (typeof services)[keyof typeof services] | null {
    if (!this.profile.projectType || this.profile.projectType === 'unknown') return null
    return services[this.profile.projectType]
  }

  private servicesAnswer() {
    const list = Object.values(services)
      .map((item) => `- ${item.name} — ${item.desc}`)
      .join('\n')
    return `Я делаю ${Object.keys(services).length} направлений:\n${list}\nРасскажите, что за бизнес и какую задачу должен решать проект.`
  }

  private priceAnswer(): Turn {
    const service = this.service()
    if (service) {
      const price = service.from ?? 'определяется после обсуждения'
      return {
        text: `${service.name} — ${price}. Срок ${service.term ?? 'зависит от объёма функционала'}. ${PRICE_DISCLAIMER}`,
        suggestions: [
          { label: 'Показать пример', send: 'Покажите примеры' },
          { label: 'Оставить контакт', focus: true },
        ],
      }
    }
    const list = Object.values(services)
      .filter((item) => item.from)
      .map((item) => `${item.name} ${item.from}`)
      .join(', ')
    return {
      text: `Ориентиры по стоимости: ${list}. ${PRICE_DISCLAIMER}`,
      suggestions: this.defaultSuggestions(),
    }
  }

  private termAnswer(): Turn {
    const service = this.service()
    if (service) {
      return {
        text: `На ${service.name} уходит ${service.term ?? 'столько, сколько займёт функционал — точную оценку дам после обсуждения задачи'}. Точную дату не обещаю, но план работ и вехи согласуем на старте.`,
        suggestions: this.defaultSuggestions(),
      }
    }
    return {
      text:
        'Сроки зависят от формата: лендинг — 5–10 дней, корпоративный сайт и Telegram-бот — 1–2 недели, AI-агент — 1–3 недели, CRM — 2–5 недель, SaaS — 3–8 недель. Подскажите, что нужно сделать, и я уточню оценку.',
      suggestions: this.defaultSuggestions(),
    }
  }

  private demoKey() {
    const mentioned = Object.entries(demoAliases).find(([alias]) => this.lastText.includes(alias))
    if (mentioned) return mentioned[1]
    if (this.profile.niche === 'стоматология') return 'dentaline'
    if (this.profile.niche === 'барбершоп') return 'northBarber'
    if (this.profile.niche === 'интерьеры и дизайн') return 'formaHome'
    if (this.profile.niche === 'автосервис') return 'autohub'
    if (this.profile.projectType === 'ai') return 'nova'
    if (this.profile.projectType === 'saas') return 'nexora'
    if (this.profile.projectType === 'crm' || this.profile.projectType === 'webapp') return 'autohub'
    if (this.profile.projectType === 'automation' || this.profile.projectType === 'bot') return 'autohub'
    if (this.profile.projectType === 'corporate') return 'formaHome'
    if (this.profile.projectType === 'landing') return 'northBarber'
    return 'dentaline'
  }

  private credentialsAnswer(): Turn {
    const demo = demos[this.demoKey()]
    if (!demo.accounts || demo.accounts.length === 0) {
      return {
        text: `${demo.title} — ${demo.note}. Демо открывается без авторизации, достаточно перейти по ссылке.`,
        link: { label: `Открыть ${demo.title}`, url: demo.url },
        suggestions: [{ label: 'Показать пример', send: 'Покажите примеры' }],
      }
    }

    return {
      text: [
        `Демо-доступ ${demo.title}:`,
        ...demo.accounts.map((account) => `- ${account}`),
        `${DEMO_WARNING} ${RENDER_WARNING}`,
      ].join('\n'),
      link: { label: `Открыть ${demo.title}`, url: demo.url },
      suggestions: [
        { label: 'Показать пример', send: 'Покажите примеры' },
        { label: 'Оставить контакт', focus: true },
      ],
    }
  }

  private demoAnswer(): Turn {
    if (!this.profile.niche && !this.profile.projectType) {
      return {
        text: 'В портфолио есть лендинги, CRM, SaaS-платформа и AI-консультант. Скажите, что вам нужно, и я покажу подходящий пример.',
        suggestions: [
          { label: 'Лендинг', send: 'Покажите пример' },
          { label: 'Сайт + CRM', send: 'Нужна CRM для компании' },
          { label: 'AI-агент', send: 'AI-агент' },
        ],
      }
    }

    this.recommended = true
    const demo = demos[this.demoKey()]
    const access = demo.accounts ? ` Демо-доступ: ${demo.accounts.join('; ')}.` : ''
    const text = `Рекомендую посмотреть ${demo.title} — ${demo.note}.${access} ${DEMO_WARNING}`
    return {
      text,
      link: { label: `Открыть ${demo.title}`, url: demo.url },
      suggestions: [
        { label: 'Сколько стоит?', send: 'Сколько стоит?' },
        { label: 'Оставить контакт', focus: true },
      ],
    }
  }

  private recommend(): Turn {
    this.recommended = true
    const service = this.service()
    const question = this.askSlots()
    if (!service) {
      return question ?? this.demoAnswer()
    }

    const demo = demos[this.demoKey()]
    const price = service.from ?? 'определяется после обсуждения'
    const term = service.term ?? 'срок зависит от объёма функционала'
    const text = [
      `Судя по вашим требованиям, лучше всего подойдёт ${service.name}.`,
      `Посмотрите ${demo.title} — ${demo.note}.${demo.accounts ? ` Демо-доступ: ${demo.accounts.join('; ')}.` : ''}`,
      `${DEMO_WARNING}${demo.needsAuth ? ` ${RENDER_WARNING}` : ''}`,
      `Стоимость — ${price}, срок — ${term}. ${PRICE_DISCLAIMER}`,
      question ? question.text : '',
    ]
      .filter(Boolean)
      .join(' ')

    const suggestions: Suggestion[] = []
    if (question) suggestions.push(...(question.suggestions ?? []))
    if (!this.profile.contact && !suggestions.some((item) => item.focus)) {
      suggestions.push({ label: 'Оставить контакт', focus: true })
    }
    suggestions.push({ label: 'Сколько стоит?', send: 'Сколько стоит?' })

    return {
      text,
      link: { label: `Открыть ${demo.title}`, url: demo.url },
      suggestions: suggestions.slice(0, 4),
    }
  }

  private functions() {
    const service = this.service()
    if (!service) return serviceFallbackFunctions
    let list = [...service.functions]
    if (this.knowledgeBase) {
      list = ['Работа по базе знаний', ...list]
    }
    if (this.profile.needsCabinet === false) {
      list = list.filter((item) => !/кабинет/i.test(item))
    } else if (this.profile.needsCabinet && !list.some((item) => /кабинет/i.test(item))) {
      list.push('Личный кабинет')
    }
    if (this.profile.needsLeads && !list.some((item) => /заявк|запис/i.test(item))) {
      list.push('Онлайн-заявка')
    }
    return list
  }

  private summary(): Turn {
    const service = this.service()
    const name = service?.name ?? 'Landing Page'
    const price = service?.from ?? 'определяется после обсуждения'
    const term = service?.term ?? 'зависит от объёма функционала'
    const lines = [
      '## Резюме проекта',
      '',
      `Тип проекта: ${name}`,
      `Ниша: ${this.profile.niche ?? 'не указана'}`,
      `Функции: ${this.functions().join(', ')}`,
      `Стоимость: ${price}`,
      `Срок: ${term}`,
      ...(this.profile.deadline ? [`Запуск: ${this.profile.deadline}`] : []),
      ...(this.profile.contact ? [`Контакт: ${this.profile.contact}`] : []),
      '',
      'Следующий шаг: передать заявку разработчику.',
    ]

    return {
      text: lines.join('\n'),
      kind: 'summary',
      link: contact.telegramUrl
        ? { label: 'Написать разработчику', url: contact.telegramUrl }
        : undefined,
      suggestions: [{ label: 'Начать заново', send: 'startover' }],
    }
  }
}

const serviceFallbackFunctions = ['Главная', 'Обратная связь']

export function createLocalBrain(): Brain {
  return new LocalBrain()
}
