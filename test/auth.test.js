// Use ES6 import syntax
import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

// Group tests for the Authentication Flow
describe('Authentication Flow', function () {
  this.timeout(30000); 
  
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

  // --- THIS IS THE FIX ---
  // Runs AFTER EACH 'it' block (after each test case)
  // This ensures that each test starts from a clean, logged-out state.
  afterEach(async () => {
    // Clear the localStorage to log the user out
    await driver.executeScript('window.localStorage.clear()');
  });

  // Test Case 1: Positive System Test for Successful Login
  it('should allow a user to log in successfully', async () => {
    await driver.get(`${appUrl}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 10000); // Good practice to wait
    await driver.findElement(By.id('email')).sendKeys('admin@admin.com');
    await driver.findElement(By.id('password')).sendKeys('12345678');
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlIs(`${appUrl}/admin/dashboard`), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal(`${appUrl}/admin/dashboard`);
  });

  // Test Case 2: Negative System Test for Failed Login
  it('should show an error on failed login with incorrect password', async () => {
    await driver.get(`${appUrl}/login`);
    await driver.wait(until.elementLocated(By.id('email')), 10000);
    await driver.findElement(By.id('email')).sendKeys('admin@admin.com');
    await driver.findElement(By.id('password')).sendKeys('WrongPassword'); 
    await driver.findElement(By.css("button[type='submit']")).click();
    const errorElement = await driver.wait(until.elementLocated(By.css('div[role="alert"]')), 10000);
    const errorMessage = await errorElement.getText();
    expect(errorMessage).to.include('Invalid email or password'); 
  });
});