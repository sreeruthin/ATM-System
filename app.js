// Data structure to mimic the Java backend logic
let accounts = JSON.parse(localStorage.getItem('atm_accounts')) || {};
let currentAccount = null;

const appDiv = document.getElementById('app');

function saveData() {
    localStorage.setItem('atm_accounts', JSON.stringify(accounts));
}

// Render Engine
function render(template) {
    appDiv.innerHTML = template;
}

function showMessage(id, message, type) {
    const el = document.getElementById(id);
    if(el) {
        el.className = `alert ${type}`;
        el.innerText = message;
        setTimeout(() => { el.style.display = 'none'; }, 4000);
    }
}

// Format currency
const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(amount);

// Screens
function renderAuthScreen() {
    render(`
        <div class="glass-card">
            <h2>Welcome to Ruthin ATM</h2>
            <p>Enter your account details to continue.</p>
            <div id="auth-alert"></div>
            
            <form onsubmit="event.preventDefault(); login();">
                <div class="form-group">
                    <label for="accNum">Account Number</label>
                    <input type="text" id="accNum" placeholder="e.g. 1001" autocomplete="off">
                </div>
                
                <div class="form-group">
                    <label for="accPin">Password</label>
                    <input type="password" id="accPin" placeholder="Enter your password">
                </div>
                
                <button type="submit">Login</button>
                <button type="button" class="secondary" onclick="renderCreateScreen()">Create New Account</button>
            </form>
        </div>
    `);
}

function renderCreateScreen() {
    renderCreateStep1();
}

let tempCreateData = {};

function renderCreateStep1() {
    render(`
        <div class="glass-card">
            <h2>Step 1: Basic Details</h2>
            <p>Select your account type and provide your name.</p>
            <div id="create-alert"></div>
            
            <form onsubmit="event.preventDefault(); handleCreateStep1();">
                <div class="form-group">
                    <label for="newAccType">Account Type</label>
                    <select id="newAccType" style="width:100%; padding: 14px 16px; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-primary); font-size: 16px;">
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="newName">Full Name</label>
                    <input type="text" id="newName" placeholder="John Doe">
                </div>
                
                <button type="submit">Next Step</button>
                <button type="button" class="secondary" onclick="renderAuthScreen()">Cancel</button>
            </form>
        </div>
    `);
}

function renderCreateStep2() {
    render(`
        <div class="glass-card">
            <h2>Step 2: Account Security</h2>
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 16px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
                <div style="font-size:12px; color: #6ee7b7; text-transform:uppercase; letter-spacing: 1px; margin-bottom: 4px;">Assigned Account ID</div>
                <div style="font-size:32px; font-weight:700; color:#10b981; letter-spacing: 2px;">${tempCreateData.accountNumber}</div>
            </div>
            
            <p style="margin-bottom: 16px;">Please secure your new account with a password.</p>
            <div id="create-alert"></div>
            
            <form onsubmit="event.preventDefault(); handleCreateStep2();">
                <div class="form-group">
                    <label for="newPin">Create Password</label>
                    <input type="password" id="newPin" placeholder="Strong password">
                </div>
                
                <button type="submit">Next Step</button>
                <button type="button" class="secondary" onclick="renderCreateStep1()">Back</button>
            </form>
        </div>
    `);
}

function renderCreateStep3() {
    render(`
        <div class="glass-card">
            <h2>Step 3: Initial Deposit</h2>
            <p>Fund your newly created Account #${tempCreateData.accountNumber}</p>
            <div id="create-alert"></div>
            
            <form onsubmit="event.preventDefault(); handleCreateStep3();">
                <div class="form-group">
                    <label for="newDeposit">Initial Deposit</label>
                    <input type="number" id="newDeposit" placeholder="0" min="0" step="100">
                </div>
                
                <button type="submit">Complete Setup</button>
                <button type="button" class="secondary" onclick="renderCreateStep2()">Back</button>
            </form>
        </div>
    `);
}

function renderVerify(nextAction) {
    let actionLabel = '';
    if (nextAction === 'balance') actionLabel = 'Check Balance';
    if (nextAction === 'deposit') actionLabel = 'Deposit Funds';
    if (nextAction === 'withdraw') actionLabel = 'Withdraw Funds';
    if (nextAction === 'history') actionLabel = 'View History';
    if (nextAction === 'transfer') actionLabel = 'Send Money';

    render(`
        <div class="glass-card">
            <h2>Authentication Required</h2>
            <p>Please enter your password to ${actionLabel}.</p>
            <div id="verify-alert"></div>
            
            <form onsubmit="event.preventDefault(); handleVerify('${nextAction}');">
                <div class="form-group">
                    <label for="verifyPin">Password</label>
                    <input type="password" id="verifyPin" placeholder="Enter your password">
                </div>
                
                <button type="submit">Continue</button>
                <button type="button" class="secondary" onclick="renderDashboard()">Cancel</button>
            </form>
        </div>
    `);
}

function handleVerify(nextAction) {
    const pin = document.getElementById('verifyPin').value;
    if (currentAccount.password !== pin) {
        showMessage('verify-alert', 'Incorrect password.', 'error');
        return;
    }
    
    if (nextAction === 'balance') renderDashboard(true);
    if (nextAction === 'deposit') renderDeposit();
    if (nextAction === 'withdraw') renderWithdraw();
    if (nextAction === 'transfer') renderTransfer();
    if (nextAction === 'history') renderHistory();
}

function renderDashboard(showBalance = false) {
    const balanceText = showBalance ? formatCurrency(currentAccount.balance) : '***';
    const balanceBtn = showBalance ? '' : `<button class="secondary" style="margin-top:10px; font-size:12px; padding: 8px;" onclick="renderVerify('balance')">Show Balance</button>`;
    
    render(`
        <div class="glass-card">
            <h2>Hello, ${currentAccount.holderName}</h2>
            <p>Account Number: ${currentAccount.accountNumber}</p>
            <div id="dash-alert"></div>
            
            <div class="balance-display">
                <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: var(--text-secondary)">Available Balance</div>
                <div class="balance-amount">${balanceText}</div>
                ${balanceBtn}
            </div>

            <div class="action-grid" style="margin-bottom: 12px;">
                <button onclick="renderVerify('deposit')">Deposit</button>
                <button onclick="renderVerify('withdraw')">Withdraw</button>
            </div>
            
            <button onclick="renderVerify('transfer')" style="margin-bottom: 12px; border-color: rgba(99, 102, 241, 0.4); background: rgba(79, 70, 229, 0.1);">Send Money</button>
            <button class="secondary" onclick="renderVerify('history')">View Transaction History</button>
            <button class="secondary" style="border-color: rgba(239, 68, 68, 0.3); color: #fca5a5" onclick="logout()">Logout</button>
        </div>
    `);
}

function renderDeposit() {
    render(`
        <div class="glass-card">
            <h2>Deposit Funds</h2>
            <p>Add money securely to your account.</p>
            <div id="action-alert"></div>
            
            <form onsubmit="event.preventDefault(); handleDeposit();">
                <div class="form-group">
                    <label for="depAmount">Amount to Deposit</label>
                    <input type="number" id="depAmount" placeholder="0" min="100" step="100">
                </div>
                
                <button type="submit">Confirm Deposit</button>
                <button type="button" class="secondary" onclick="renderDashboard()">Cancel</button>
            </form>
        </div>
    `);
}

function renderWithdraw() {
    render(`
        <div class="glass-card">
            <h2>Withdraw Funds</h2>
            <p>Current balance: ${formatCurrency(currentAccount.balance)}</p>
            <div id="action-alert"></div>
            
            <form onsubmit="event.preventDefault(); handleWithdraw();">
                <div class="form-group">
                    <label for="withAmount">Amount to Withdraw</label>
                    <input type="number" id="withAmount" placeholder="0" min="100" step="100">
                </div>
                
                <button type="submit">Confirm Withdrawal</button>
                <button type="button" class="secondary" onclick="renderDashboard()">Cancel</button>
            </form>
        </div>
    `);
}

function renderHistory() {
    let historyHtml = currentAccount.history.length === 0 ? '<p>No transactions yet.</p>' : '';
    
    // Reverse logic so newest is on top
    const displayHistory = [...currentAccount.history].reverse();

    displayHistory.forEach(tx => {
        const isPos = tx.amount > 0;
        const colorClass = tx.type === 'deposit' || tx.type === 'creation' ? 'amount-pos' : 'amount-neg';
        const sign = '';
        
        historyHtml += `
            <div class="history-item">
                <div>
                    <div style="font-weight: 600; color: #fff">${tx.desc}</div>
                    <div style="font-size: 12px; color: var(--text-secondary)">${new Date(tx.date).toLocaleString()}</div>
                </div>
                <div class="${colorClass}">${sign}${formatCurrency(Math.abs(tx.amount))}</div>
            </div>
        `;
    });

    render(`
        <div class="glass-card">
            <h2>Transaction History</h2>
            <p>Recent activity for Account Number ${currentAccount.accountNumber}</p>
            
            <div class="history-list" style="margin-bottom: 24px;">
                ${historyHtml}
            </div>
            
            <button onclick="renderDashboard()">Back to Dashboard</button>
        </div>
    `);
}


// Actions
function login() {
    const accNum = document.getElementById('accNum').value.trim();
    const pin = document.getElementById('accPin').value;
    if (!accNum || !pin) {
        showMessage('auth-alert', 'Please enter account number and password.', 'error');
        return;
    }
    
    if (accounts[accNum]) {
        if (accounts[accNum].password === pin) {
            currentAccount = accounts[accNum];
            renderDashboard();
        } else {
            showMessage('auth-alert', 'Incorrect password.', 'error');
        }
    } else {
        showMessage('auth-alert', 'Account not found. Please create one.', 'error');
    }
}

function handleCreateStep1() {
    const accType = document.getElementById('newAccType').value;
    const name = document.getElementById('newName').value.trim();

    if (!name) {
        showMessage('create-alert', 'Please enter your full name.', 'error');
        return;
    }

    let accNum;
    do {
        accNum = Math.floor(1000 + Math.random() * 9000).toString();
    } while (accounts[accNum]);

    tempCreateData = {
        accountType: accType,
        holderName: name,
        accountNumber: accNum
    };

    renderCreateStep2();
}

function handleCreateStep2() {
    const pin = document.getElementById('newPin').value;
    if (!pin) {
        showMessage('create-alert', 'Please enter a password.', 'error');
        return;
    }
    
    tempCreateData.password = pin;
    renderCreateStep3();
}

function handleCreateStep3() {
    const deposit = parseFloat(document.getElementById('newDeposit').value);

    if (isNaN(deposit) || deposit < 0 || (deposit > 0 && deposit % 100 !== 0)) {
        showMessage('create-alert', 'Initial deposit must be 0 or a multiple of 100.', 'error');
        return;
    }

    tempCreateData.balance = deposit;
    tempCreateData.history = [{
        desc: 'Account created',
        amount: deposit,
        type: 'creation',
        date: new Date().toISOString()
    }];

    accounts[tempCreateData.accountNumber] = { ...tempCreateData };
    saveData();
    currentAccount = accounts[tempCreateData.accountNumber];
    
    alert("Setup Complete! Your account is fully active.");
    renderDashboard();
}

function handleDeposit() {
    const amount = parseFloat(document.getElementById('depAmount').value);
    if (isNaN(amount) || amount <= 0 || amount % 100 !== 0) {
        showMessage('action-alert', 'Amount must be a multiple of 100.', 'error');
        return;
    }

    currentAccount.balance += amount;
    currentAccount.history.push({
        desc: 'Deposit',
        amount: amount,
        type: 'deposit',
        date: new Date().toISOString()
    });
    
    accounts[currentAccount.accountNumber] = currentAccount;
    saveData();
    alert("Successfully completed deposit of " + formatCurrency(amount));
    renderDashboard();
}

function handleWithdraw() {
    const amount = parseFloat(document.getElementById('withAmount').value);
    if (isNaN(amount) || amount <= 0 || amount % 100 !== 0) {
        showMessage('action-alert', 'Amount must be a multiple of 100.', 'error');
        return;
    }

    if (amount > currentAccount.balance) {
        showMessage('action-alert', 'Insufficient funds!', 'error');
        return;
    }

    currentAccount.balance -= amount;
    currentAccount.history.push({
        desc: 'Withdrawal',
        amount: -amount,
        type: 'withdrawal',
        date: new Date().toISOString()
    });
    
    accounts[currentAccount.accountNumber] = currentAccount;
    saveData();
    alert("Successfully completed withdrawal of " + formatCurrency(amount));
    renderDashboard();
}

function renderTransfer() {
    render(`
        <div class="glass-card">
            <h2>Send Money</h2>
            <p>Current balance: ${formatCurrency(currentAccount.balance)}</p>
            <div id="action-alert"></div>
            
            <form onsubmit="event.preventDefault(); handleTransfer();">
                <div class="form-group">
                    <label for="transAccNum">Recipient Account Number</label>
                    <input type="text" id="transAccNum" placeholder="e.g. 1234">
                </div>

                <div class="form-group">
                    <label for="transAmount">Amount to Send</label>
                    <input type="number" id="transAmount" placeholder="0" min="100" step="100">
                </div>
                
                <button type="submit">Confirm Transfer</button>
                <button type="button" class="secondary" onclick="renderDashboard()">Cancel</button>
            </form>
        </div>
    `);
}

function handleTransfer() {
    const targetAcc = document.getElementById('transAccNum').value.trim();
    const amount = parseFloat(document.getElementById('transAmount').value);

    if (!targetAcc) {
        showMessage('action-alert', 'Please enter a valid Account Number.', 'error');
        return;
    }

    if (isNaN(amount) || amount <= 0 || amount % 100 !== 0) {
        showMessage('action-alert', 'Amount must be a multiple of 100.', 'error');
        return;
    }

    if (amount > currentAccount.balance) {
        showMessage('action-alert', 'Insufficient funds!', 'error');
        return;
    }

    if (targetAcc === currentAccount.accountNumber) {
        showMessage('action-alert', 'Cannot send money to yourself.', 'error');
        return;
    }

    if (!accounts[targetAcc]) {
        showMessage('action-alert', 'Recipient account does not exist.', 'error');
        return;
    }

    currentAccount.balance -= amount;
    currentAccount.history.push({
        desc: 'Transferred to Acc ' + targetAcc,
        amount: -amount,
        type: 'withdrawal',
        date: new Date().toISOString()
    });
    accounts[currentAccount.accountNumber] = currentAccount;

    accounts[targetAcc].balance += amount;
    accounts[targetAcc].history.push({
        desc: 'Received from Acc ' + currentAccount.accountNumber,
        amount: amount,
        type: 'deposit',
        date: new Date().toISOString()
    });

    saveData();
    alert("Successfully completed transfer of " + formatCurrency(amount) + " to Account " + targetAcc);
    renderDashboard();
}

function logout() {
    currentAccount = null;
    renderAuthScreen();
}

// Init
renderAuthScreen();
