# 🏦 Ruthin ATM

Welcome to the **Ruthin ATM** multi-platform banking system! This project boasts a secure, dual-environment approach towards digital transactions, offering both an *Advanced Java Console Application* and a sleek, *Glassmorphic Web Interface*.

---

## ⚡ Features & Capabilities

- **Secure Account Generation:** Users undergo a structured 4-step wizard to create an account (`Name & Type` -> `Auto-generated 4-Digit UUID` -> `Password Setup` -> `Initial Funding`).
- **Robust Authentication:** Both the Java and Web systems require exact PIN/Password mappings to perform any actions or even to check balances.
- **Minimum Withdrawal Constraints:** Enforces real-world banking logic where standard withdrawals must meet a minimum withdrawal limit (₹100 / $100 amounts).
- **Send Money (P2P Transfer):** Users can seamlessly transfer funds between accounts. The system dynamically validates the receiver's existence and guarantees both profiles immediately log the transaction in their respective histories!
- **Dynamic Transaction History:** History is tracked with timestamps. The Java interface features a complex `Mini-statement` filter allowing users to search specifically for `Deposits`, `N-recent transactions`, or `Amount thresholds`.
- **Keyboard Optimization:** Web interface forms capture the native `Enter` key natively for rapid navigation on laptops.

---

## 💻 Environment 1: The Java Console Engine
A strict, modular, and buffer-safe CLI backend representing the core logic.

### **Files:**
- `ATM.java` - Core execution loop, routing logic, and wizard deployment. 
- `Account.java` - Encapsulated object model securing balances, passwords, and transaction lists.
- `InsufficientBalanceException.java` - Exception hierarchy interceptor.

**To Run:**
1. Compile the files: 
   ```bash
   javac ATM.java
   ```
2. Execute the process:
   ```bash
   java ATM
   ```

---

## 🌐 Environment 2: The Web Platform
A modern, dark-mode browser frontend acting as an accessible portal. It uses Javascript's `localStorage` namespace to preserve account data locally in your browser.

### **Files:**
- `index.html` - The structural scaffold.
- `style.css` - Custom styling utilizing blur/glass filters and fluid gradients.
- `app.js` - Procedural UI states mirroring the backend logic (Wizard, transfers, arrays).

**To Run:**
1. Simply double-click `index.html` to open it locally in Google Chrome or Edge.
2. Alternatively, serve it via Python to push it to the internet:
   ```bash
   python -m http.server 8080
   ```

---

## 🛠 Active Technical Principles Applied:
- **Object Oriented Design (OOD):** Encapsulation, object instantiation, and private modifiers mapping.
- **Buffer Safety (Java Scanner):** Avoidance of `nextInt()` buffer overflow errors by exclusively relying on `.nextLine()` parsing algorithms.
- **Frontend State Management:** Dynamic `innerHTML` rendering engines manipulating unified objects without requiring heavy frameworks.
