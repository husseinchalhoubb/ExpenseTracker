const transactionInput = document.getElementById("transaction");
const amountInput = document.getElementById("amount");
const form = document.getElementsByTagName("form")[0];

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const history = document.getElementById("history");

// algorithm
// 1. add form submit event listener
// 2. get the transaction and amount and create a new transaction object
// 3. add the transaction to the array
// 4. loop over the transactions array and add them to the DOM
// 5. update the balance, income and expense
// 6. add delete functionality
// 7. persist data to local storage

// Event Listener
form.addEventListener("submit", addTransaction);

const localStorageTransactions = localStorage.getItem("transactions");

let transactions = localStorageTransactions
  ? JSON.parse(localStorageTransactions)
  : [];

window.onload = updateDom;

// to reduce duplicate code and make it reusable
function updateDom() {
  addTransactionsToDom();
  calculateSummaryAndAddToDom();
}

function addTransaction(event) {
  event.preventDefault();

  // get the transaction and amount
  const transaction = transactionInput.value;
  const amount = amountInput.value;

  // check wether they are empty or no
  if (transaction.trim() === "" || amount.trim() === "") {
    alert("Please enter valid transaction and amount");
  } else {
    // create new transaction object
    const newTransaction = {
      id: generateID(),
      transaction,
      amount,
    };

    transactions.push(newTransaction);

    updateDom();

    syncLocalStorage();

    // clear the inputs
    transactionInput.value = "";
    amountInput.value = "";
  }
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateDom();

  syncLocalStorage();
}

function addTransactionsToDom() {
  // clear the history
  history.innerHTML = "";

  transactions.forEach((transactionData) => {
    // create the html element and append it to the history list
    const li = document.createElement("li");
    li.classList.add(
      "relative",
      "group",
      "flex",
      "items-center",
      "justify-between",
      "p-2",
      "bg-white",
      "shadow",
      "border-r-4"
    );

    const amountSign = transactionData.amount < 0 ? "-" : "+";

    if (amountSign === "-") {
      li.classList.add("border-red-500");
    } else {
      li.classList.add("border-green-500");
    }

    li.innerHTML = `
        <button
        onclick={removeTransaction(${transactionData.id})}
        class="absolute -left-6 bg-red-500 text-white px-2 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-150">x</button>

        <span>${transactionData.transaction}</span>
        <span>${transactionData.amount}</span>
      `;

    history.appendChild(li);
  });
}

function calculateSummaryAndAddToDom() {
  let totalIncome = 0;
  let totalExpense = 0;

  for (let transaction of transactions) {
    if (transaction.amount > 0) totalIncome += Number(transaction.amount);
    else totalExpense += Number(transaction.amount);
  }

  const totalBalance = totalIncome + totalExpense;

  balance.innerText = `$ ${Math.abs(totalBalance).toFixed(2)}`;
  income.innerText = `$ ${totalIncome.toFixed(2)}`;
  expense.innerText = `$ ${Math.abs(totalExpense).toFixed(2)}`;
}

function syncLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// generate random id
function generateID() {
  return Math.floor(Math.random() * 1000);
}

// convert variable to string
// String(variable) or variable.toString()

// convert variable to number
// Number(variable) or parseInt(variable) or parseFloat(variable) or +variable
