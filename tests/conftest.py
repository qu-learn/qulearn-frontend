"""
Pytest configuration and fixtures for QuLearn Frontend UI Tests

This module provides shared fixtures and setup/teardown logic for all tests.
"""

import pytest
import os
import logging
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def pytest_addoption(parser):
    """Add custom command-line options for pytest"""
    parser.addoption(
        "--base-url",
        action="store",
        default="http://localhost:5173",
        help="Base URL for the application (default: http://localhost:5173)"
    )
    parser.addoption(
        "--browser",
        action="store",
        default="chrome",
        choices=["chrome", "firefox"],
        help="Browser to use for testing (default: chrome)"
    )
    parser.addoption(
        "--headless",
        action="store_true",
        default=False,
        help="Run browser in headless mode"
    )


@pytest.fixture(scope="session")
def base_url(request):
    """
    Fixture to provide the base URL for the application

    Can be overridden with --base-url flag:
    pytest --base-url=http://production-url.com
    """
    return request.config.getoption("--base-url")


@pytest.fixture(scope="function")
def driver(request):
    """
    Fixture to provide a WebDriver instance for each test

    Scope: function - Creates a new browser instance for each test
    Browser: Configurable via --browser flag (chrome or firefox)
    Headless: Configurable via --headless flag

    Usage:
        def test_example(driver):
            driver.get("http://localhost:5173/login")
            # ... test code
    """
    browser_name = request.config.getoption("--browser")
    headless = request.config.getoption("--headless")

    logger.info(f"Initializing {browser_name} WebDriver (headless={headless})")

    if browser_name == "chrome":
        options = ChromeOptions()

        if headless:
            options.add_argument("--headless=new")  # Use new headless mode

        # Recommended Chrome options for stability
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--start-maximized")

        # Disable unnecessary features
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-infobars")
        options.add_experimental_option("excludeSwitches", ["enable-logging"])

        # Initialize Chrome driver with automatic driver management
        service = ChromeService(ChromeDriverManager().install())
        web_driver = webdriver.Chrome(service=service, options=options)

    elif browser_name == "firefox":
        options = FirefoxOptions()

        if headless:
            options.add_argument("--headless")

        # Recommended Firefox options
        options.add_argument("--width=1920")
        options.add_argument("--height=1080")

        # Initialize Firefox driver with automatic driver management
        service = FirefoxService(GeckoDriverManager().install())
        web_driver = webdriver.Firefox(service=service, options=options)

    else:
        raise ValueError(f"Unsupported browser: {browser_name}")

    # Set implicit wait (fallback for element loading)
    # Note: Explicit waits are preferred in actual tests
    web_driver.implicitly_wait(10)

    # Maximize window (if not headless)
    if not headless:
        web_driver.maximize_window()

    logger.info(f"WebDriver initialized successfully: {browser_name}")

    # Provide the driver to the test
    yield web_driver

    # Teardown: Quit the driver after test completes
    logger.info("Closing WebDriver")
    web_driver.quit()


@pytest.fixture(scope="function")
def authenticated_student_driver(driver, base_url):
    """
    Fixture to provide a WebDriver instance with an authenticated student user

    This fixture:
    1. Navigates to login page
    2. Logs in with student credentials
    3. Waits for successful redirect to dashboard
    4. Returns the driver ready for authenticated actions

    Usage:
        def test_dashboard(authenticated_student_driver):
            # Driver is already logged in as student
            authenticated_student_driver.get("http://localhost:5173/dashboard")
    """
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    logger.info("Setting up authenticated student session")

    # Navigate to login page
    driver.get(f"{base_url}/login")

    # Wait for login page to load
    wait = WebDriverWait(driver, 10)
    email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))

    # Enter student credentials
    email_input.send_keys("student@student.lk")

    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("student")

    # Submit login form
    submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    submit_button.click()

    # Wait for redirect to dashboard
    wait.until(EC.url_contains("/dashboard"))

    logger.info("Student authentication successful")

    yield driver


@pytest.fixture(scope="function")
def authenticated_educator_driver(driver, base_url):
    """
    Fixture to provide a WebDriver instance with an authenticated educator user

    Credentials: educator@educator.lk / educator
    Expected redirect: /educator
    """
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    logger.info("Setting up authenticated educator session")

    driver.get(f"{base_url}/login")

    wait = WebDriverWait(driver, 10)
    email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))

    email_input.send_keys("educator@educator.lk")
    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("educator")

    submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    submit_button.click()

    # Wait for redirect to educator dashboard
    wait.until(EC.url_contains("/educator"))

    logger.info("Educator authentication successful")

    yield driver


@pytest.fixture(scope="function")
def clear_local_storage(driver):
    """
    Fixture to clear browser localStorage before/after tests

    Useful for ensuring clean state between tests
    """
    driver.execute_script("window.localStorage.clear();")
    yield
    driver.execute_script("window.localStorage.clear();")


# Session-level fixture for test reporting
@pytest.fixture(scope="session", autouse=True)
def test_session_setup():
    """
    Session-level setup and teardown
    Runs once before all tests and once after
    """
    logger.info("=" * 80)
    logger.info("Starting QuLearn Frontend UI Test Suite")
    logger.info("=" * 80)

    # Create reports directory if it doesn't exist
    os.makedirs("reports", exist_ok=True)

    yield

    logger.info("=" * 80)
    logger.info("QuLearn Frontend UI Test Suite Completed")
    logger.info("=" * 80)
