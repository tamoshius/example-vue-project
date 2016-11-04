// Set the key we'll use in local storage.
// Go to Chrome dev tools, application tab, click "Local Storage" and "http://localhost:8080"
// and you'll see this key set below (if logged in):
export const STORAGE_KEY = 'example-vue-project'

let initialState = {
  'auth': {
    'isLoggedIn': false,
    'accessToken': null,
    'refreshToken': null
  },
  'user': {
    'name': null
    // ...more user profile properties can go here.
  }
}

// Check local storage for our key and retrieve the data, if it exists,
// otherwise use defaults.
if (localStorage.getItem(STORAGE_KEY)) {
  initialState = JSON.parse(localStorage.getItem(STORAGE_KEY))
}

export const state = initialState
