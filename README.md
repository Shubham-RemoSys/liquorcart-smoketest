## Liquor Cart - Smoke Test Suite

This Smoke Test Suite built using Playwright to verify that the basic functionalities of the Liquor Cart web application work correctly after each deployment. It acts as a fast checkpoint before full-scale regression testing.

## Purpose

This suite ensures basic use cases such as **login, add to cart, e2e Delivery order type checkout, search product, Home Page elements and guest browsing** are working as expected. It’s designed for early detection of blockers.

## How to Run Tests

Run all smoke tests -

```bash
npx playwright test
```

## Test Segregation (Tags)

The test suite is logically divided into two groups using **tags** for flexible execution:

| Tag      | Description                             | Requires Login |
| -------- | --------------------------------------- | -------------- |
| `@login` | Validates features requiring user login | Yes            |
| `@guest` | Validates features accessible to guests | No             |

## Run Tests by Tag

- Run tests @login tag:

```bash
  npx playwright test --grep @login
```

- Run tests @guest tag:

```bash
  npx playwright test --grep @guest
```

## Configuration Management with config.json

This project uses a centralized config.json file to manage environment-specific settings and reusable test data. It helps keep test logic clean, separates configuration from code, and enables easier switching between test environments.

## What’s Stored in config.json?

Application Test URL
User credentials for login tests
Test data like App Constants, Items info, Card info, Address etc.

## Page Object Model (POM) Approach

This project follows the Page Object Model design pattern, which helps keep tests clean, modular, and maintainable.

• Separation of concerns: Keeps UI interactions separate from test logic.

• Reusability: Shared logic for interacting with UI components is centralized.

• Scalability: Easy to update locators or page flows without touching tests.

## Test Cases Covered

### Add To Cart Test

Ensure users can add items to cart and see expected behavior.

### Cart Retain Test

Verify if items added as a guest are retained after login.

### Delivery Checkout Test

Validate the complete e2e delivery type checkout flow including fees, tips, and order placement.

### Home Page Test

Validate basic homepage UI elements and link accessibility.

### Product Search Test

Ensure the search functionality works for valid and invalid inputs.

### Login Test

Validate login functionality for registered users.

## HTML Test Reporting

This framework uses Playwright's built-in HTML reporter to generate a detailed, interactive test report after each run.

### How to View:

After test execution, open the report with:

```bash
npx playwright show-report
```
