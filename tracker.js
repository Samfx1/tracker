class FinancialTracker {
    constructor() {
        // Always start with a fresh slate
        this.transactions = [];
        
        this.initializeEventListeners();
        this.renderTransactions();
        this.setupResetButton();
    }

    setupResetButton() {
        const resetBtn = document.getElementById('resetBtn');
        resetBtn.addEventListener('click', () => {
            // Clear local storage and reset transactions
            localStorage.removeItem('transactions');
            this.transactions = [];
            this.renderTransactions();
            
            // Optional: Add a visual feedback
            resetBtn.textContent = '✅ Reset Complete';
            setTimeout(() => {
                resetBtn.textContent = '🔄 Reset All';
            }, 2000);
        });
    }

    initializeEventListeners() {
        const form = document.getElementById('transactionForm');
        form.addEventListener('submit', this.addTransaction.bind(this));
    }

    addTransaction(event) {
        event.preventDefault();
        const description = document.getElementById('description');
        const amount = document.getElementById('amount');
        const type = document.getElementById('type');

        const transaction = {
            id: Date.now(),
            description: description.value,
            amount: parseFloat(amount.value),
            type: type.value,
            date: new Date().toLocaleDateString()
        };

        this.transactions.push(transaction);
        this.renderTransactions();

        // Reset form
        description.value = '';
        amount.value = '';
        type.selectedIndex = 0;
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.renderTransactions();
    }

    renderTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        const totalIncome = document.getElementById('totalIncome');
        const totalExpenses = document.getElementById('totalExpenses');
        const netBalance = document.getElementById('totalBalance');
        const netBalanceCard = document.getElementById('netBalance');

        // Clear existing list
        transactionsList.innerHTML = '<h3>Transaction History</h3>';

        let income = 0, expenses = 0;

        this.transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                income += transaction.amount;
            } else {
                expenses += transaction.amount;
            }

            const transactionElement = document.createElement('div');
            transactionElement.classList.add('transaction-item');
            transactionElement.innerHTML = `
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <span>${transaction.date}</span>
                </div>
                <div class="transaction-amount ${transaction.type === 'income' ? 'transaction-income' : 'transaction-expense'}">
                    $${transaction.amount.toFixed(2)}
                </div>
                <button class="delete-btn" onclick="tracker.deleteTransaction(${transaction.id})">🗑️</button>
            `;

            transactionsList.appendChild(transactionElement);
        });

        const balance = income - expenses;

        totalIncome.textContent = `$${income.toFixed(2)}`;
        totalExpenses.textContent = `$${expenses.toFixed(2)}`;
        netBalanceCard.textContent = `$${balance.toFixed(2)}`;
        netBalance.textContent = `$${balance.toFixed(2)}`;
        
        // Set balance color
        netBalance.className = `balance ${balance >= 0 ? 'positive' : 'negative'}`;
    }
}

// Initialize tracker when page loads
const tracker = new FinancialTracker();