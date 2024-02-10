import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
// Customer Class
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobileNumber = mob;
        this.accountNo = acc;
    }
}
;
;
// Class Bank
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    ;
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    ;
    transaction(accObj) {
        let newAccount = this.account.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.account = [...newAccount, accObj];
    }
    ;
}
;
let myBank = new Bank();
// Create Customer
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number('3#########'));
    const cus = new Customer(fName, lName, 18 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accountNo, balance: 100 * i });
}
// Bank Functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please Select The Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        // View Balance
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            ;
            if (account) {
                let name = myBank.customer.find((item) => item.accountNo == account?.accNumber);
                console.log(`Dear ${chalk.green.bold.italic(name?.firstName)},
            ${chalk.green.bold.italic(name?.lastName)} your account balance is ${chalk.blue.bold.italic("$", account.balance)}
            `);
            }
        }
        ;
        // Cash Withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            ;
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your amount",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold.italic("Insufficient Balance..."));
                }
                else {
                    let newBalance = account.balance - ans.rupee;
                    // Transaction Method Call
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(chalk.green.bold.italic(`New Balance: $${newBalance}`));
                }
                ;
            }
            ;
        }
        ;
        // Cash Deposit
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            ;
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your amount",
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee;
                // Transaction Method Call
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(chalk.green.bold.italic(`New Balance: $${newBalance}`));
            }
            ;
        }
        ;
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
;
bankService(myBank);
