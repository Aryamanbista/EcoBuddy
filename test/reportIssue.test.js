import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { Select } from 'selenium-webdriver/lib/select.js';

// Group tests for the Report Issue Flow
describe('Report Issue Flow', function () {
  this.timeout(40000); // Give this flow a bit more time
  
  let driver;
  const appUrl = 'http://localhost:5173'; 

  // Runs ONCE before all tests in this block
  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  // Runs ONCE after all tests in this block have finished
  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  // Runs BEFORE EACH 'it' block (before each test case)
  // We use this to log in as a standard user, ensuring we start on the dashboard.
  beforeEach(async function() {
    // Navigate to login page
    await driver.get(`${appUrl}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 10000);

    // Enter standard user credentials and log in
    await driver.findElement(By.id('email')).sendKeys('swapnil@gmail.com'); 
    await driver.findElement(By.id('password')).sendKeys('Password1'); 
    await driver.findElement(By.css("button[type='submit']")).click();

    // Wait for the regular user dashboard to load
    await driver.wait(until.urlIs(`${appUrl}/dashboard`), 10000);
  });
  
  // Runs AFTER EACH 'it' block to ensure test isolation
  afterEach(async () => {
    // Clear localStorage to log the user out
    await driver.executeScript('window.localStorage.clear()');
  });

  // The main test case
  it('should allow a logged-in user to navigate to the form and submit an issue', async () => {
    // 1. Find the "Report Issue" link in the sidebar and click it
    // We use `a[href="/report-issue"]` as a stable selector
    const reportIssueLink = await driver.wait(until.elementLocated(By.css('a[href="/report-issue"]')), 10000);
    await reportIssueLink.click();

    // 2. Wait for the URL to change and for the form to be visible
    await driver.wait(until.urlIs(`${appUrl}/report-issue`), 10000);
    await driver.wait(until.elementLocated(By.id('issueType')), 10000);

    // 3. Fill out the form fields
    
    // Use the Select helper for the dropdown
    const selectElement = await driver.findElement(By.id('issueType'));
    const select = new Select(selectElement);
    await select.selectByVisibleText('Overflowing Bin');

    // Generate a unique description for this test run
    const descriptionText = 'Automated Test: The main bin at the park is full. Test ID: ' + Date.now();
    await driver.findElement(By.id('description')).sendKeys(descriptionText);

    // 4. Find the submit button and click it
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 5. Wait for the success/confirmation screen to appear and verify its content
    // We target the <h2> element containing the success message
    const successHeader = await driver.wait(until.elementLocated(By.xpath('//h2[text()="Report Submitted!"]')), 10000);
    
    // Assert that the success message is displayed
    expect(await successHeader.isDisplayed()).to.be.true;

    // Optional: Assert the descriptive text is also correct
    const successParagraph = await driver.findElement(By.xpath('//p[contains(text(), "Thank you for your feedback")]'));
    expect(await successParagraph.isDisplayed()).to.be.true;
  });
});