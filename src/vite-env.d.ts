/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Адреса обработчиков заявок через запятую.
   * Значение `none` — форма сразу открывает Telegram без сетевых запросов.
   */
  readonly VITE_LEAD_ENDPOINTS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
