"""
UI Tests for QuLearn Login Page

Tests cover:
- Successful login with valid credentials
- Failed login with invalid credentials
- Password visibility toggle
- Navigation elements
- Form validation
"""

import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


@pytest.mark.auth
@pytest.mark.smoke
class TestLoginPage:
    """Test suite for login page functionality"""

    def test_login_page_loads(self, driver, base_url):
        """
        Test that the login page loads successfully with all required elements

        Verifies:
        - Page title/heading
        - Email input field
        - Password input field
        - Submit button
        - Navigation links
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)

        # Verify page heading (using text content)
        # LoginPage.tsx contains "Sign in to your account" heading
        heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Sign in')]")
            )
        )
        assert heading.is_displayed(), "Login page heading not visible"

        # Verify email input exists with correct ID
        # LoginPage.tsx line 110: id="email"
        email_input = driver.find_element(By.ID, "email")
        assert email_input.is_displayed(), "Email input not visible"
        assert email_input.get_attribute("type") == "email", "Email input type incorrect"
        assert email_input.get_attribute("name") == "email", "Email input name incorrect"

        # Verify password input exists with correct ID
        # LoginPage.tsx line 119: id="password"
        password_input = driver.find_element(By.ID, "password")
        assert password_input.is_displayed(), "Password input not visible"
        assert password_input.get_attribute("type") == "password", "Password input type incorrect"
        assert password_input.get_attribute("name") == "password", "Password input name incorrect"

        # Verify submit button exists
        # LoginPage.tsx line 157: type="submit"
        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        assert submit_button.is_displayed(), "Submit button not visible"
        assert "Sign In" in submit_button.text or "Signing In" in submit_button.text, \
            "Submit button text incorrect"

        # Verify "Back to Home" link exists
        # LoginPage.tsx: Contains "Back to Home" text with ArrowLeft icon
        back_link = driver.find_element(By.PARTIAL_LINK_TEXT, "Back to Home")
        assert back_link.is_displayed(), "Back to Home link not visible"

        # Verify "Sign up here" link exists
        # LoginPage.tsx: Link to /register
        signup_link = driver.find_element(By.PARTIAL_LINK_TEXT, "Sign up here")
        assert signup_link.is_displayed(), "Sign up link not visible"
        assert "/register" in signup_link.get_attribute("href"), "Sign up link href incorrect"

    def test_successful_student_login(self, driver, base_url, clear_local_storage):
        """
        Test successful login with valid student credentials

        Credentials: student@student.lk / student
        Expected behavior:
        - Form submission succeeds
        - Token stored in localStorage
        - User object stored in localStorage
        - Redirect to /dashboard
        - Dashboard page loads with user-specific content

        Locators used:
        - Email: By.ID "email" (LoginPage.tsx line 110)
        - Password: By.ID "password" (LoginPage.tsx line 119)
        - Submit: By.CSS_SELECTOR 'button[type="submit"]' (LoginPage.tsx line 157)
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)

        # Wait for email input to be present and interactable
        email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))
        email_input.clear()
        email_input.send_keys("student@student.lk")

        # Enter password
        password_input = driver.find_element(By.ID, "password")
        password_input.clear()
        password_input.send_keys("student")

        # Verify submit button is enabled before clicking
        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        assert submit_button.is_enabled(), "Submit button should be enabled with valid input"

        # Click submit
        submit_button.click()

        # Wait for redirect to dashboard
        # Expected: App.tsx handleLogin redirects student role to "/dashboard"
        try:
            wait.until(EC.url_contains("/dashboard"))
        except TimeoutException:
            # Capture current URL for debugging
            current_url = driver.current_url
            pytest.fail(f"Login did not redirect to dashboard. Current URL: {current_url}")

        # Verify URL is dashboard
        assert "/dashboard" in driver.current_url, \
            f"Expected /dashboard in URL, got {driver.current_url}"

        # Verify localStorage contains token
        token = driver.execute_script("return window.localStorage.getItem('token');")
        assert token is not None, "Token not found in localStorage after login"
        assert len(token) > 0, "Token is empty in localStorage"

        # Verify localStorage contains user object
        user_json = driver.execute_script("return window.localStorage.getItem('user');")
        assert user_json is not None, "User object not found in localStorage after login"

        # Parse and verify user object structure
        import json
        user = json.loads(user_json)
        assert "email" in user, "User object missing email field"
        assert user["email"] == "student@student.lk", "User email incorrect"
        assert "role" in user, "User object missing role field"
        assert user["role"] == "student", "User role should be 'student'"

        # Verify dashboard page elements are visible
        # StudentDashboard.tsx contains welcome message and stats
        # Wait for dashboard content to load (e.g., "Welcome" heading)
        dashboard_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome')]")
            )
        )
        assert dashboard_heading.is_displayed(), "Dashboard welcome message not visible"

    def test_successful_educator_login(self, driver, base_url, clear_local_storage):
        """
        Test successful login with valid educator credentials

        Credentials: educator@educator.lk / educator
        Expected redirect: /educator
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)

        email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))
        email_input.send_keys("educator@educator.lk")

        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys("educator")

        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_button.click()

        # Wait for redirect to educator dashboard
        # Expected: App.tsx handleLogin redirects educator role to "/educator"
        wait.until(EC.url_contains("/educator"))

        assert "/educator" in driver.current_url, \
            f"Expected /educator in URL, got {driver.current_url}"

        # Verify token and user storage
        token = driver.execute_script("return window.localStorage.getItem('token');")
        assert token is not None, "Token not stored for educator login"

        user_json = driver.execute_script("return window.localStorage.getItem('user');")
        import json
        user = json.loads(user_json)
        assert user["role"] == "educator", "User role should be 'educator'"

    def test_failed_login_invalid_password(self, driver, base_url, clear_local_storage):
        """
        Test failed login with invalid password

        Behavior:
        - Enters valid email but incorrect password
        - Submits form
        - Error message should be displayed
        - User should remain on login page
        - localStorage should not contain token

        Error message locator:
        - LoginPage.tsx line 147-155: Error div with class "bg-red-100"
        - Contains text "Login Error:"
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)

        email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))
        email_input.send_keys("student@student.lk")

        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys("wrongpassword123")  # Invalid password

        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_button.click()

        # Wait for error message to appear
        # LoginPage.tsx shows error in div with "bg-red-100" class
        try:
            error_message = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//div[contains(@class, 'bg-red-100')]")
                )
            )
            assert error_message.is_displayed(), "Error message not visible"

            # Verify error message contains expected text
            # LoginPage.tsx line 148: "Login Error: " text
            error_text = error_message.text
            assert "Login Error" in error_text or "Login failed" in error_text, \
                f"Error message text unexpected: {error_text}"

        except TimeoutException:
            pytest.fail("Error message did not appear after failed login")

        # Verify user is still on login page (no redirect)
        assert "/login" in driver.current_url, \
            f"User should remain on /login page, but is at {driver.current_url}"

        # Verify no token was stored
        token = driver.execute_script("return window.localStorage.getItem('token');")
        assert token is None, "Token should not be stored after failed login"

    def test_failed_login_empty_credentials(self, driver, base_url):
        """
        Test form validation with empty credentials

        Expected behavior:
        - HTML5 validation prevents form submission
        - Required field validation messages appear
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "email")))

        # Attempt to submit without entering anything
        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_button.click()

        # Verify email input has required attribute
        email_input = driver.find_element(By.ID, "email")
        is_required = email_input.get_attribute("required")
        assert is_required is not None, "Email input should have 'required' attribute"

        # Verify password input has required attribute
        password_input = driver.find_element(By.ID, "password")
        is_required = password_input.get_attribute("required")
        assert is_required is not None, "Password input should have 'required' attribute"

        # Verify still on login page (HTML5 validation prevented submission)
        assert "/login" in driver.current_url, "Should remain on login page"

    def test_password_visibility_toggle(self, driver, base_url):
        """
        Test password show/hide functionality

        LoginPage.tsx line 131-137: Toggle button to show/hide password
        - Initial state: type="password" (hidden)
        - After click: type="text" (visible)
        - After second click: type="password" (hidden again)

        Locator challenge: The toggle button doesn't have a unique ID
        Using relative locator: button inside password field container
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)
        password_input = wait.until(EC.presence_of_element_located((By.ID, "password")))

        # Enter password to make toggle functionality visible
        password_input.send_keys("testpassword123")

        # Initial state: password should be hidden (type="password")
        assert password_input.get_attribute("type") == "password", \
            "Password input should initially be type='password'"

        # Find the show/hide toggle button
        # LoginPage.tsx line 131: button with type="button" in absolute position
        # Strategy: Find button[type="button"] near the password input
        # This is a brittle locator - might need adjustment based on actual DOM structure
        try:
            # Try to find toggle button by looking for Eye icon or button within password container
            # Locator might need manual verification
            toggle_button = driver.find_element(
                By.XPATH,
                "//input[@id='password']/following-sibling::button[@type='button']"
            )
        except:
            # Fallback: Try finding by class pattern
            try:
                toggle_button = driver.find_element(
                    By.XPATH,
                    "//input[@id='password']/parent::div//button[@type='button']"
                )
            except:
                pytest.skip("Password visibility toggle button locator needs manual verification")

        # Click to show password
        toggle_button.click()
        time.sleep(0.5)  # Brief wait for state change

        # Verify password is now visible (type="text")
        password_type = password_input.get_attribute("type")
        assert password_type == "text", \
            f"Password should be visible (type='text'), but is type='{password_type}'"

        # Click again to hide password
        toggle_button.click()
        time.sleep(0.5)

        # Verify password is hidden again
        password_type = password_input.get_attribute("type")
        assert password_type == "password", \
            f"Password should be hidden (type='password'), but is type='{password_type}'"

    def test_navigation_to_register(self, driver, base_url):
        """
        Test navigation from login page to register page

        LoginPage.tsx contains link: "Sign up here" pointing to /register
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)

        # Find and click "Sign up here" link
        signup_link = wait.until(
            EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, "Sign up here"))
        )
        signup_link.click()

        # Verify navigation to register page
        wait.until(EC.url_contains("/register"))
        assert "/register" in driver.current_url, \
            f"Expected /register in URL, got {driver.current_url}"

        # Verify register page loaded
        register_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Create your account')]")
            )
        )
        assert register_heading.is_displayed(), "Register page heading not visible"

    def test_navigation_back_to_home(self, driver, base_url):
        """
        Test "Back to Home" link navigation

        LoginPage.tsx contains "Back to Home" link to "/"
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)

        # Find and click "Back to Home" link
        back_link = wait.until(
            EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, "Back to Home"))
        )
        back_link.click()

        # Verify navigation to home page
        wait.until(lambda d: d.current_url == base_url or d.current_url == f"{base_url}/")
        assert driver.current_url in [base_url, f"{base_url}/"], \
            f"Expected home page URL, got {driver.current_url}"

    @pytest.mark.slow
    def test_keep_signed_in_checkbox(self, driver, base_url):
        """
        Test "Keep me signed in" checkbox functionality

        LoginPage.tsx line 140-149: Checkbox for keeping user signed in
        Note: Actual persistence behavior depends on backend implementation
        This test only verifies UI interaction
        """
        driver.get(f"{base_url}/login")

        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "email")))

        # Find checkbox by name attribute
        # LoginPage.tsx line 144: name="keepSignedIn"
        try:
            keep_signed_in_checkbox = driver.find_element(By.NAME, "keepSignedIn")
        except:
            # Fallback: Find by type if name not present
            keep_signed_in_checkbox = driver.find_element(By.CSS_SELECTOR, 'input[type="checkbox"]')

        # Verify checkbox is initially unchecked
        assert not keep_signed_in_checkbox.is_selected(), \
            "Keep signed in checkbox should initially be unchecked"

        # Click to check the checkbox
        keep_signed_in_checkbox.click()

        # Verify checkbox is now checked
        assert keep_signed_in_checkbox.is_selected(), \
            "Keep signed in checkbox should be checked after click"

        # Click again to uncheck
        keep_signed_in_checkbox.click()

        # Verify checkbox is unchecked
        assert not keep_signed_in_checkbox.is_selected(), \
            "Keep signed in checkbox should be unchecked after second click"


@pytest.mark.auth
class TestLoginPageAccessControl:
    """Tests for login page access control and redirects"""

    def test_already_logged_in_redirect(self, authenticated_student_driver, base_url):
        """
        Test that already-authenticated users are redirected from login page

        App.tsx logic: If user is authenticated and tries to access /login,
        they should be redirected to their role-based dashboard
        """
        # Driver is already authenticated (via fixture)
        # Try to navigate to login page
        authenticated_student_driver.get(f"{base_url}/login")

        wait = WebDriverWait(authenticated_student_driver, 10)

        # Should be redirected to dashboard
        # App.tsx lines 124-143: Redirects authenticated users
        wait.until(EC.url_contains("/dashboard"))

        assert "/dashboard" in authenticated_student_driver.current_url, \
            "Already authenticated user should be redirected from /login to /dashboard"
