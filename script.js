'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'ar-SY',
};

const accounts = [account1, account2, account3, account4];

let currentUser, timer;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Displaying the movement rows in the movement section
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // sorting function implementation
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const optionsDate = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    const optionsNumbers = {
      style: 'currency',
      currency: acc.currency,
    };

    const date = new Intl.DateTimeFormat(acc.locale, options).format(
      new Date(acc.movementsDates[i])
    );
    const formatedMovement = new Intl.NumberFormat(
      acc.locale,
      optionsNumbers
    ).format(mov.toFixed(2));

    const html = ` <div class="movements__row">
                    <div class="movements__type movements__type--${type}"> ${
      i + 1 + ` ${type}`
    }</div>
                    <div class="movements__date">${date}</div>
                    <div class="movements__value">${formatedMovement}</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Creating a user name for the users
const createUserName = function (accounts) {
  accounts.forEach(function (acc) {
    acc.Username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(val => val[0])
      .join('');
  });
};

//Calculating and printing the balance of the acounts
const calcAndDisplayBalance = function (account) {
  const balance = account.movements.reduce(
    (accumilator, currentvalue) => (accumilator += currentvalue),
    0
  );
  account.balance = balance.toFixed(2);
  labelBalance.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(balance.toFixed(2))} `;
};

// creating the display summary (added rule that interest will not be payed for values that are less than one)

const displaySummary = function (account) {
  const deposits = account.movements
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0);

  const withdrawals = account.movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);

  const interest = account.movements // could have used the deposits variable, but for practice this was used
    .filter(val => val > 0)
    .map(trs => (trs * account.interestRate) / 100)
    .filter(val => val >= 1)
    .reduce((acc, val) => acc + val);

  // the formating of the currencies could be put in a function to reduce repition

  labelSumIn.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(deposits.toFixed(2))} `;
  labelSumOut.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(Math.abs(withdrawals).toFixed(2))} `;
  labelSumInterest.textContent = `${new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(interest.toFixed(2))} `;
};

// Implemeting the loging function

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submiting

  currentUser = accounts.find(acc => acc.Username === inputLoginUsername.value);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Display UI and a Welcome message, display balance summary and movements
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOutTimer();
    updateUI();
  }
});

// THe logout timer

const startLogOutTimer = function () {
  // set the time to 5 min
  let time = 300;

  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);

    //in each call print the remaining time to the interface
    labelTimer.textContent = `${minutes}: ${seconds}`;

    // when the timer hits o logout
    if (time === 0) {
      clearInterval(timer);
      //hide UI
      containerApp.style.opacity = 0;
      // clearing the data
      inputCloseUsername.value = inputClosePin.value = '';
      //welcome message
      labelWelcome.textContent = 'Login to get started';
    }
    // decreasing 1 second
    time--;
  };

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// implementing the transfer options

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(acc => acc.Username === inputTransferTo.value);

  if (
    amount > 0 &&
    reciever &&
    currentUser.balance >= amount &&
    reciever?.Username != currentUser.Username
  ) {
    reciever?.movements.push(amount);
    reciever?.movementsDates.push(new Date().toISOString());
    currentUser.movements.push(amount * -1);
    currentUser.movementsDates.push(new Date().toISOString());
    updateUI();
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

// function to update the UI
const updateUI = function (account = currentUser) {
  displaySummary(account);
  displayMovements(account);
  calcAndDisplayBalance(account);
};

//Loan option
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  // console.log(loanAmount);
  // console.log(currentUser.movements.some(val => val / 10 >= loanAmount));

  setTimeout(function () {
    if (
      currentUser.movements.some(val => val / 10 >= loanAmount) &&
      loanAmount > 0
    ) {
      currentUser.movements.push(loanAmount);
      currentUser.movementsDates.push(new Date().toISOString());
      updateUI();
      clearInterval(timer);
      timer = startLogOutTimer();
    } else {
      alert('Loan approval denied');
    }
  }, 2500);
});

// deleting the account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentUser.Username === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      val => val.Username === currentUser.Username
    );
    //delete user
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
    // clearing the data
    inputCloseUsername.value = inputClosePin.value = '';
  } else {
    alert('invalid credentials');
  }
});

let sortStatus = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentUser.movements, (sortStatus = !sortStatus));
});

createUserName(accounts);

// changing the colour of the rows (just for fun)
const isEven = val => val % 2 === 0;

labelBalance.addEventListener('click', function () {
  console.log('1111');
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    console.log(row);
    if (i % 2 === 0) {
      row.style.backgroundColor = 'gray';
    }
    if (i % 3) {
      row.style.backgroundColor = 'blue';
    }
  });
});

// Setting dates
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hours = `${now.getHours() + 1}`.padStart(2, 0);
const min = `${now.getMinutes() + 1}`.padStart(2, 0);
const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'short',
};

const local = navigator.language;

labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);
