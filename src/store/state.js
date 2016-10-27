/* globals localStorage */
import { defaultState } from './default-state'

// Set the key we'll use in local storage.
// Go to Chrome dev tools, application tab, click "Local Storage" and "http://localhost:8080"
// and look for the key set below:
export const STORAGE_KEY = 'example-vue-project'

let initialState = defaultState

// Check local storage for our key and retrieve the data, if it exists,
// otherwise use defaults.
if (localStorage.getItem(STORAGE_KEY)) {
  initialState = JSON.parse(localStorage.getItem(STORAGE_KEY))
}

export const state = initialState
