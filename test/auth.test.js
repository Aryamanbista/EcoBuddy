const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
require('chromedriver');

// Test suite for the Authentication Flow
describe('Authentication Flow', function() {
  // Increase Mocha's default timeout because browser automation can be slow.
  this.timeout(30000); 

  let driver;
  
  // Define a unique user for each test run to avoid conflicts
  const testUser = {
    community: 'Selenium Testers',
    fullName: 'Test User',
    email: `testuser_${Date.now()}@example.com`, // Unique email
    password: 'password123'
  };

  // `before` hook: Runs once before all tests in this suite.
  // We use it to start the browser.
  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  // `after` hook: Runs once after all tests in this suite.
  // We use it to close the browser.
  after(async function() {
    await driver.quit();
  });

  // Test Case 1: User Registration
  it('should register a new user successfully', async function() {
    // 1. Navigate to the registration page
    await driver.get('http://localhost:5173/register');
    
    // 2. Find form elements and fill them out
    await driver.findElement(By.id('community')).sendKeys(testUser.community);
    await driver.findElement(By.id('fullName')).sendKeys(testUser.fullName);
    await driver.findElement(By.id('email')).sendKeys(testUser.email);
    await driver.findElement(By.id('password')).sendKeys(testUser.password);
    
    // 3. Click the register button
    await driver.findElement(By.xpath('//button[text()="Register"]')).click();

    // 4. Assert: Wait for the success message to appear and confirm we are redirected to the login page
    // Wait for the URL to contain '/login' (indicating a redirect)
    await driver.wait(until.urlContains('/login'), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/login');
  });


  // Test Case 2: User Login
  it('should log in the newly registered user and redirect to the dashboard', async function() {
    // 1. Navigate to the login page
    await driver.get('http://localhost:5173/login');
    
    // 2. Find email/password fields and enter the credentials of our test user
    await driver.findElement(By.id('email')).sendKeys(testUser.email);
    await driver.findElement(By.id('password')).sendKeys(testUser.password, Key.RETURN); // Key.RETURN submits the form

    // 3. Assert: Wait for the URL to become the dashboard URL.
    // This is the most reliable way to confirm a successful login.
    await driver.wait(until.urlIs('http://localhost:5173/dashboard'), 10000);

    // 4. (Optional but good practice) Assert that an element unique to the dashboard is present.
    const dashboardHeading = await driver.findElement(By.xpath('//h1[text()="Dashboard"]'));
    expect(await dashboardHeading.isDisplayed()).to.be.true;
  });
});