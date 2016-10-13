/* globals localStorage */

export const STORAGE_KEY = 'pricematchers'

var initialState = {
  'auth': {
    'isLoggedIn': false
  }
}

if (localStorage.getItem(STORAGE_KEY)) {
  initialState = JSON.parse(localStorage.getItem(STORAGE_KEY))
}

export const state = initialState
