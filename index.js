#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import axios from "axios";
async function conversion() {
    try {
        const currency = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        return currency.data.rates;
    }
    catch (err) {
        console.log(chalk.red.bold(err));
        process.exit(1);
    }
}
async function convertor(currencyRates) {
    let userInput = await inquirer.prompt([
        {
            name: "from",
            message: chalk.green.bold("\n Enter the currency you want to convert from : \n"),
            type: "list",
            choices: Object.keys(currencyRates)
        },
        {
            name: "to",
            message: chalk.green.bold("\n Enter the currency you want to convert to : \n"),
            type: "list",
            choices: Object.keys(currencyRates)
        },
        {
            name: "amount",
            message: chalk.red.bold("\nEnter the amount you want to convert:\n"),
            type: "number",
        }
    ]);
    if (userInput.amount < 0 || isNaN(userInput.amount)) {
        console.log(chalk.red.bold("\n Amount can only be a positive number\n"));
        process.exit(1);
    }
    let fromAmount = currencyRates[userInput.from];
    let toAmount = currencyRates[userInput.to];
    let amount = userInput.amount;
    let baseAmount = amount / fromAmount;
    let convertedAmount = baseAmount * toAmount;
    console.log(chalk.green.bold("\nThe Converted amount is : \n"));
    console.log(chalk.green.bold("--->", convertedAmount.toFixed(2)));
}
async function main() {
    try {
        const currencyRates = await conversion();
        convertor(currencyRates);
    }
    catch (err) {
        console.log(chalk.red.bold(err));
        process.exit(1);
    }
}
main();
