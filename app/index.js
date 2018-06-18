console.log('logging from index.js');
const passInput = document.getElementById('pass');
let pwArray = [];

(() => {
  async function fetchPws() {
    const response = await fetch('http://localhost:3000/passwords');
    const passwords = await response.text();

    pwArray = passwords.split('\n');

    console.log(pwArray.length); // should be 999999
  }
  fetchPws();
})();

/** checkPass - The main function that starts when the user clicks "check" */
function checkPass() {
  let password = document.getElementById('pass').value;
  if (checkPassLength(password) && verifyChars(password)) {
    checkCommonPasswords(password);
  }
}

/** checkCommonPasswords - Verify the user given password is not in the password dictionary
 * @param {string} password
 */
function checkCommonPasswords(password) {
  for (let cpass of pwArray) {
    if (password == cpass) {
      console.log(`${password} is a common password. Please enter a more unique password.`);
      document.getElementById('pass').classList.add('invalid');
      document.getElementById('failureMessage').removeAttribute('hidden');
      return null;
    }
  }
  console.log('Congratulations! Your password meets the Digital Identity Requirements of NIST.');
  document.getElementById('successMessage').removeAttribute('hidden');
  document.getElementById('pass').classList.remove('invalid');
  document.getElementById('pass').classList.add('valid');

  return true;
}

/** checkPassLength- Verify the length of a password is between 8-64 characters
 * @param {string} password
 */
function checkPassLength(password) {
  if (password.length >= 8 && password.length <= 64) {
    return true;
  } else {
    console.log(`Your password failed the length requirements. Passwords must be between 8-64 characters`);
    return null;
  }
}

/** verifyChars - test that password contains ASCII characters only
 * @param {string} password
 */
function verifyChars(password) {
  if (/^[\x00-\x7F]*$/.test(password)) {
    return true;
  } else {
    console.log('Your password failed. Please only use ASCII characters');
    return null;
  }
}

passInput.onkeyup = function() {
  var element = document.getElementById('pass');
  document.getElementById('successMessage').setAttribute('hidden', '');
  document.getElementById('failureMessage').setAttribute('hidden', '');
  element.classList.remove('valid');
  element.classList.remove('invalid');
};

// Logging tests to the console:
// TODO: Add karma & headless chrome for automated browser tests
function validationChecker() {
  console.log(/^[\x00-\x7F]*$/.test('superman')); // should return true
  console.log(/^[\x00-\x7F]*$/.test('Ssuper man4GB#$%* (!@vv')); //should return true
  console.log(/^[\x00-\x7F]*$/.test('ßsuperman')); // should return false
  console.log(/^[\x00-\x7F]*$/.test('trademarked™')); // should return false
  console.log(verifyChars('ßßossMan5000')); // returns null with ASCII failure message
  console.log(checkPassLength('small')); // returns null with length failure message
  console.log(checkPassLength('thispasswordistoolongbecauseitisoverthemaximumcharacterlimitation')); // returns null with length failure message
}
validationChecker();
