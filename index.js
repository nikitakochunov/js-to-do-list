const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos'

const body = document.querySelector('body')
const deleteModal = createDeleteModal()
body.append(deleteModal)

// Объект для сохранения данных задачи, которую нужно удалить
let deletingTaskObj = {}

deleteModal.addEventListener('click', event => {
  const {target} = event

  if (target.classList.contains('modal-overlay') ||
    target.classList.contains('delete-modal__cancel-button')) {
    deletingTaskObj = {}
    closeDeleteModal()
  }

  if (target.classList.contains('delete-modal__confirm-button')) {
    const {id, taskItem} = deletingTaskObj
    if (id && taskItem) {
      taskItem.remove()
      tasks = tasks.filter(task => task.id !== id)
      deleteFromLocalStorage(id)
    }
    closeDeleteModal()
  }
})

const tasksList = document.querySelector('.tasks-list')
let tasks = []
tasksList.addEventListener('click', event => {
  const {target} = event
  const isDeleteButton = target.className.includes('task-item__delete-button')
  // const isCheckboxForm = target.parentNode.className.includes('checkbox-form')

  if (isDeleteButton) {
    const taskItem = target.closest('.task-item')
    const id = Number(taskItem.dataset.taskId)
    deletingTaskObj = {id, taskItem}
    showDeleteModal()
  }
})

render()

// getAllTodos()

const createTaskForm = document.querySelector('.create-task-block')
createTaskForm.addEventListener('submit', event => {
  event.preventDefault()
  const {target} = event
  const taskNameInput = target.taskName
  const inputValue = taskNameInput.value.trim()
  const id = Date.now()

  const isValid = checkInputValueOnValidation(inputValue)
  if (isValid) {
    const taskObj = {text: inputValue, id, completed: false}
    tasks.push(taskObj)
    setItemToLocalStorage(taskObj)

    const taskItem = createTaskItem(taskObj)

    if (!isLightThemeNow) {
      taskItem.style.color = '#ffffff'
      taskItem.querySelector('.task-item__delete-button').style.border = '1px solid #ffffff'
    }

    tasksList.append(taskItem)
    taskNameInput.value = ''
  }
})

let isLightThemeNow = true

document.addEventListener('keyup', event => {
  const {key} = event
  if (key === 'Tab') {
    changeAppTheme(isLightThemeNow)
    isLightThemeNow = !isLightThemeNow
  }
})


// async function getAllTodos() {
// const errorMessage = 'Ошибка при получении данных о задачах!'
//   const loader = document.createElement('span')
//   loader.innerText = 'Loading...'
//   loader.style.fontSize = '24px'
//   loader.style.fontWeight = 'bold'
//   tasksList.append(loader)
//
//   try {
//     const response = await fetch(TODOS_URL)
//     if (!response.ok) {
//       tasksList.innerText = errorMessage
//       tasksList.style.fontSize = '24px'
//       tasksList.style.fontWeight = 'bold'
//       throw new Error(errorMessage)
//     }
//
//     const todos = await response.json()
//     todos.forEach(todo => {
//       const todoObj = {text: todo.title, id: todo.id, completed: false}
//       const todoHTML = createTaskItem(todoObj)
//
//       tasks.push(todoObj)
//       tasksList.append(todoHTML)
//     })
//   } catch (error) {
//     console.error(error)
//   } finally {
//     loader.remove()
//   }
// }

function render() {
  const tasksFromStorage = getItemFromLocalStorage()

  if (!Array.isArray(tasksFromStorage) && tasksFromStorage !== null) {
    tasks.push(tasksFromStorage)
    const taskHTML = createTaskItem(task)
    tasksList.append(taskHTML)
  } else if (Array.isArray(tasksFromStorage)) {
    tasks = tasksFromStorage

    tasks.forEach(task => {
      const taskHTML = createTaskItem(task)
      tasksList.append(taskHTML)
    })
  }


}

function setItemToLocalStorage(item, key = 'tasks') {
  let tasks = []
  const tasksFromStorage = getItemFromLocalStorage()

  if (!Array.isArray(tasksFromStorage) && tasksFromStorage !== null) {
    tasks.push(tasksFromStorage)
  } else if (Array.isArray(tasksFromStorage)) {
    tasks = tasksFromStorage
  }

  tasks.push(item)
  const tasksJSON = JSON.stringify(tasks)

  localStorage.setItem(key, tasksJSON)
}

function getItemFromLocalStorage(key = 'tasks') {
  return JSON.parse(localStorage.getItem(key))
}

function deleteFromLocalStorage(id, key = 'tasks') {
  let tasksFromStorage = getItemFromLocalStorage()
  tasksFromStorage = tasksFromStorage.filter(task => task.id !== id)

  localStorage.setItem(key, JSON.stringify(tasksFromStorage))
}

// Функция isValid проверяет валидность введенного названия задачи
function checkInputValueOnValidation(inputValue) {
  const doesTaskExist = checkIfTaskAlreadyExists(inputValue)
  const errorBlock = createTaskForm.querySelector('.error-message-block')
  const doesErrorBlockExists = errorBlock ? true : false

  const forbiddenSymbol = '6'

  if (!inputValue || doesTaskExist || inputValue.includes(forbiddenSymbol)) {
    if (!doesErrorBlockExists) {
      const newErrorBlock = document.createElement('span')
      newErrorBlock.className = 'error-message-block'
      newErrorBlock.innerText = `Название задачи должно быть уникальным и непустым и не должно включать символ '${forbiddenSymbol}'`
      createTaskForm.append(newErrorBlock)
    }
    return false
  }

  if (doesErrorBlockExists) {
    errorBlock.remove()
  }

  return true
}

// Функция doesTaskExist() проверяет, есть ли уже такая задача в списке
function checkIfTaskAlreadyExists(addedTaskText) {
  if (!tasks.length) {
    return false
  }

  const foundTask = tasks.find(task => task.text.toLowerCase() === addedTaskText.toLowerCase())
  return Boolean(foundTask)
}

// Функция createTaskItem() формирует HTML-код для созданной задачи
function createTaskItem({text, id}) {
  const taskItem = document.createElement('div')
  taskItem.className = 'task-item'
  taskItem.dataset.taskId = id

  const taskItemMainContainer = document.createElement('div')
  taskItemMainContainer.className = 'task-item__main-container'
  taskItem.append(taskItemMainContainer)

  const taskItemMainContent = document.createElement('div')
  taskItemMainContent.className = 'task-item__main-content'

  const checkboxForm = document.createElement('form')
  checkboxForm.className = 'checkbox-form'

  const checkboxFormCheckbox = document.createElement('input')
  checkboxFormCheckbox.className = 'checkbox-form__checkbox'
  checkboxFormCheckbox.type = 'checkbox'
  checkboxFormCheckbox.id = id

  const label = document.createElement('label')
  label.htmlFor = id

  checkboxForm.append(checkboxFormCheckbox, label)

  const taskItemText = document.createElement('span')
  taskItemText.className = 'task-item__text'
  taskItemText.innerText = text

  taskItemMainContent.append(checkboxForm, taskItemText)

  const taskItemDeleteButton = document.createElement('button')
  taskItemDeleteButton.classList.add('task-item__delete-button')
  taskItemDeleteButton.classList.add('default-button')
  taskItemDeleteButton.classList.add('delete-button')
  taskItemDeleteButton.dataset.deleteTaskId = '5'
  taskItemDeleteButton.innerText = 'Удалить'

  taskItemMainContainer.append(taskItemMainContent, taskItemDeleteButton)

  return taskItem
}

// Функция createDeleteModal() формирует HTML-код для модального окна,
// которое спрашивает об удалении задачи
function createDeleteModal() {
  const modalOverlay = document.createElement('div')
  modalOverlay.className = 'modal-overlay modal-overlay_hidden'

  const deleteModal = document.createElement('div')
  deleteModal.className = ' delete-modal'
  modalOverlay.append(deleteModal)

  const deleteModalQuestion = document.createElement('h3')
  deleteModalQuestion.className = ' delete-modal__question'
  deleteModalQuestion.innerText = 'Вы действительно хотите удалить эту задачу?'

  const deleteModalButtons = document.createElement('div')
  deleteModalButtons.className = ' delete-modal__buttons'

  deleteModal.append(deleteModalQuestion, deleteModalButtons)

  const deleteModalCancelButton = document.createElement('button')
  deleteModalCancelButton.className = ' delete-modal__button delete-modal__cancel-button'
  deleteModalCancelButton.innerText = 'Отмена'

  const deleteModalConfirmButton = document.createElement('button')
  deleteModalConfirmButton.className = ' delete-modal__button delete-modal__confirm-button'
  deleteModalConfirmButton.innerText = 'Удалить'

  deleteModalButtons.append(deleteModalCancelButton, deleteModalConfirmButton)

  return modalOverlay
}

// Функция showDeleteModal() показывает модальное окно
function showDeleteModal() {
  deleteModal.classList.remove('modal-overlay_hidden')
}

// Функция showDeleteModal() скрывает модальное окно
function closeDeleteModal() {
  deleteModal.classList.add('modal-overlay_hidden')
}

// Функция changeAppTheme() меняет тему приложения
function changeAppTheme(isLightTheme) {
  const newTheme = isLightThemeNow ? 'dark' : 'light'
  const body = document.querySelector('body')
  const taskItems = document.querySelectorAll('.task-item')
  const buttons = document.querySelectorAll('button')

  const styles = {
    bodyBackground: {
      dark: '#24292E',
      light: 'initial'
    },
    taskItemColor: {
      dark: '#ffffff',
      light: 'initial'
    },
    buttonBorder: {
      dark: '1px solid #ffffff',
      light: 'none'
    }
  }

  body.style.background = styles.bodyBackground[newTheme]
  taskItems.forEach(taskItem => {
    taskItem.style.color = styles.taskItemColor[newTheme]
  })
  buttons.forEach(button => {
    button.style.border = styles.buttonBorder[newTheme]
  })
}
