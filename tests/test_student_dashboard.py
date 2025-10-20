"""
UI Tests for QuLearn Student Dashboard

Tests cover:
- Dashboard page loading and element visibility
- Stats rings (Points, Badges, Streak, Enrolled Courses)
- My Courses section
- Achievements section
- Navigation to course catalog
- Empty state handling
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


@pytest.mark.smoke
class TestStudentDashboard:
    """Test suite for student dashboard functionality"""

    def test_dashboard_page_loads(self, authenticated_student_driver, base_url):
        """
        Test that the student dashboard loads successfully with key elements

        Verifies:
        - Welcome message heading
        - Dashboard URL is correct
        - Main sections are present

        Locators:
        - Welcome heading: XPath with text "Welcome Back!" (StudentDashboard.tsx line 111)
        """
        driver = authenticated_student_driver

        # Navigate to dashboard (should already be there from auth fixture)
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Verify URL
        assert "/dashboard" in driver.current_url, \
            f"Expected /dashboard in URL, got {driver.current_url}"

        # Verify main welcome heading
        # StudentDashboard.tsx line 111: "Welcome Back!"
        welcome_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )
        assert welcome_heading.is_displayed(), "Welcome heading not visible"
        assert "Welcome Back!" in welcome_heading.text, \
            f"Unexpected heading text: {welcome_heading.text}"

        # Verify subtitle
        # StudentDashboard.tsx line 112: "Continue your quantum computing journey"
        subtitle = driver.find_element(
            By.XPATH,
            "//p[contains(text(), 'quantum computing journey')]"
        )
        assert subtitle.is_displayed(), "Dashboard subtitle not visible"

    def test_stats_rings_display(self, authenticated_student_driver, base_url):
        """
        Test that all stat rings are displayed with correct labels

        Stats Rings:
        - Total Points (StudentDashboard.tsx line 122)
        - Badges Earned (line 128)
        - Learning Streak (line 135)
        - Enrolled Courses (line 142)

        Each ring should display:
        - An icon
        - A numeric value
        - A label

        Locators: Text content matching stat labels
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Verify Total Points stat ring
        total_points_label = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//span[contains(text(), 'Total Points')]")
            )
        )
        assert total_points_label.is_displayed(), "Total Points stat ring not visible"

        # Verify Badges Earned stat ring
        badges_label = driver.find_element(
            By.XPATH,
            "//span[contains(text(), 'Badges Earned')]"
        )
        assert badges_label.is_displayed(), "Badges Earned stat ring not visible"

        # Verify Learning Streak stat ring
        streak_label = driver.find_element(
            By.XPATH,
            "//span[contains(text(), 'Learning Streak')]"
        )
        assert streak_label.is_displayed(), "Learning Streak stat ring not visible"

        # Verify Enrolled Courses stat ring
        enrolled_label = driver.find_element(
            By.XPATH,
            "//span[contains(text(), 'Enrolled Courses')]"
        )
        assert enrolled_label.is_displayed(), "Enrolled Courses stat ring not visible"

    def test_my_courses_section(self, authenticated_student_driver, base_url):
        """
        Test the "My Courses" section displays correctly

        Verifies:
        - Section heading "My Courses"
        - "View All" button linking to /my-courses
        - Course cards if enrolled, or empty state if not

        Locators:
        - Heading: XPath "//h2[contains(text(), 'My Courses')]" (line 156)
        - View All link: Partial link text "View All" (line 157)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Verify "My Courses" section heading
        my_courses_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'My Courses')]")
            )
        )
        assert my_courses_heading.is_displayed(), "My Courses heading not visible"

        # Verify "View All" link exists
        view_all_link = driver.find_element(By.PARTIAL_LINK_TEXT, "View All")
        assert view_all_link.is_displayed(), "View All link not visible"
        assert "/my-courses" in view_all_link.get_attribute("href"), \
            "View All link should point to /my-courses"

        # Check if courses are displayed or empty state is shown
        # StudentDashboard.tsx line 162: Empty state check
        try:
            # Try to find empty state message
            empty_message = driver.find_element(
                By.XPATH,
                "//h3[contains(text(), 'No courses enrolled yet')]"
            )
            if empty_message.is_displayed():
                # Empty state - verify "Browse Courses" button exists
                browse_button = driver.find_element(
                    By.XPATH,
                    "//a[contains(text(), 'Browse Courses')]"
                )
                assert browse_button.is_displayed(), \
                    "Browse Courses button not visible in empty state"
                assert "/courses" in browse_button.get_attribute("href"), \
                    "Browse Courses button should link to /courses"
        except:
            # Courses exist - verify at least one course card is present
            # StudentDashboard.tsx line 176: Course cards rendered
            course_cards = driver.find_elements(
                By.XPATH,
                "//h3[contains(@class, 'font-bold') and contains(@class, 'text-gray-900')]"
            )
            assert len(course_cards) > 0, "Expected at least one course card to be displayed"

    def test_achievements_section(self, authenticated_student_driver, base_url):
        """
        Test the "My achievements" section displays correctly

        Verifies:
        - Section heading "My achievements"
        - "View All" button linking to /achievements
        - Badge cards or empty state

        Locators:
        - Heading: XPath "//h2[contains(text(), 'My achievements')]" (line 306)
        - View All link: Partial link text "View All" (line 307)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Verify "My achievements" section heading
        achievements_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'My achievements')]")
            )
        )
        assert achievements_heading.is_displayed(), "Achievements heading not visible"

        # Verify "View All" link exists
        view_all_link = driver.find_element(
            By.XPATH,
            "//h2[contains(text(), 'My achievements')]/following::a[contains(text(), 'View All')]"
        )
        assert view_all_link.is_displayed(), "View All link not visible"
        assert "/achievements" in view_all_link.get_attribute("href"), \
            "View All link should point to /achievements"

        # Check for badges or empty state
        try:
            # Try to find empty state
            empty_message = driver.find_element(
                By.XPATH,
                "//p[contains(text(), 'No badges yet')]"
            )
            if empty_message.is_displayed():
                assert "complete lessons to earn badges" in empty_message.text.lower(), \
                    "Empty state message should mention earning badges"
        except:
            # Badges exist - verify badge cards
            # StudentDashboard.tsx line 318: Badge grid with buttons
            badge_buttons = driver.find_elements(
                By.XPATH,
                "//button[contains(@class, 'bg-gradient-to-br')]"
            )
            assert len(badge_buttons) > 0, "Expected at least one badge to be displayed"

    def test_browse_courses_promotional_section(self, authenticated_student_driver, base_url):
        """
        Test the promotional section for browsing courses

        Verifies:
        - Promotional heading about accelerating career
        - "Browse All Courses" button
        - Button links to /courses

        Locators:
        - Heading: Text contains "Accelerate your career" (line 266)
        - Button: Text "Browse All Courses" (line 275)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Verify promotional heading
        promo_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Accelerate your career')]")
            )
        )
        assert promo_heading.is_displayed(), "Promotional heading not visible"

        # Verify "Browse All Courses" button
        browse_button = driver.find_element(
            By.XPATH,
            "//a[contains(., 'Browse All Courses')]"
        )
        assert browse_button.is_displayed(), "Browse All Courses button not visible"
        assert "/courses" in browse_button.get_attribute("href"), \
            "Browse All Courses button should link to /courses"

    def test_navigation_to_my_courses(self, authenticated_student_driver, base_url):
        """
        Test navigation from dashboard to My Courses page via "View All" link
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Find and click "View All" link next to "My Courses"
        view_all_link = driver.find_element(
            By.XPATH,
            "//h2[contains(text(), 'My Courses')]/following-sibling::a[contains(text(), 'View All')]"
        )
        view_all_link.click()

        # Verify navigation to /my-courses
        wait.until(EC.url_contains("/my-courses"))
        assert "/my-courses" in driver.current_url, \
            f"Expected /my-courses in URL, got {driver.current_url}"

    def test_navigation_to_achievements(self, authenticated_student_driver, base_url):
        """
        Test navigation from dashboard to Achievements page via "View All" link
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Find and click "View All" link next to "My achievements"
        view_all_link = driver.find_element(
            By.XPATH,
            "//h2[contains(text(), 'My achievements')]/following-sibling::a[contains(text(), 'View All')]"
        )
        view_all_link.click()

        # Verify navigation to /achievements
        wait.until(EC.url_contains("/achievements"))
        assert "/achievements" in driver.current_url, \
            f"Expected /achievements in URL, got {driver.current_url}"

    def test_navigation_to_course_catalog(self, authenticated_student_driver, base_url):
        """
        Test navigation from dashboard to Course Catalog via "Browse All Courses" button
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Find and click "Browse All Courses" button
        browse_button = driver.find_element(
            By.XPATH,
            "//a[contains(., 'Browse All Courses')]"
        )
        browse_button.click()

        # Verify navigation to /courses
        wait.until(EC.url_contains("/courses"))
        assert "/courses" in driver.current_url, \
            f"Expected /courses in URL, got {driver.current_url}"

    @pytest.mark.slow
    def test_badge_modal_opens_on_click(self, authenticated_student_driver, base_url):
        """
        Test that clicking a badge opens the badge detail modal

        Behavior:
        - Click on a badge card
        - Modal should open with badge details
        - Modal should have "Close" button and "View Badge Page" link

        Note: This test only runs if the student has badges
        Locators:
        - Badge button: "//button[contains(@class, 'bg-gradient-to-br')]" (line 320)
        - Modal: Dialog component (line 359)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Try to find a badge button
        try:
            badge_button = driver.find_element(
                By.XPATH,
                "//button[contains(@class, 'bg-gradient-to-br')]"
            )
        except:
            pytest.skip("No badges found for this student - skipping badge modal test")

        # Click the badge button
        badge_button.click()

        # Wait for modal to appear
        # StudentDashboard.tsx line 359: Dialog component
        try:
            modal_title = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Badge Details')]")
                )
            )
            assert modal_title.is_displayed(), "Badge modal title not visible"

            # Verify "Close" button exists
            close_button = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'Close')]"
            )
            assert close_button.is_displayed(), "Close button not visible in modal"

            # Verify "View Badge Page" link exists
            view_badge_link = driver.find_element(
                By.XPATH,
                "//a[contains(text(), 'View Badge Page')]"
            )
            assert view_badge_link.is_displayed(), "View Badge Page link not visible"

            # Close the modal
            close_button.click()

            # Verify modal closes
            wait.until(
                EC.invisibility_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Badge Details')]")
                )
            )
        except TimeoutException:
            pytest.fail("Badge modal did not appear after clicking badge")

    def test_enrolled_course_card_displays_correctly(self, authenticated_student_driver, base_url):
        """
        Test that enrolled course cards display all required information

        Course Card should show:
        - Course thumbnail
        - Course title
        - Course subtitle
        - Instructor name
        - Difficulty level badge
        - Category badge
        - Progress bar with percentage
        - Prerequisites (if any)

        Note: Test only runs if student has enrolled courses
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Wait for dashboard to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )

        # Check if student has enrolled courses
        try:
            empty_state = driver.find_element(
                By.XPATH,
                "//h3[contains(text(), 'No courses enrolled yet')]"
            )
            if empty_state.is_displayed():
                pytest.skip("Student has no enrolled courses - skipping course card test")
        except:
            pass  # Courses exist, continue with test

        # Verify at least one course card exists
        # StudentDashboard.tsx line 176: Course cards with specific structure
        course_cards = driver.find_elements(
            By.XPATH,
            "//a[contains(@class, 'bg-white') and contains(@class, 'rounded-2xl')]"
        )
        assert len(course_cards) > 0, "No course cards found"

        # Test first course card
        first_card = course_cards[0]

        # Verify course title exists (should be an h3 element)
        # Line 209: Course title
        title = first_card.find_element(By.XPATH, ".//h3")
        assert title.is_displayed(), "Course title not visible in card"
        assert len(title.text) > 0, "Course title is empty"

        # Verify progress bar exists
        # Line 230-234: Progress bar
        progress_bar = first_card.find_element(
            By.XPATH,
            ".//div[contains(@class, 'bg-gray-200')]"
        )
        assert progress_bar.is_displayed(), "Progress bar not visible"

        # Verify instructor name
        # Line 218: Instructor name with Users icon
        instructor = first_card.find_element(
            By.XPATH,
            ".//span[contains(text(), 'By ')]"
        )
        assert instructor.is_displayed(), "Instructor name not visible"
        assert "By " in instructor.text, "Instructor name should start with 'By '"

    def test_dashboard_loads_with_api_data(self, authenticated_student_driver, base_url):
        """
        Test that dashboard successfully loads data from API

        Verifies:
        - No error state displayed
        - No loading spinner persists
        - Dashboard content is visible

        API Endpoint: useGetMyDashboardQuery() (line 79)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 15)  # Longer wait for API call

        # Verify loading spinner disappears
        # StudentDashboard.tsx line 86: Loading spinner
        try:
            loading_spinner = driver.find_element(
                By.XPATH,
                "//div[contains(@class, 'animate-spin')]"
            )
            # Wait for spinner to disappear
            wait.until(EC.invisibility_of_element(loading_spinner))
        except:
            pass  # Spinner might not be visible if page loads quickly

        # Verify no error state
        # StudentDashboard.tsx line 96: Error message
        error_elements = driver.find_elements(
            By.XPATH,
            "//h2[contains(text(), 'Error Loading Dashboard')]"
        )
        assert len(error_elements) == 0, "Dashboard should not display error state"

        # Verify main content is visible
        welcome_heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h1[contains(text(), 'Welcome Back')]")
            )
        )
        assert welcome_heading.is_displayed(), "Dashboard content did not load"


class TestDashboardAccessControl:
    """Tests for dashboard access control"""

    def test_unauthenticated_user_redirected(self, driver, base_url, clear_local_storage):
        """
        Test that unauthenticated users are redirected to login page

        Expected: Accessing /dashboard without authentication redirects to /login
        """
        driver.get(f"{base_url}/dashboard")

        wait = WebDriverWait(driver, 10)

        # Should be redirected to login
        wait.until(EC.url_contains("/login"))
        assert "/login" in driver.current_url, \
            "Unauthenticated user should be redirected to /login"
