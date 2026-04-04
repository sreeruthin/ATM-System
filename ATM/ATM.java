import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.List;

public class ATM {
    private Map<Integer, Account> accounts;
    private Scanner scanner;

    public ATM() {
        accounts = new HashMap<>();
        scanner = new Scanner(System.in);
    }

    public static void main(String[] args) {
        ATM atm = new ATM();
        atm.start();
    }

    public void start() {
        boolean exit = false;
        while (!exit) {
            System.out.println("\n=== Advanced Console ATM System ===");
            System.out.println("1. Create a new account");
            System.out.println("2. Deposit money");
            System.out.println("3. Withdraw money");
            System.out.println("4. Transfer money");
            System.out.println("5. Check account balance");
            System.out.println("6. Mini Statement (Transaction History Filter)");
            System.out.println("7. Exit");
            System.out.print("Choose an option: ");

            int choice = -1;
            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number.");
                continue;
            }

            switch (choice) {
                case 1:
                    createAccount();
                    break;
                case 2:
                    deposit();
                    break;
                case 3:
                    withdraw();
                    break;
                case 4:
                    transferMoney();
                    break;
                case 5:
                    checkBalance();
                    break;
                case 6:
                    miniStatement();
                    break;
                case 7:
                    exit = true;
                    System.out.println("Thank you for using the ATM system.");
                    break;
                default:
                    System.out.println("Invalid choice. Please choose a valid option (1-7).");
                    pauseToContinue();
            }
        }
        scanner.close();
    }

    private void pauseToContinue() {
        System.out.print("Press Enter to continue...");
        scanner.nextLine();
    }

    private void createAccount() {
        System.out.println("\n--- Account Creation System ---");
        String[] details = new String[3]; // [0] name, [1] accountType, [2] password
        int[] accNumRef = new int[1];
        double[] depositRef = new double[1];

        if (!step1_createBasicDetails(details)) return;
        pauseToContinue();
        
        if (!step2_generateAccount(accNumRef)) return;
        pauseToContinue();
        
        if (!step3_setPassword(details)) return;
        pauseToContinue();
        
        if (!step4_initialDeposit(depositRef)) return;

        Account newAccount = new Account(accNumRef[0], details[0], details[1], depositRef[0], details[2]);
        accounts.put(accNumRef[0], newAccount);
        
        System.out.println("\n--- Account Profile ---");
        System.out.println("Setup Successful. " + details[1] + " profile activated.");
        System.out.println("Please save your account number (" + accNumRef[0] + ") and password for future operations.");
        pauseToContinue();
    }

    private boolean step1_createBasicDetails(String[] details) {
        System.out.println("\n[Step 1: Select Account Type and Enter Name]");
        System.out.print("Enter Account Holder Name: ");
        String name = scanner.nextLine();
        
        System.out.println("Select Account Type:");
        System.out.println("1. Savings");
        System.out.println("2. Current");
        System.out.print("Choice: ");
        String typeChoice = scanner.nextLine();
        String accountType = "Savings";
        if (typeChoice.equals("2")) {
            accountType = "Current";
        } else if (!typeChoice.equals("1")) {
            System.out.println("Mismatched choice. Defaulting to 'Savings' type.");
        }
        
        details[0] = name;
        details[1] = accountType;
        return true;
    }

    private boolean step2_generateAccount(int[] accNumRef) {
        System.out.println("\n[Step 2: Generate Account Number]");
        int accNum;
        java.util.Random rnd = new java.util.Random();
        do {
            accNum = 1000 + rnd.nextInt(9000);
        } while (accounts.containsKey(accNum));

        System.out.println("-> Automatically generated 4-digit Account Number: " + accNum);
        accNumRef[0] = accNum;
        return true;
    }

    private boolean step3_setPassword(String[] details) {
        System.out.println("\n[Step 3: Create Password]");
        System.out.print("Please set a secure password for this account: ");
        String password = scanner.nextLine();
        if (password.trim().isEmpty()) {
            System.out.println("Error: Password cannot be empty.");
            return false;
        }
        details[2] = password;
        return true;
    }

    private boolean step4_initialDeposit(double[] depositRef) {
        System.out.println("\n[Step 4: Initial Deposit]");
        System.out.print("Enter Initial Deposit Amount: ");
        try {
            double initialDeposit = Double.parseDouble(scanner.nextLine());
            if (initialDeposit < 0) {
                System.out.println("Error: Initial deposit cannot be negative.");
                return false;
            }
            depositRef[0] = initialDeposit;
            return true;
        } catch (NumberFormatException e) {
            System.out.println("Error: Invalid amount entered.");
            return false;
        }
    }

    private void deposit() {
        System.out.print("Enter Account Number: ");
        int accNum;
        try {
            accNum = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Invalid format.");
            pauseToContinue();
            return;
        }

        Account account = accounts.get(accNum);
        if (account == null) {
            System.out.println("Error: Account not found.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Password: ");
        String pin = scanner.nextLine();
        if (!account.getPassword().equals(pin)) {
            System.out.println("Error: Incorrect password.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Deposit Amount: ");
        double amount;
        try {
            amount = Double.parseDouble(scanner.nextLine());
            if (amount <= 0) {
                System.out.println("Error: Deposit amount must be greater than zero.");
                pauseToContinue();
                return;
            }
        } catch (NumberFormatException e) {
            System.out.println("Error: Invalid amount entered.");
            pauseToContinue();
            return;
        }

        double newBalance = account.getBalance() + amount;
        account.setBalance(newBalance);
        account.addTransaction("Deposited: " + amount);
        System.out.println("Deposit successful. Account Type: [" + account.getAccountType() + "] | Current Balance: " + newBalance);
        pauseToContinue();
    }

    private void withdraw() {
        System.out.print("Enter Account Number: ");
        int accNum;
        try {
            accNum = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Invalid format.");
            pauseToContinue();
            return;
        }

        Account account = accounts.get(accNum);
        if (account == null) {
            System.out.println("Error: Account not found.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Password: ");
        String pin = scanner.nextLine();
        if (!account.getPassword().equals(pin)) {
            System.out.println("Error: Incorrect password.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Withdrawal Amount: ");
        double amount;
        try {
            amount = Double.parseDouble(scanner.nextLine());
            if (amount < 100) {
                System.out.println("Error: Minimum withdrawal amount is 100.");
                pauseToContinue();
                return;
            }
        } catch (NumberFormatException e) {
            System.out.println("Error: Invalid amount entered.");
            pauseToContinue();
            return;
        }

        try {
            if (account.getBalance() < amount) {
                throw new InsufficientBalanceException("Insufficient balance. Current balance is " + account.getBalance());
            }
            
            double newBalance = account.getBalance() - amount;
            account.setBalance(newBalance);
            account.addTransaction("Withdrew: " + amount);
            System.out.println("Withdrawal successful. Account Type: [" + account.getAccountType() + "] | Current Balance: " + newBalance);
            
        } catch (InsufficientBalanceException e) {
            System.out.println("Error: " + e.getMessage());
            account.addTransaction("Failed Withdrawal Attempt: " + amount + " (Insufficient Funds)");
        }
        pauseToContinue();
    }

    private void transferMoney() {
        System.out.print("Enter Your Account Number (Sender): ");
        int senderAccNum;
        try {
            senderAccNum = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Invalid format.");
            pauseToContinue();
            return;
        }

        Account sender = accounts.get(senderAccNum);
        if (sender == null) {
            System.out.println("Error: Sender account not found.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Your Password: ");
        String pin = scanner.nextLine();
        if (!sender.getPassword().equals(pin)) {
            System.out.println("Error: Incorrect password.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Destination Account Number (Receiver): ");
        int receiverAccNum;
        try {
            receiverAccNum = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Invalid format.");
            pauseToContinue();
            return;
        }

        Account receiver = accounts.get(receiverAccNum);
        if (receiver == null) {
            System.out.println("Error: Receiver account not found.");
            pauseToContinue();
            return;
        }

        if (senderAccNum == receiverAccNum) {
            System.out.println("Error: Cannot transfer to the same account.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Transfer Amount: ");
        double amount;
        try {
            amount = Double.parseDouble(scanner.nextLine());
            if (amount <= 0) {
                System.out.println("Error: Transfer amount must be greater than zero.");
                pauseToContinue();
                return;
            }
        } catch (NumberFormatException e) {
            System.out.println("Error: Invalid amount entered.");
            pauseToContinue();
            return;
        }

        try {
            if (sender.getBalance() < amount) {
                throw new InsufficientBalanceException("Insufficient balance for transfer.");
            }
            
            sender.setBalance(sender.getBalance() - amount);
            receiver.setBalance(receiver.getBalance() + amount);
            
            sender.addTransaction("Transferred " + amount + " to Account " + receiverAccNum);
            receiver.addTransaction("Received " + amount + " from Account " + senderAccNum);
            
            System.out.println("Transfer successful. Your Current Balance: " + sender.getBalance());
            
        } catch (InsufficientBalanceException e) {
            System.out.println("Error: " + e.getMessage());
            sender.addTransaction("Failed Transfer Attempt: " + amount + " to Account " + receiverAccNum + " (Insufficient Funds)");
        }
        pauseToContinue();
    }

    private void checkBalance() {
        System.out.print("Enter Account Number: ");
        int accNum;
        try {
            accNum = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Invalid format.");
            pauseToContinue();
            return;
        }

        Account account = accounts.get(accNum);
        if (account == null) {
            System.out.println("Error: Account not found.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Password: ");
        String pin = scanner.nextLine();
        if (!account.getPassword().equals(pin)) {
            System.out.println("Error: Incorrect password.");
            pauseToContinue();
            return;
        }

        System.out.println("--- Account Profile ---");
        System.out.println("Account Holder: " + account.getAccountHolderName());
        System.out.println("Account Type: " + account.getAccountType());
        System.out.println("Current Balance: " + account.getBalance());
        pauseToContinue();
    }

    private void miniStatement() {
        System.out.print("Enter Account Number: ");
        int accNum;
        try {
            accNum = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Invalid format.");
            pauseToContinue();
            return;
        }

        Account account = accounts.get(accNum);
        if (account == null) {
            System.out.println("Error: Account not found.");
            pauseToContinue();
            return;
        }

        System.out.print("Enter Password: ");
        String pin = scanner.nextLine();
        if (!account.getPassword().equals(pin)) {
            System.out.println("Error: Incorrect password.");
            pauseToContinue();
            return;
        }

        System.out.println("\n--- Mini Statement Filters ---");
        System.out.println("1. View All Transactions");
        System.out.println("2. View Last N Transactions");
        System.out.println("3. View Only Deposits");
        System.out.println("4. View Only Withdrawals");
        System.out.println("5. View Transactions Above a Specified Amount");
        System.out.print("Select filter (1-5): ");
        
        int filterOption = -1;
        try {
            filterOption = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Invalid selection.");
            pauseToContinue();
            return;
        }
        
        List<String> history = account.getTransactionHistory();
        if (history.isEmpty()) {
            System.out.println("No transactions found.");
            pauseToContinue();
            return;
        }

        System.out.println("\n--- Statement for " + account.getAccountHolderName() + " (" + account.getAccountType() + ") ---");
        
        switch (filterOption) {
            case 1:
                for (String tx : history) {
                    System.out.println(tx);
                }
                break;
            case 2:
                System.out.print("Enter value of N: ");
                try {
                    int n = Integer.parseInt(scanner.nextLine());
                    if (n < 0) n = 0;
                    int start = Math.max(0, history.size() - n);
                    for (int i = start; i < history.size(); i++) {
                        System.out.println(history.get(i));
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Invalid number.");
                }
                break;
            case 3:
                for (String tx : history) {
                    String primary = tx.split(" \\| ")[0].trim();
                    if (primary.startsWith("Deposited:") || primary.startsWith("Received ")) {
                        System.out.println(tx);
                    }
                }
                break;
            case 4:
                for (String tx : history) {
                    String primary = tx.split(" \\| ")[0].trim();
                    if (primary.startsWith("Withdrew:") || primary.startsWith("Transferred ")) {
                        System.out.println(tx);
                    }
                }
                break;
            case 5:
                System.out.print("Enter minimum amount threshold: ");
                try {
                    double minAmt = Double.parseDouble(scanner.nextLine());
                    for (String tx : history) {
                        double amt = extractAmountFromTransaction(tx);
                        if (amt >= minAmt) {
                            System.out.println(tx);
                        }
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Invalid amount.");
                }
                break;
            default:
                System.out.println("Invalid filter option.");
        }
        System.out.println("---------------------------------------------------------");
        pauseToContinue();
    }

    private double extractAmountFromTransaction(String tx) {
        try {
            String primaryStr = tx.split(" \\| ")[0].trim();
            if (primaryStr.startsWith("Deposited: ") || primaryStr.startsWith("Withdrew: ")) {
                return Double.parseDouble(primaryStr.split(": ")[1]);
            } else if (primaryStr.startsWith("Transferred ") || primaryStr.startsWith("Received ")) {
                return Double.parseDouble(primaryStr.split(" ")[1]);
            } else if (primaryStr.startsWith("Account created with initial balance: ")) {
                return Double.parseDouble(primaryStr.split(": ")[1]);
            }
        } catch (Exception e) {
            // Failsafe for invalid formats to un-crash the process
        }
        return 0.0;
    }
}
