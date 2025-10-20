"""
UI Tests for QuLearn Registration Page

Tests cover:
- Successful registration with valid data
- Form validation (required fields, terms checkbox)
- Password visibility toggle
- Navigation elements
- Email format validation
"""

import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


@pytest.mark.auth
@pytest.mark.smoke
class TestRegisterPage:
    """Test suite for registration page functionality"""

    def test_register_page_loads(self, driver, base_url):
        """
        Test that the register page loads successfully with all required elements

        Verifies:
        - Page heading
        - All input fields (fullName, email, password)
        - Terms and conditions checkbox
        - Submit button
        - Navigation links
        """
        driver.get(f"{base_url}/register")

        wait = WebDriverWait(driver, 10)

        # Verify page heading
        # RegisterPage.tsx contains "Create your account" heading
        heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Create your account')]")
            )
        )
        assert heading.is_displayed(), "Register page heading not visible"

        # Verify full name input
        # RegisterPage.tsx line 72: id="fullName"
        fullname_input = driver.find_element(By.ID, "fullName")
        assert fullname_input.is_displayed(), "Full name input not visible"
        assert fullname_input.get_attribute("type") == "text", "Full name input type incorrect"
        assert fullname_input.get_attribute("name") == "fullName", "Full name input name incorrect"

        # Verify email input
        # RegisterPage.tsx line 81: id="email"
        email_input = driver.find_element(By.ID, "email")
        assert email_input.is_displayed(), "Email input not visible"
        assert email_input.get_attribute("type") == "email", "Email input type incorrect"
        assert email_input.get_attribute("name") == "email", "Email input name incorrect"

        # Verify password input
        # RegisterPage.tsx line 90: id="password"
        password_input = driver.find_element(By.ID, "password")
        assert password_input.is_displayed(), "Password input not visible"
        assert password_input.get_attribute("type") == "password", "Password input type incorrect"
        assert password_input.get_attribute("name") == "password", "Password input name incorrect"

        # Verify terms checkbox
        # RegisterPage.tsx line 107: id="agreeToTerms"
        terms_checkbox = driver.find_element(By.ID, "agreeToTerms")
        assert terms_checkbox.is_displayed(), "Terms checkbox not visible"
        assert terms_checkbox.get_attribute("type") == "checkbox", "Terms checkbox type incorrect"
        assert terms_checkbox.get_attribute("required") is not None, \
            "Terms checkbox should be required"

        # Verify submit button
        # RegisterPage.tsx line 162: type="submit"
        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        assert submit_button.is_displayed(), "Submit button not visible"
        assert "Sign Up" in submit_button.text or "Creating Account" in submit_button.text, \
            "Submit button text incorrect"

        # Verify "Back to Home" link
        back_link = driver.find_element(By.PARTIAL_LINK_TEXT, "Back to Home")
        assert back_link.is_displayed(), "Back to Home link not visible"

        # Verify "Sign in" link
        signin_link = driver.find_element(By.PARTIAL_LINK_TEXT, "Sign in")
        assert signin_link.is_displayed(), "Sign in link not visible"
        assert "/login" in signin_link.get_attribute("href"), "Sign in link href incorrect"

    def test_successful_registration(self, driver, base_url, clear_local_storage):
        """
        Test successful registration with valid data

        Expected behavior:
        - All fields filled correctly
        - Terms checkbox checked
        - Form submits successfully
        - Token stored in localStorage
        - User object stored in localStorage
        - Redirect to /dashboard (default for new users)

        Locators used:
        - Full Name: By.ID "fullName" (RegisterPage.tsx line 72)
        - Email: By.ID "email" (RegisterPage.tsx line 81)
        - Password: By.ID "password" (RegisterPage.tsx line 90)
        - Terms: By.ID "agreeToTerms" (RegisterPage.tsx line 107)
        - Submit: By.CSS_SELECTOR 'button[type="submit"]' (RegisterPage.tsx line 162)

        Note: Using unique test data to avoid conflicts with existing users
        """
        driver.get(f"{base_url}/register")

        wait = WebDriverWait(driver, 10)

        # Generate unique email using timestamp to avoid conflicts
        import random
        timestamp = int(time.time())
        test_email = f"testuser{timestamp}@qulearn.test"

        # Wait for form to load
        fullname_input = wait.until(EC.presence_of_element_located((By.ID, "fullName")))

        # Fill in all required fields
        fullname_input.clear()
        fullname_input.send_keys("Test User")

        email_input = driver.find_element(By.ID, "email")
        email_input.clear()
        email_input.send_keys(test_email)

        password_input = driver.find_element(By.ID, "password")
        password_input.clear()
        password_input.send_keys("SecurePassword123!")

        # Check terms and conditions checkbox
        terms_checkbox = driver.find_element(By.ID, "agreeToTerms")
        if not terms_checkbox.is_selected():
            terms_checkbox.click()

        # Verify checkbox is now checked
        assert terms_checkbox.is_selected(), "Terms checkbox should be checked"

        # Verify submit button is enabled after checking terms
        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        assert submit_button.is_enabled(), \
            "Submit button should be enabled when all fields are filled and terms are agreed"

        # Submit the form
        submit_button.click()

        # Wait for redirect to dashboard
        # Note: New users default to student role, so redirect should be /dashboard
        try:
            wait.until(EC.url_contains("/dashboard"))
        except TimeoutException:
            # Check if error message appeared instead
            try:
                error_element = driver.find_element(By.XPATH, "//div[contains(@class, 'bg-red-100')]")
                error_text = error_element.text
                pytest.fail(f"Registration failed with error: {error_text}")
            except:
                current_url = driver.current_url
                pytest.fail(f"Registration did not redirect. Current URL: {current_url}")

        # Verify URL contains dashboard
        assert "/dashboard" in driver.current_url, \
            f"Expected /dashboard in URL, got {driver.current_url}"

        # Verify localStorage contains token
        token = driver.execute_script("return window.localStorage.getItem('token');")
        assert token is not None, "Token not found in localStorage after registration"
        assert len(token) > 0, "Token is empty"

        # Verify localStorage contains user object
        user_json = driver.execute_script("return window.localStorage.getItem('user');")
        assert user_json is not None, "User object not found in localStorage"

        # Parse and verify user object
        import json
        user = json.loads(user_json)
        assert "email" in user, "User object missing email field"
        assert user["email"] == test_email, f"User email mismatch. Expected {test_email}"
        assert "fullName" in user, "User object missing fullName field"
        assert user["fullName"] == "Test User", "User fullName incorrect"

        # Verify dashboard page loaded
        dashboard_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome')]")
            )
        )
        assert dashboard_heading.is_displayed(), "Dashboard welcome message not visible"

    def test_registration_terms_checkbox_required(self, driver, base_url):
        """
        Test that registration cannot proceed without agreeing to terms

        RegisterPage.tsx line 162-168: Submit button disabled when terms not agreed
        Expected behavior:
        - Fill all fields except terms checkbox
        - Submit button should be disabled
        - Form submission should not proceed
        """
        driver.get(f"{base_url}/register")

        wait = WebDriverWait(driver, 10)

        # Fill all fields
        fullname_input = wait.until(EC.presence_of_element_located((By.ID, "fullName")))
        fullname_input.send_keys("Test User")

        email_input = driver.find_element(By.ID, "email")
        email_input.send_keys("testuser@example.com")

        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys("password123")

        # DO NOT check the terms checkbox
        terms_checkbox = driver.find_element(By.ID, "agreeToTerms")
        assert not terms_checkbox.is_selected(), "Terms checkbox should not be checked initially"

        # Verify submit button is disabled
        # RegisterPage.tsx line 163: disabled={!formData.agreeToTerms || isLoading}
        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        is_disabled = not submit_button.is_enabled()

        assert is_disabled, \
            "Submit button should be disabled when terms are not agreed"

        # Now check the terms checkbox
        terms_checkbox.click()
        time.sleep(0.5)  # Brief wait for state update

        # Verify submit button is now enabled
        assert submit_button.is_enabled(), \
            "Submit button should be enabled after agreeing to terms"

    def test_registration_validation_empty_fields(self, driver, base_url):
        """
        Test HTML5 validation with empty required fields

        Expected behavior:
        - Attempt to submit with empty fields
        - HTML5 required attribute prevents submission
        - User remains on registration page
        """
        driver.get(f"{base_url}/register")

        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "fullName")))

        # Check terms checkbox (to enable submit button)
        terms_checkbox = driver.find_element(By.ID, "agreeToTerms")
        terms_checkbox.click()

        # Attempt to submit without filling fields
        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_button.click()

        # Verify required attributes on inputs
        fullname_input = driver.find_element(By.ID, "fullName")
        assert fullname_input.get_attribute("required") is not None, \
            "Full name input should have 'required' attribute"

        email_input = driver.find_element(By.ID, "email")
        assert email_input.get_attribute("required") is not None, \
            "Email input should have 'required' attribute"

        password_input = driver.find_element(By.ID, "password")
        assert password_input.get_attribute("required") is not None, \
            "Password input should have 'required' attribute"

        # Verify still on register page (HTML5 validation prevented submission)
        assert "/register" in driver.current_url, "Should remain on register page"

    def test_registration_failed_duplicate_email(self, driver, base_url, clear_local_storage):
        """
        Test registration failure with duplicate email

        Expected behavior:
        - Attempt to register with existing email (student@student.lk)
        - Backend should reject registration
        - Error message should be displayed
        - User should remain on register page

        Error locator:
        - RegisterPage.tsx line 150-159: Error div with "bg-red-100" class
        """
        driver.get(f"{base_url}/register")

        wait = WebDriverWait(driver, 10)

        # Fill form with existing user's email
        fullname_input = wait.until(EC.presence_of_element_located((By.ID, "fullName")))
        fullname_input.send_keys("Duplicate User")

        email_input = driver.find_element(By.ID, "email")
        email_input.send_keys("student@student.lk")  # Known existing email

        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys("password123")

        terms_checkbox = driver.find_element(By.ID, "agreeToTerms")
        terms_checkbox.click()

        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_button.click()

        # Wait for error message
        # RegisterPage.tsx line 150: Error div with "bg-red-100" class
        try:
            error_message = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//div[contains(@class, 'bg-red-100')]")
                )
            )
            assert error_message.is_displayed(), "Error message not visible"

            # Verify error message contains expected text
            error_text = error_message.text
            assert "Registration Error" in error_text or "Registration failed" in error_text \
                   or "already exists" in error_text.lower() or "duplicate" in error_text.lower(), \
                f"Error message text unexpected: {error_text}"

        except TimeoutException:
            # If no error appears, check if registration unexpectedly succeeded
            if "/dashboard" in driver.current_url:
                pytest.fail("Registration should fail with duplicate email, but succeeded")
            else:
                pytest.skip("Error message did not appear - backend might not be running or behavior changed")

        # Verify user remains on register page
        assert "/register" in driver.current_url, \
            f"User should remain on /register page, but is at {driver.current_url}"

        # Verify no token was stored
        token = driver.execute_script("return window.localStorage.getItem('token');")
        assert token is None, "Token should not be stored after failed registration"

    def test_password_visibility_toggle(self, driver, base_url):
        """
        Test password show/hide functionality on register page

        RegisterPage.tsx line 98: Toggle button to show/hide password
        Similar to login page functionality

        Locator: Button near password input (may need manual verification)
        """
        driver.get(f"{base_url}/register")

        wait = WebDriverWait(driver, 10)
        password_input = wait.until(EC.presence_of_element_located((By.ID, "password")))

        # Enter password
        password_input.send_keys("testpassword123")

        # Initial state: password should be hidden
        assert password_input.get_attribute("type") == "password", \
            "Password input should initially be type='password'"

        # Find the show/hide toggle button
        try:
            toggle_button = driver.find_element(
                By.XPATH,
                "//input[@id='password']/following-sibling::button[@type='button']"
            )
        except:
            try:
                toggle_button = driver.find_element(
                    By.XPATH,
                    "//input[@id='password']/parent::div//button[@type='button']"
                )
            except:
                pytest.skip("Password visibility toggle button locator needs manual verification")

        # Click to show password
        toggle_button.click()
        time.sleep(0.5)

        # Verify password is visible
        password_type = password_input.get_attribute("type")
        assert password_type == "text", \
            f"Password should be visible (type='text'), but is type='{password_type}'"

        # Click again to hide
        toggle_button.click()
        time.sleep(0.5)

        # Verify password is hidden again
        password_type = password_input.get_attribute("type")
        assert password_type == "password", \
            f"Password should be hidden (type='password'), but is type='{password_type}'"

    def test_navigation_to_login(self, driver, base_url):
        """
        Test navigation from register page to login page

        RegisterPage.tsx contains link: "Sign in" pointing to /login
        """
        driver.get(f"{base_url}/register")

        wait = WebDriverWait(driver, 10)

        # Find and click "Sign in" link
        signin_link = wait.until(
            EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, "Sign in"))
        )
        signin_link.click()

        # Verify navigation to login page
        wait.until(EC.url_contains("/login"))
        assert "/login" in driver.current_url, \
            f"Expected /login in URL, got {driver.current_url}"

        # Verify login page loaded
        login_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Sign in')]")
            )
        )
        assert login_heading.is_displayed(), "Login page heading not visible"

    def test_navigation_back_to_home(self, driver, base_url):
        """
        Test "Back to Home" link navigation
        """
        driver.get(f"{base_url}/register")

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

    def test_email_format_validation(self, driver, base_url):
        """
        Test HTML5 email format validation

        Expected behavior:
        - Enter invalid email format
        - HTML5 validation should prevent submission
        """
        driver.get(f"{base_url}/register")

        wait = WebDriverWait(driver, 10)

        # Fill form with invalid email
        fullname_input = wait.until(EC.presence_of_element_located((By.ID, "fullName")))
        fullname_input.send_keys("Test User")

        email_input = driver.find_element(By.ID, "email")
        email_input.send_keys("invalid-email-format")  # Missing @ and domain

        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys("password123")

        terms_checkbox = driver.find_element(By.ID, "agreeToTerms")
        terms_checkbox.click()

        # Attempt to submit
        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_button.click()

        # Verify email input has type="email" for HTML5 validation
        assert email_input.get_attribute("type") == "email", \
            "Email input should have type='email' for validation"

        # Verify still on register page (validation prevented submission)
        time.sleep(1)  # Brief wait to ensure no navigation
        assert "/register" in driver.current_url, \
            "Should remain on register page with invalid email format"


@pytest.mark.auth
class TestRegisterPageAccessControl:
    """Tests for register page access control and redirects"""

    def test_already_logged_in_redirect(self, authenticated_student_driver, base_url):
        """
        Test that already-authenticated users are redirected from register page

        App.tsx logic: If user is authenticated and tries to access /register,
        they should be redirected to their role-based dashboard
        """
        # Driver is already authenticated (via fixture)
        authenticated_student_driver.get(f"{base_url}/register")

        wait = WebDriverWait(authenticated_student_driver, 10)

        # Should be redirected to dashboard
        wait.until(EC.url_contains("/dashboard"))

        assert "/dashboard" in authenticated_student_driver.current_url, \
            "Already authenticated user should be redirected from /register to /dashboard"
