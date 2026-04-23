

export function debounce(func, delay = 300) {
  let timer;
  return (...args) => {
    // Clear the previous timer if the function is called again
    clearTimeout(timer); 
    // Start a new timer
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/*
//-----------------------------------------------
function updateMessageScroll(){}
const scrollMessages = debounce(updateMessageScroll, 100);
//-----------------------------------------------
// 1. The function to be debounced
const saveInput = (value) => {
  console.log("Saving data:", value);
};
// 2. Create the debounced handle
const processChange = debounce((e) => saveInput(e.target.value), 500);
// 3. Attach it to an element
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', processChange);
//-----------------------------------------------
*/