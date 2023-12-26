const puppeteer = require("puppeteer");
require("dotenv").config();

(async () => {
  const browser = await puppeteer.launch({ headless: "new" }),
    new_page = await browser.newPage();

  await new_page.goto(process.env.WEBSITE);

  await new_page.waitForSelector("#form");

  await new_page.type(".form-control", process.env.CARD_NUMBER);
  await new_page.click(".btn");

  await new_page.waitForSelector("#balance", {
    visible: true,
  });
  const Current_Balance = await new_page.$eval("#balance", (element) =>
    element.innerHTML.split("$")[1].trim(" ")
  );
  await new_page.waitForSelector("#availabilityTable", {
    visible: true,
  });
  const elements = await new_page.$$eval(
    "#availabilityTable .centered",
    (elements) =>
      elements.map((element) =>
        element.textContent.split("(")[1].replace(")", "")
      )
  );
  const Available_Machines = { Washers: elements[0], Dryers: elements[1] };
  Display_Data(Current_Balance, Available_Machines);
  try {
    await new_page.screenshot({ path: "screenshotToday.png" });
  } catch (err) {
    console.log(err);
  }
  await browser.close();
})();

const Display_Data = (Current_Balance, Available_Machines) => {
  console.log("\nWelcome to Laundry Machine Updates:\n");
  console.log("Current Balance: $" + Current_Balance);
  console.log("Washers: " + Available_Machines.Washers);
  console.log("Dryers: " + Available_Machines.Dryers);
  console.log("");
};
