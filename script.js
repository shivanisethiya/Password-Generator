const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copybtn]");
const msgCopy = document.querySelector("[data-mgcopy]");
const lengthDisplay = document.querySelector("[data-length]");
const slider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generateButton");
const symbol = '!~@#$%^]&*()_;-[+{}|":?></.,';
const strengthMsg=document.querySelector("[data-strengthMsg]");
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleslider();
setIndicator("rgb(207, 203, 203)");
function handleslider() {
  slider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = slider.min;
  const max = slider.max;
  slider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
 
}
slider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleslider();
});
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getrandomNumber() {
  return randomInteger(0, 9);
}
function getrandomUppercase() {
  return String.fromCharCode(randomInteger(65, 91));
}
function getrandomLowercase() {
  return String.fromCharCode(randomInteger(97, 123));
}
function getrandomSymbol() {
  const index = randomInteger(0, symbol.length);
  return symbol.charAt(index);
}

 async function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolCheck.checked) hasSymbol = true;
  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("green");
    strengthMsg.innerText = "Strong";
    strengthMsg.classList.add("active");
    strengthMsg.style.color='green';
    setTimeout(() => {
      strengthMsg.classList.remove("active");
    }, 2000);
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("red");

    strengthMsg.innerText = "Weak";
    strengthMsg.style.color='red';
    strengthMsg.classList.add("active");
    setTimeout(() => {
      strengthMsg.classList.remove("active");
    }, 2000);
  } else {
    setIndicator("rgb(207, 203, 203)");
    strengthMsg.innerText = "Normal";
    strengthMsg.style.color='rgb(207, 203, 203)';
    strengthMsg.classList.add("active");
    setTimeout(() => {
      strengthMsg.classList.remove("active");
    }, 2000);
  }
}

async function copycontent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    msgCopy.innerText = "copied";
  } catch (e) {
    strengthMsg.innerText = "Failed";
  }
  msgCopy.classList.add("active");
  setTimeout(() => {
    msgCopy.classList.remove("active");
  }, 2000);
}

copybtn.addEventListener("click", () => {
  if (passwordDisplay.value) copycontent();
});
function handelcheckboxChange() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }
}
allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handelcheckboxChange);
});
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
generatebtn.addEventListener("click", () => {
  if (checkCount == 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }
  password = "";
  let funarr = [];

  if (uppercaseCheck.checked) funarr.push(getrandomUppercase);
  if (lowercaseCheck.checked) funarr.push(getrandomLowercase);
  if (numbersCheck.checked) funarr.push(getrandomNumber);
  if (symbolCheck.checked) funarr.push(getrandomSymbol);

  for (let i = 0; i < funarr.length; i++) {
    password += funarr[i]();
  }
  for (let i = 0; i < passwordLength - funarr.length; i++) {
    let randIndex = randomInteger(0, funarr.length);

    password += funarr[randIndex]();
  }
  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;
  calcStrength();
});
