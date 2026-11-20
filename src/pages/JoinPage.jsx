import { useEffect, useRef, useState } from 'react'
import TodoNotice from '../components/TodoNotice.jsx'
import './JoinPage.css'

const initialValues = { name: '', group: '', phone: '', motivation: '' }

function validateField(name, value) {
  const text = value.trim()
  if (!text) return { name: 'Введите имя.', group: 'Укажите группу.', phone: 'Введите телефон.', motivation: 'Расскажите, почему хотите вступить.' }[name]
  if (name === 'phone') {
    const normalized = text.replace(/[\s()-]/g, '')
    if (!/^(?:\+996\d{9}|\d{9,12})$/.test(normalized)) return 'Введите телефон в формате +996 и 9 цифр или от 9 до 12 цифр без знака +.'
  }
  if (name === 'motivation' && Array.from(text).length < 20) return 'Напишите не менее 20 символов.'
  return ''
}

export default function JoinPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef(null)
  const successRef = useRef(null)

  useEffect(() => {
    if (submitted) successRef.current?.focus()
  }, [submitted])

  function onChange(event) {
    const { name, value } = event.target
    setValues(current => ({ ...current, [name]: value }))
  }

  function onBlur(event) {
    const { name, value } = event.target
    setErrors(current => ({ ...current, [name]: validateField(name, value) }))
  }

  function onSubmit(event) {
    event.preventDefault()
    const nextErrors = Object.fromEntries(Object.entries(values).map(([name, value]) => [name, validateField(name, value)]))
    setErrors(nextErrors)
    const invalid = Object.keys(values).find(name => nextErrors[name])
    if (invalid) {
      formRef.current.elements.namedItem(invalid)?.focus()
      return
    }
    // TODO: выбрать Formspree или EmailJS и подключить отправку на сервер.
    // Демонстрация успешной проверки: данные не отправляются и нигде не сохраняются.
    setValues(initialValues)
    setErrors({})
    setSubmitted(true)
  }

  const fieldProps = name => ({
    id: `join-${name}`, name, value: values[name], required: true,
    onChange, onBlur, 'aria-invalid': Boolean(errors[name]),
    'aria-describedby': `${name}-hint${errors[name] ? ` ${name}-error` : ''}`,
  })

  if (submitted) return (
    <main className="ec-page ec-join-success">
      <h1 ref={successRef} tabIndex={-1}>Спасибо, мы получили заявку</h1>
      <TodoNotice>TODO: подключить отправку через Formspree или EmailJS. Пока это демонстрационный экран: заявка не отправлена в клуб, личные данные не сохранены.</TodoNotice>
    </main>
  )

  return (
    <main className="ec-page">
      <div className="ec-hero"><h1>Присоединиться</h1><TodoNotice>TODO: подключить отправку заявки. Сейчас работает только проверка полей; личные данные не сохраняются.</TodoNotice></div>
      <form ref={formRef} className="ec-join-form" noValidate onSubmit={onSubmit} autoComplete="off">
        <div className="ec-join-field">
          <label htmlFor="join-name">Имя</label><input {...fieldProps('name')} type="text" />
          <span className="ec-join-hint" id="name-hint">Обязательное поле.</span>
          {errors.name && <span className="ec-join-error" id="name-error">{errors.name}</span>}
        </div>
        <div className="ec-join-field">
          <label htmlFor="join-group">Группа</label><input {...fieldProps('group')} type="text" />
          <span className="ec-join-hint" id="group-hint">Укажите свою группу. Обязательное поле.</span>
          {errors.group && <span className="ec-join-error" id="group-error">{errors.group}</span>}
        </div>
        <div className="ec-join-field">
          <label htmlFor="join-phone">Телефон</label><input {...fieldProps('phone')} type="tel" inputMode="tel" />
          <span className="ec-join-hint" id="phone-hint">Формат: +996 и 9 цифр или 9–12 цифр. Обязательное поле.</span>
          {errors.phone && <span className="ec-join-error" id="phone-error">{errors.phone}</span>}
        </div>
        <div className="ec-join-field">
          <label htmlFor="join-motivation">Почему хочу вступить</label><textarea {...fieldProps('motivation')} minLength={20} />
          <span className="ec-join-hint" id="motivation-hint">Не менее 20 символов. Обязательное поле.</span>
          {errors.motivation && <span className="ec-join-error" id="motivation-error">{errors.motivation}</span>}
        </div>
        <button className="ec-join-submit" type="submit">Отправить заявку</button>
      </form>
    </main>
  )
}
