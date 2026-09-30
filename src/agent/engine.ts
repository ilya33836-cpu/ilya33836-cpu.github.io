import { contact } from '../data/site'
import { faqItems } from '../data/faq'
import {
  DEMO_WARNING,
  PRICE_DISCLAIMER,
  RENDER_WARNING,
  demos,
  objections,
  services,
} from './knowledge'
import type { Brain, Message, Profile, ServiceKey, Suggestion, Turn } from './types'

/* ------------------------------------------------------------------ */
/*  Разбор текста                                                      */
/* ------------------------------------------------------------------ */

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[!,.?;:"«»()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** Значимые слова вопроса — по ним ищем совпадение с базой знаний. */
const keywordsOf = (text: string) =>
  text
    .split(' ')
    .map((word) => word.replace(/[?.!,]/g, ''))
    .filter((word) => word.length > 3)

/* ------------------------------------------------------------------ */
/*  Ниши и типы проектов                                               */
/* ------------------------------------------------------------------ */

const niches: { name: string; words: string[] }[] = [
  {
    name: 'стоматология',
    words: ['стоматолог', 'клиник', 'зуб', 'имплант', 'ортодонт', 'десн'],
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
  { key: 'saas', words: ['saas', 'подписк', 'абонемент', 'тарифн'] },
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
    words: ['корпоративн', 'компани', 'каталог', 'несколько страниц', 'многостраничн', 'интернет-магазин'],
  },
  { key: 'landing', words: ['лендинг', 'landing', 'одностранич', 'визитк', 'сайт для', 'промо'] },
]

type TypeKey = Exclude<ServiceKey, 'unknown'>

/* ------------------------------------------------------------------ */
/*  Вопросы по типам проекта                                           */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Уточняющие вопросы                                                 */
/* ------------------------------------------------------------------ */

type Slot = {
  key: keyof Profile
  ask: string
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

/* ------------------------------------------------------------------ */
/*  Разбор полей                                                       */
/* ------------------------------------------------------------------ */

const findContact = (raw: string) => {
  const email = raw.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/)
  if (email) return email[0]
  const handle = raw.match(/@[\w.]{3,}/)
  if (handle && !/^@(username|user|login)$/i.test(handle[0])) return handle[0]
  const phone = raw.match(/\+?\d[\d\s()-]{9,}\d/)
  if (phone) return phone[0].replace(/\s+/g, ' ')
  return undefined
}

const NEGATED = /(не нужен|не нужна|не нужно|не требуется|без)\s+(личный\s+|личного\s+)?(кабинет\w*|авторизаци\w*|логин\w*|вход\w*|облако|дашборд\w*)|кабинет\w*\s+не\s+нужн\w*/g

const findDeadline = (text: string) => {
  if (/срочно|быстро|как можно быстрее|прямо сейчас|побыстрее/.test(text)) return 'срочно'
  const days = text.match(/(?:^|\s)(\d{1,2})\s*(дней|день|дн)/)
  if (days) return `через ${days[1]} дн.`
  const weeks = text.match(/(?:^|\s)(\d|две|три)\s*(недель|недели|недел)/)
  if (weeks) return `через ${weeks[1]} нед.`
  if (/месяц|мес /.test(text)) return 'в течение месяца'
  return undefined
}

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

/* ------------------------------------------------------------------ */
/*  Определение намерения: по смыслу, а не по порядку проверки          */
/* ------------------------------------------------------------------ */

type IntentId =
  | 'repeat'
  | 'thanks'
  | 'identity'
  | 'greeting'
  | 'continue'
  | 'otherBusiness'
  | 'summary'
  | 'context'
  | 'credentials'
  | 'price'
  | 'term'
  | 'demo'
  | 'services'
  | 'stack'
  | 'support'
  | 'process'
  | 'remote'
  | 'extras'
  | 'assets'
  | 'faq'

type IntentRule = { id: IntentId; score: number; test: RegExp }

/** Чем выше балл, тем точнее совпадение. При равенстве побеждает более специфичное правило. */
const intentRules: IntentRule[] = [
  { id: 'otherBusiness', score: 6, test: /^(другое|иное|другой бизнес|не знаю|непонятно|что-то другое)$/ },
  {
    id: 'continue',
    score: 6,
    // Хвост обязателен, иначе «ну» из «нужен лендинг» считается согласием.
    test: /^(продолж\w*|далее|дальше|вернуться|к вопросу|о вернемся|ок|окей|ага|угу|давай|хорошо|ладно|ну|go|next)(\s|$)/,
  },
  { id: 'thanks', score: 5, test: /(спасиб|благодар|до свидания|пока$|отлично|круто|класс|здорово)/ },
  { id: 'identity', score: 5, test: /(ты бот|ты робот|ты человек|кто ты|ты настоящ|ты живой|ты настоящий)/ },
  { id: 'greeting', score: 5, test: /^(привет|здравствуй|здравствуйте|добрый день|доброе утро|добрый вечер|хай|hi|hello|тест|ку|привет!)$/ },
  { id: 'summary', score: 5, test: /(резюме|подведи итог|подведи|готовый заказ|собери заявк|техническое описание|итог по проекту)/ },
  { id: 'context', score: 5, test: /(что ты (понял|знаешь|собрал)|что уже (понял|знаешь)|что ты про меня|повтори что)/ },
  { id: 'credentials', score: 4, test: /(логин|парол|уч[её]тн|данные для входа|как войти|как зайти|демо-доступ|подскажи доступ)/ },
  { id: 'stack', score: 4, test: /(технологи|стек|чем дела|на ч[её]м|делается|сделано|react|python|fastapi|node|postgres|база данных|код)/ },
  { id: 'support', score: 4, test: /(поддерж|сопровожд|доработ|поддержива|после запуска|гарант|правк|исправить)/ },
  { id: 'process', score: 4, test: /(как работа|как нач|как ид[её]т|процесс|этап|порядок работ|план работ|как договарива|бриф)/ },
  { id: 'remote', score: 4, test: /(другой город|из россии|иностран|за рубеж|удаленно|удалённо|встреч|приехать|город)/ },
  { id: 'extras', score: 4, test: /(домен|хостинг|оплат|рассроч|выставить счет|счет|счёт|предоплат)/ },
  {
    id: 'assets',
    score: 4,
    test: /(нужен ли текст|нужны ли текст|тексты от меня|логотип|фирменный стиль|фото|контент для сайта|дизайн)/,
  },
  { id: 'price', score: 3, test: /(сколько стоит|стоимост|цена|ценник|почем|бюджет|прайс|дорого|дешево|дёшево)/ },
  { id: 'term', score: 3, test: /(срок|сколько времени|долго ли|дедлайн|успеете|когда будет|по времени)/ },
  { id: 'demo', score: 3, test: /(пример|демо|кейс|портфолио|работы|покажи|посмотреть|можно ли открыть)/ },
  { id: 'services', score: 3, test: /(умеете|умеешь|какие услуги|чем занимаетесь|что делаете|возможности|что можете|направления)/ },
]

type Detected = { id: IntentId; score: number } | null

const detectIntent = (text: string): Detected => {
  let best: IntentRule | null = null
  for (const rule of intentRules) {
    if (!rule.test.test(text)) continue
    if (!best || rule.score > best.score) best = rule
  }
  return best ? { id: best.id, score: best.score } : null
}

/* ------------------------------------------------------------------ */
/*  Ответы на частые вопросы                                           */
/* ------------------------------------------------------------------ */

const extraAnswers: Record<string, (ctx: { type: TypeKey | undefined }) => string> = {
  stack: () =>
    'Стек под задачу: сайты и лендинги — React + TypeScript + Tailwind, серверная часть — Node.js или FastAPI, база данных — PostgreSQL. Telegram — боты на webhook, AI — интеграция с языковыми моделями и поиском по вашим документам. На этом стеке сделаны все проекты из портфолио.',
  support: () =>
    'После сдачи передаю инструкцию по работе с проектом и остаюсь на связи. Если нужно развить продукт или исправить что-то — считаю объём отдельно и предлагаю варианты, ничего не навязывая.',
  process: () =>
    'Обычно четыре шага: обсуждаем задачу и фиксируем объём в техническом задании, согласуем структуру и внешний вид, разрабатываю по этапам с промежуточными результатами, затем тестирую, публикую и передаю доступы.',
  remote: () =>
    'Да, работаю удалённо с заказчиками из любых городов и стран. Созвоны и демо — в Telegram или по видеосвязи, ход работы виден в репозитории и в самом проекте.',
  extras: () =>
    'Домен и хостинг остаются на вас — помогу выбрать и подключу. В разработку входит всё: структура, дизайн, вёрстка, серверная часть, тестирование и публикация. Оплата — по этапам, точный график согласуем до старта.',
  assets: () =>
    'Тексты и логотип от вас не обязательны: базовую структуру, описания и визуальный стиль я подготовлю сам, а ваш фирменный стиль и материалы подключу, если они есть. Фотографии лучше свои — контент выглядит честнее и продаёт лучше стоковых картинок.',
}

const serviceFallbackFunctions = ['Главная', 'Обратная связь']

/** Явный вопрос внутри сообщения — значит пользователь хочет ответ, а не продолжает анкету. */
const QUESTION_MARK = /(\?|сколько|как|почему|какой|какая|какие|что входит|можно ли|нужен ли|нужны ли|зависит ли|где|когда)/

/* ------------------------------------------------------------------ */
/*  Движок диалога                                                     */
/* ------------------------------------------------------------------ */

class LocalBrain implements Brain {
  private profile: Profile = {}
  private asked = new Set<string>()
  private turns = 0
  private recommended = false
  private newNiche: string | null = null
  private newType: TypeKey | null = null
  private knowledgeBase = false
  private lastText = ''
  private lastInput = ''
  /** Вопрос по типу, отложенный из-за ответа на чужой вопрос. */
  private deferred: Turn | null = null
  /** Последние ответы агента: защита от дословных повторов. */
  private recent: string[] = []
  private repeats = 0
  /** Текст, на котором был определён тип проекта. */
  private lastTypeInput = ''
  /** Что понимаем из сообщения, отправленного в ответ на наш вопрос. */
  private lastChips: string[] = []
  /** Чипы, которые являются ответами на заданный вопрос (в отличие от действий). */
  private answerChips: string[] = []
  /** Последний ответ — это вопрос, а не информация. */
  private askedQuestion = false
  /** В этом сообщении изменились данные проекта. */
  private absorbed = false
  /** Какой уточняющий вопрос закрыл этот ответ. */
  private absorbedSlot: string | null = null
  /** Тип проекта был определён именно в этом сообщении. */
  private typeJustSet = false

  reset() {
    this.profile = {}
    this.asked.clear()
    this.turns = 0
    this.recommended = false
    this.newNiche = null
    this.newType = null
    this.knowledgeBase = false
    this.lastText = ''
    this.lastInput = ''
    this.deferred = null
    this.recent = []
    this.repeats = 0
    this.lastChips = []
    this.absorbed = false
  }

  async reply(_history: Message[], input: string): Promise<Turn> {
    this.turns += 1
    this.askedQuestion = false
    const raw = input.trim()
    const text = normalize(raw)
    const isEcho = text.length > 0 && text === this.lastInput
    this.lastText = text
    this.absorb(raw, text)

    const turn = this.route(text, isEcho)
    this.lastInput = text
    return this.remember(turn)
  }

  /** Главный маршрут: сначала смысл сообщения, и только потом — сценарий диалога. */
  private route(text: string, isEcho: boolean): Turn {
    const objection = objections.find((item) => item.match.test(text))
    if (objection) {
      this.dropDetection()
      return { text: objection.answer, suggestions: this.defaultSuggestions() }
    }

    // Дословный повтор: не повторяемся, а двигаем диалог дальше.
    if (isEcho && (this.deferred || this.pendingSlots().length > 0)) {
      this.dropDetection()
      return this.repeatTurn()
    }

    const detected = detectIntent(text)
    const intent = detected?.id ?? null
    const isMeta =
      intent === 'greeting' || intent === 'thanks' || intent === 'identity'
    // Ответ на один из предложенных чипов — это ответ на вопрос, а не новая тема.
    const isChipAnswer = this.lastChips.includes(text)
    // Ответ на заданный вопрос продолжает диалог, даже если в словах есть
    // слово из другого намерения («логотипа нет, нужно придумать»).
    const isAnswerChip = this.answerChips.includes(text)
    const typeDetected = this.newType !== null && this.lastTypeInput === text
    // Ответ на уточняющий вопрос без явного «а ещё спрошу…» — продолжаем сценарий.
    const answersSlot =
      (this.absorbedSlot !== null || isAnswerChip) && !QUESTION_MARK.test(text)

    if (isMeta) {
      // «Ты бот или человек» не должно считаться запросом Telegram-бота.
      this.dropDetection()
      return this.metaAnswer(intent as 'greeting' | 'thanks' | 'identity')
    }

    if (typeDetected && !isChipAnswer) {
      const type = this.newType as TypeKey
      this.newType = null
      const question =
        type === 'ai' && this.knowledgeBase
          ? this.knowledgeBaseQuestion()
          : this.typeQuestion(type)

      if (intent !== null && !isChipAnswer) {
        this.deferred = question
        return this.answerIntent(intent) ?? question
      }
      return question
    }

    if (intent === 'continue') {
      const pending = this.deferred
      this.deferred = null
      return pending ?? this.flow()
    }

    if (intent === 'otherBusiness') {
      this.asked.delete('nicheIntro')
      return {
        text: 'Хорошо. Напишите одним словом, чем занимается ваш бизнес — например, «ремонт» или «школа».',
        suggestions: this.defaultSuggestions(),
      }
    }

    if (intent === 'context') return this.contextAnswer()

    if (intent && !answersSlot) {
      const answer = this.answerIntent(intent)
      if (answer) {
        if (isChipAnswer || this.absorbed) {
          const pending = this.deferred ?? this.nextSlotQuestion()
          if (pending) {
            this.deferred = pending
            const items = (answer.suggestions ?? []).filter((item) => item.send !== 'Продолжить')
            return {
              ...answer,
              suggestions: [...items, { label: 'Продолжить', send: 'Продолжить' }],
            }
          }
        }
        return answer
      }
    }

    // Данные из ответа приняты: продолжаем сценарий, а не отвечаем на свой же вопрос.
    if (isChipAnswer || this.absorbed) {
      return this.flow()
    }

    // Ничего не распознали: сперва пробуем ответить по базе знаний,
    // и только если ответа нет — возвращаемся к сценарию диалога.
    const fromFaq = this.faqAnswer(text)
    if (fromFaq) return fromFaq

    const unknown = this.unknownTurn(text)
    if (unknown) return unknown

    return this.flow()
  }

  private metaAnswer(intent: 'greeting' | 'thanks' | 'identity'): Turn {
    if (intent === 'identity') {
      return {
        text: 'Я AI-консультант этого сайта: помогу выбрать формат проекта, покажу подходящие демо и соберу техническое описание. К разработке подключусь я — напишите мне в Telegram, и ответит человек.',
        suggestions: this.defaultSuggestions(),
      }
    }
    if (intent === 'thanks') {
      return {
        text: this.profile.projectType
          ? 'Пожалуйста. Если появятся новые мысли по проекту — возвращайтесь, дополним резюме.'
          : 'Пожалуйста. Буду на связи.',
        suggestions: this.defaultSuggestions(),
      }
    }
    return {
      text: this.turns <= 1
        ? 'Привет! Расскажите, что хотите разработать: лендинг, веб-приложение, сайт с CRM, Telegram-бот или AI-агент.'
        : 'Привет! Продолжим — что нужно уточнить по вашему проекту?',
      suggestions: this.defaultSuggestions(),
    }
  }

  /** Сбрасывает ложное срабатывание определения типа: «ты бот» — это не проект. */
  private dropDetection() {
    if (this.typeJustSet) {
      this.profile.projectType = undefined
      this.asked.delete('projectType')
    }
    this.newType = null
    this.newNiche = null
    this.typeJustSet = false
    this.absorbed = false
    this.absorbedSlot = null
  }

  /** Собирает ответ по распознанному намерению. */
  private answerIntent(intent: IntentId): Turn | null {
    switch (intent) {
      case 'summary':
        if (this.profile.contact) return this.summary()
        this.asked.add('contact')
        return {
          text: 'Почти готово. Оставьте Telegram — соберу готовое резюме проекта для разработчика.',
          suggestions: [{ label: 'Указать контакт', focus: true }],
        }
      case 'credentials':
        return this.credentialsAnswer()
      case 'price':
        return this.priceAnswer()
      case 'term':
        return this.termAnswer()
      case 'demo':
        return this.demoAnswer()
      case 'services':
        return this.servicesAnswer()
      case 'stack':
      case 'support':
      case 'process':
      case 'remote':
      case 'extras':
      case 'assets':
        return this.continueAfter({
          text: extraAnswers[intent]({ type: this.profile.projectType as TypeKey | undefined }),
        })
      default:
        return null
    }
  }

  /** Ответ на конкретный вопрос про проект: цена, срок и демо — по типу, если он назван. */
  private detectServiceInText(text: string): (typeof services)[keyof typeof services] | null {
    const cleaned = text.replace(NEGATED, ' ')
    const found = typeRules.find((item) => item.words.some((word) => cleaned.includes(word)))
    if (!found) return null
    return services[found.key as TypeKey] ?? null
  }

  private priceAnswer(): Turn {
    const named = this.detectServiceInText(this.lastText)
    const service = named ?? this.service()

    if (service) {
      const price = service.from ?? 'определяется после обсуждения'
      return this.continueAfter({
        text: `${service.name} — ${price}. Срок ${service.term ?? 'зависит от объёма функционала'}. ${PRICE_DISCLAIMER}`,
        suggestions: [
          { label: 'Показать пример', send: 'Покажите примеры' },
          { label: 'Оставить контакт', focus: true },
        ],
      })
    }

    const list = Object.values(services)
      .filter((item) => item.from)
      .map((item) => `${item.name} ${item.from}`)
      .join(', ')
    return this.continueAfter({
      text: `Ориентиры по стоимости: ${list}. ${PRICE_DISCLAIMER}`,
      suggestions: this.defaultSuggestions(),
    })
  }

  private termAnswer(): Turn {
    const named = this.detectServiceInText(this.lastText)
    const service = named ?? this.service()

    if (service) {
      return this.continueAfter({
        text: `На ${service.name} уходит ${service.term ?? 'столько, сколько займёт функционал — точную оценку дам после обсуждения задачи'}. План работ и вехи согласуем на старте, чтобы сроки не расплывались.`,
        suggestions: this.defaultSuggestions(),
      })
    }

    return this.continueAfter({
      text: 'Сроки зависят от формата: лендинг — 5–10 дней, корпоративный сайт и Telegram-бот — 1–2 недели, AI-агент — 1–3 недели, сайт с CRM — 2–5 недель, SaaS — 3–8 недель. Подскажите, что нужно сделать, и я уточню оценку.',
      suggestions: this.defaultSuggestions(),
    })
  }

  private servicesAnswer(): Turn {
    const list = Object.values(services)
      .map((item) => `- ${item.name} — ${item.desc}`)
      .join('\n')
    return this.continueAfter({
      text: `Я делаю ${Object.keys(services).length} направлений:\n${list}\nЧто из этого ближе к вашей задаче?`,
      suggestions: this.defaultSuggestions(),
    })
  }

  /** Ответ по базе знаний FAQ: подбираем вопрос с наибольшим пересечением слов. */
  private faqAnswer(text: string): Turn | null {
    const words = keywordsOf(text)
    if (words.length === 0) return null

    let best: { score: number; answer: string } | null = null
    for (const item of faqItems) {
      const question = normalize(item.question)
      const score = keywordsOf(question).filter((word) => words.includes(word)).length
      if (score >= 2 && (!best || score > best.score)) best = { score, answer: item.answer }
    }
    if (!best) return null

    return this.continueAfter({ text: best.answer, suggestions: this.defaultSuggestions() })
  }

  /**
   * Непонятное сообщение: не задаём следующий вопрос, а отвечаем по существу
   * и предлагаем конкретные варианты.
   */
  private unknownTurn(text: string): Turn | null {
    const asksSomething = /что|как|какой|какая|какие|сколько|где|когда|можно|умеете|есть ли/.test(text)
    const isShort = text.split(' ').length <= 3

    if (isShort && !asksSomething) {
      return this.continueAfter({
        text: 'Пока не понял, что вы имеете в виду. Напишите пару слов — например, «нужен лендинг» или «сколько стоит».',
        suggestions: this.defaultSuggestions(),
      })
    }

    if (asksSomething) {
      return this.continueAfter({
        text: 'По этому вопросу короткого ответа в один абзац не получится. Могу показать похожий проект или назвать ориентир по цене и срокам — что полезнее?',
        suggestions: [
          { label: 'Показать пример', send: 'Покажите примеры' },
          { label: 'Сколько стоит?', send: 'Сколько стоит?' },
        ],
      })
    }

    return null
  }

  /** Что агент уже понял о проекте. */
  private contextAnswer(): Turn {
    const service = this.service()
    if (!service) {
      return {
        text: 'Пока я знаю только общий контекст. Расскажите, что нужно разработать — дальше буду уточнять по делу.',
        suggestions: this.defaultSuggestions(),
      }
    }

    const known = [`Формат: ${service.name}`]
    if (this.profile.niche) known.push(`Ниша: ${this.profile.niche}`)
    if (this.profile.needsCabinet !== undefined) {
      known.push(`Личный кабинет: ${this.profile.needsCabinet ? 'нужен' : 'не нужен'}`)
    }
    if (this.profile.needsLeads !== undefined) {
      known.push(`Онлайн-заявки: ${this.profile.needsLeads ? 'нужны' : 'не нужны'}`)
    }
    if (this.profile.hasLogo !== undefined) {
      known.push(`Логотип: ${this.profile.hasLogo ? 'есть' : 'нужно придумать'}`)
    }
    if (this.profile.deadline) known.push(`Запуск: ${this.profile.deadline}`)
    if (this.profile.contact) known.push(`Контакт: ${this.profile.contact}`)

    const pending = this.pendingSlots()
    const tail = pending.length
      ? `Осталось уточнить: ${pending.map((slot) => slot.ask).join(' ')}`
      : 'Все детали собраны, могу собрать резюме.'

    return {
      text: `Вот что я уже понял о вашем проекте:\n${known.map((line) => `- ${line}`).join('\n')}\n${tail}`,
      suggestions: pending.length
        ? this.slotSuggestions(pending.slice(0, 1))
        : [
            { label: 'Собрать резюме', send: 'Собери резюме' },
            { label: 'Начать заново', send: 'startover' },
          ],
    }
  }

  /** Ответ на дословный повтор: не повторяемся, а двигаем диалог дальше. */
  private repeatTurn(): Turn {
    this.repeats += 1
    const next = this.deferred ?? this.nextSlotQuestion()
    const text = this.repeats > 1
      ? 'Ответил выше — повторяться не буду. Давайте двинемся дальше.'
      : 'Понял, вопрос тот же. Ответил выше, чтобы не дублировать.'

    if (next) {
      return { text: `${text}\n\n${next.text}`, suggestions: next.suggestions }
    }
    return { text, suggestions: this.defaultSuggestions() }
  }

  /** Добавляет возможность вернуться к диалогу, если он не завершён. */
  private continueAfter(turn: Turn): Turn {
    const pending = this.deferred ?? this.nextSlotQuestion()
    if (!pending) return turn
    this.deferred = pending
    const items = (turn.suggestions ?? []).filter((item) => item.send !== 'Продолжить')
    return { ...turn, suggestions: [...items, { label: 'Продолжить', send: 'Продолжить' }] }
  }

  private nextSlotQuestion(): Turn | null {
    const pending = this.pendingSlots()
    if (pending.length === 0) return null
    this.askedQuestion = true
    const asked = pending.slice(0, 1)
    asked.forEach((slot) => this.asked.add(slot.key))
    return { text: asked.map((slot) => slot.ask).join(' '), suggestions: this.slotSuggestions(asked) }
  }

  private slotSuggestions(asked: Slot[]): Suggestion[] {
    const items: Suggestion[] = []
    for (const slot of asked) {
      if (slot.chips) items.push(...slot.chips)
      else if (slot.key === 'contact') items.push({ label: 'Указать контакт', focus: true })
    }
    return items
  }

  /* ----------------------------- сценарий ----------------------------- */

  private absorb(raw: string, text: string) {
    this.newNiche = null
    this.newType = null
    this.lastTypeInput = text
    this.absorbed = false
    this.absorbedSlot = null
    this.typeJustSet = false

    const mark = (key: string) => {
      // Сначала проверяем, был ли вопрос ещё открыт, и только потом закрываем его.
      const wasPending = this.pendingSlots().some((slot) => slot.key === key)
      this.asked.add(key)
      this.absorbed = true
      if (wasPending) this.absorbedSlot = key
    }
    const setFlag = (key: 'needsCabinet' | 'needsLeads' | 'hasLogo', value: boolean) => {
      if (this.profile[key] === value) return
      this.profile[key] = value
      mark(key)
    }
    const setText = (key: 'niche' | 'deadline' | 'contact', value: string) => {
      if (this.profile[key] === value) return
      this.profile[key] = value
      mark(key)
    }

    if (/баз[аеы] знаний|по базе знаний|знани[яе]/.test(text)) this.knowledgeBase = true

    if (!this.profile.niche) {
      const found = niches.find((item) => item.words.some((word) => text.includes(word)))
      if (found) {
        this.profile.niche = found.name
        this.newNiche = found.name
        this.absorbed = true
      }
    }

    if (!this.profile.projectType) {
      const typeText = text.replace(NEGATED, ' ')
      const found = typeRules.find((item) => item.words.some((word) => typeText.includes(word)))
      if (found) {
        this.profile.projectType = found.key
        this.newType = found.key as TypeKey
        this.asked.add('projectType')
        this.absorbed = true
        this.typeJustSet = true
      }
    }

    if (/не нужен кабинет|без кабинета|кабинет не нужен/.test(text)) {
      setFlag('needsCabinet', false)
    } else if (/нужен кабинет|нужен личный кабинет|кабинет|авторизаци|вход/.test(text)) {
      setFlag('needsCabinet', true)
    }

    if (/не нужны заявки|без заявок|заявки не нужны|без записи|запись не нужна/.test(text)) {
      setFlag('needsLeads', false)
    } else if (/нужны заявки|нужна запись|онлайн-запись|форма заявки|обратн|заявк|запис/.test(text)) {
      setFlag('needsLeads', true)
    }

    if (/есть логотип|логотип есть|уже есть лого|фирменный стиль есть/.test(text)) {
      setFlag('hasLogo', true)
    } else if (/нет логотип|без логотип|нужно логотип|нарисовать логотип|придумать логотип/.test(text)) {
      setFlag('hasLogo', false)
    }

    const deadline = findDeadline(text)
    if (deadline) setText('deadline', deadline)

    const contact = findContact(raw)
    if (contact) setText('contact', contact)
  }

  /** Сценарий диалога, когда сообщение не было отдельным вопросом. */
  private flow(): Turn {
    if (this.newType) {
      const type = this.newType
      this.newType = null
      return type === 'ai' && this.knowledgeBase
        ? this.knowledgeBaseQuestion()
        : this.typeQuestion(type)
    }

    if (this.newNiche && !this.profile.projectType) {
      const niche = this.newNiche
      this.newNiche = null
      return this.typePicker(`Понял, ${niche}. Что нужно сделать?`)
    }

    if (this.isTypeOnly(this.lastText)) {
      const type = this.profile.projectType as TypeKey
      return this.typeQuestion(type)
    }

    if (this.needsNiche() && !this.asked.has('nicheIntro')) {
      return this.nicheQuestion()
    }

    if (this.readyForSummary()) return this.summary()

    if (this.profile.projectType && this.turns >= 2 && !this.recommended) {
      return this.recommend()
    }

    const next = this.nextSlotQuestion()
    if (next) return next

    if (!this.profile.contact) {
      this.asked.add('contact')
      return {
        text: 'Чтобы передать заявку разработчику, оставьте Telegram — остальное уже учёл.',
        suggestions: [{ label: 'Указать контакт', focus: true }],
      }
    }

    return this.summary()
  }

  private isTypeOnly(text: string) {
    const alone =
      /^(лендинг|landing page|landing|корпоративный сайт|корпоративник|web app|веб-приложение|приложение|crm|система|saas|платформа|телеграм бот|телеграм-бот|telegram бот|бот|ai-агент|ai агент|ии-агент|агент)$/
    if (alone.test(text) && this.asked.has('projectType') && this.profile.projectType) {
      return true
    }
    return false
  }

  private readyForSummary() {
    return Boolean(
      this.profile.projectType &&
        this.profile.projectType !== 'unknown' &&
        this.profile.contact &&
        this.pendingSlots().length === 0,
    )
  }

  private pendingSlots() {
    const type = this.profile.projectType as TypeKey | undefined
    return slots.filter(
      (slot) => !this.asked.has(slot.key) && (!slot.applies || !type || slot.applies.includes(type)),
    )
  }

  private typeQuestion(type: TypeKey): Turn {
    this.askedQuestion = true
    this.asked.add('projectType')
    const question = typeQuestions[type]
    return { text: question.ask, suggestions: question.chips }
  }

  private knowledgeBaseQuestion(): Turn {
    this.askedQuestion = true
    this.asked.add('projectType')
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

  private typePicker(prelude?: string): Turn {
    this.askedQuestion = true
    this.asked.add('projectType')
    return {
      text: prelude ?? 'Что нужно сделать?',
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

  private nicheQuestion(): Turn {
    this.askedQuestion = true
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
      return this.continueAfter({
        text: `${demo.title} — ${demo.note}. Демо открывается без авторизации, достаточно перейти по ссылке.`,
        link: { label: `Открыть ${demo.title}`, url: demo.url },
        suggestions: [{ label: 'Показать пример', send: 'Покажите примеры' }],
      })
    }

    return this.continueAfter({
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
    })
  }

  private demoAnswer(): Turn {
    if (!this.profile.niche && !this.profile.projectType) {
      return {
        text: 'В портфолио есть лендинги, сайт с CRM, SaaS-платформа и AI-консультант. Скажите, что вам нужно, и я покажу подходящий пример.',
        suggestions: [
          { label: 'Лендинг', send: 'Лендинг' },
          { label: 'Сайт + CRM', send: 'Нужна CRM для компании' },
          { label: 'AI-агент', send: 'AI-агент' },
        ],
      }
    }

    this.recommended = true
    const demo = demos[this.demoKey()]
    const access = demo.accounts ? ` Демо-доступ: ${demo.accounts.join('; ')}.` : ''
    return this.continueAfter({
      text: `Рекомендую посмотреть ${demo.title} — ${demo.note}.${access} ${DEMO_WARNING}`,
      link: { label: `Открыть ${demo.title}`, url: demo.url },
      suggestions: [
        { label: 'Сколько стоит?', send: 'Сколько стоит?' },
        { label: 'Оставить контакт', focus: true },
      ],
    })
  }

  private recommend(): Turn {
    this.recommended = true
    const service = this.service()
    const next = this.nextSlotQuestion()
    if (!service) return next ?? this.demoAnswer()

    const demo = demos[this.demoKey()]
    const price = service.from ?? 'определяется после обсуждения'
    const term = service.term ?? 'срок зависит от объёма функционала'
    const text = [
      `Судя по вашим требованиям, лучше всего подойдёт ${service.name}.`,
      `Посмотрите ${demo.title} — ${demo.note}.${demo.accounts ? ` Демо-доступ: ${demo.accounts.join('; ')}.` : ''}`,
      `${DEMO_WARNING}${demo.needsAuth ? ` ${RENDER_WARNING}` : ''}`,
      `Стоимость — ${price}, срок — ${term}. ${PRICE_DISCLAIMER}`,
      next ? next.text : '',
    ]
      .filter(Boolean)
      .join(' ')

    const suggestions: Suggestion[] = []
    if (next) suggestions.push(...(next.suggestions ?? []))
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
      'Следующий шаг: написать разработчику в Telegram.',
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

  /** Защита от дословного повтора: меняем начало, чтобы ответ не выглядел копией. */
  private remember(turn: Turn): Turn {
    this.lastChips = (turn.suggestions ?? [])
      .map((item) => (item.send ? normalize(item.send) : ''))
      .filter(Boolean)
    this.answerChips = this.askedQuestion ? [...this.lastChips] : []

    if (!this.recent.includes(turn.text)) {
      this.recent.push(turn.text)
      if (this.recent.length > 6) this.recent.shift()
      return turn
    }

    const openers = [
      'По этому же вопросу, коротко:',
      'Отвечаю иначе:',
      'Ещё раз, но по делу:',
    ]
    const opener = openers[this.repeats % openers.length]
    this.repeats += 1
    return { ...turn, text: `${opener} ${turn.text}` }
  }
}

export function createLocalBrain(): Brain {
  return new LocalBrain()
}

