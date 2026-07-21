import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { useSelectedItemsStore } from './store/selectedItemsStore'
import React from 'react'

const catalogs: Record<string, Record<string, string>> = {
  Header: {
    brand: 'Pokemon Search',
    about: 'About',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    languageLabel: 'Language',
    languageEn: 'English',
    languageRu: 'Russian'
  },
  HomePage: {
    title: 'Pokemon Search',
    refresh: 'Refresh',
    testError: 'Test Error'
  },
  Search: {
    placeholder: 'Enter pokemon name...',
    submit: 'Search',
    hint: 'The search is performed by the full name of the Pokemon'
  },
  CardList: {
    loading: 'Loading...',
    unselectAll: 'Unselect all',
    download: 'Download',
    previous: 'Prev',
    next: 'Next'
  },
  Details: {
    close: 'Close',
    refresh: 'Refresh',
    loading: 'Loading details...',
    unknown: 'unknown'
  },
  AboutPage: {
    title: 'About',
    author: 'Author:',
    course: 'Course:'
  },
  NotFound: {
    title: '404',
    message: 'Page not found.',
    back: 'Back to main page'
  }
}

function formatMessage(template: string, values: Record<string, unknown> = {}) {
  if (template.includes('{count, plural')) {
    const count = Number(values.count ?? 0)
    return count === 1 ? `${count} selected item` : `${count} selected items`
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}

vi.mock('next-intl', () => {
  return {
    useLocale: () => 'en',
    useTranslations: (namespace: string) => {
      return (key: string, values: Record<string, unknown> = {}) => {
        const template = catalogs[namespace]?.[key] ?? key

        return formatMessage(template, values)
      }
    },
    NextIntlClientProvider: ({children}: {children: React.ReactNode}) => children
  }
})

vi.mock('next-intl/server', () => {
  return {
    getTranslations: async (namespace: string) => {
      return (key: string, values: Record<string, unknown> = {}) => {
        const template = catalogs[namespace]?.[key] ?? key

        return formatMessage(template, values)
      }
    },
    getLocale: async () => 'en',
    getMessages: async () => ({})
  }
})

vi.mock('next-intl/navigation', () => {
  return {
    createNavigation: () => ({
      Link: ({href, children}: {href: string; children: React.ReactNode}) => React.createElement('a', {href}, children),
      usePathname: () => '/en',
      useRouter: () => ({
        replace: vi.fn(),
        push: vi.fn()
      })
    })
  }
})


afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  useSelectedItemsStore.setState({ selectedItems: [] })
})
