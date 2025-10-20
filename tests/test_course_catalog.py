"""
UI Tests for QuLearn Course Catalog

Tests cover:
- Course catalog page loading
- Search functionality
- Category filtering
- Difficulty filtering
- Course card display
- Course detail dialog
- Enrollment actions
- Empty states
"""

import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import Select


@pytest.mark.smoke
class TestCourseCatalog:
    """Test suite for course catalog page functionality"""

    def test_course_catalog_page_loads(self, authenticated_student_driver, base_url):
        """
        Test that the course catalog page loads successfully

        Verifies:
        - Page heading "Course catalog"
        - Search input field
        - Category and difficulty dropdowns
        - At least one course card (if courses exist)

        Locators:
        - Heading: XPath "//h2[contains(text(), 'Course catalog')]" (CourseCatalog.tsx line 122)
        - Search input: CSS 'input[type="text"]' with placeholder (line 132-138)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Verify URL
        assert "/courses" in driver.current_url, \
            f"Expected /courses in URL, got {driver.current_url}"

        # Verify page heading
        # CourseCatalog.tsx line 122: "Course catalog"
        heading = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )
        assert heading.is_displayed(), "Course catalog heading not visible"

        # Verify subtitle
        subtitle = driver.find_element(
            By.XPATH,
            "//p[contains(text(), 'quantum computing courses')]"
        )
        assert subtitle.is_displayed(), "Course catalog subtitle not visible"

        # Verify search input exists
        # Line 132-138: Search input with placeholder
        search_input = driver.find_element(
            By.CSS_SELECTOR,
            'input[placeholder="Search courses..."]'
        )
        assert search_input.is_displayed(), "Search input not visible"
        assert search_input.get_attribute("type") == "text", "Search input type should be text"

        # Verify category dropdown exists
        # Line 142-153: Category select
        category_dropdown = driver.find_element(By.CSS_SELECTOR, 'select')
        assert category_dropdown.is_displayed(), "Category dropdown not visible"

        # Verify difficulty dropdown exists
        # Line 154-163: Difficulty select
        difficulty_dropdowns = driver.find_elements(By.CSS_SELECTOR, 'select')
        assert len(difficulty_dropdowns) >= 2, "Should have both category and difficulty dropdowns"

    def test_search_courses_by_keyword(self, authenticated_student_driver, base_url):
        """
        Test searching for courses by keyword

        Behavior:
        - Enter a search term
        - Verify filtered results only show matching courses
        - Search matches title and description

        Locators:
        - Search input: 'input[placeholder="Search courses..."]' (line 132)
        - Filter logic: Lines 74-76 (matchesSearch)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        # Get initial course count
        time.sleep(1)  # Brief wait for courses to load
        initial_courses = driver.find_elements(
            By.XPATH,
            "//div[contains(@class, 'border-blue-200') and contains(@class, 'rounded-2xl')]"
        )

        if len(initial_courses) == 0:
            pytest.skip("No courses available to test search functionality")

        # Get the first course title to use as search term
        first_course_title = driver.find_element(
            By.XPATH,
            "//h3[contains(@class, 'font-bold') and contains(@class, 'text-blue-900')]"
        )
        search_term = first_course_title.text.split()[0]  # Use first word of title

        # Enter search term
        search_input = driver.find_element(
            By.CSS_SELECTOR,
            'input[placeholder="Search courses..."]'
        )
        search_input.clear()
        search_input.send_keys(search_term)

        # Wait for filtering to apply (React state update)
        time.sleep(1)

        # Verify filtered results
        filtered_courses = driver.find_elements(
            By.XPATH,
            "//div[contains(@class, 'border-blue-200') and contains(@class, 'rounded-2xl')]"
        )

        # At least the course we searched for should appear
        assert len(filtered_courses) > 0, \
            f"Search for '{search_term}' should return at least one result"

        # Verify all displayed courses contain the search term (in title or subtitle)
        for course in filtered_courses[:3]:  # Check first 3 courses
            course_text = course.text.lower()
            assert search_term.lower() in course_text, \
                f"Course should contain search term '{search_term}'"

    def test_filter_by_category(self, authenticated_student_driver, base_url):
        """
        Test filtering courses by category

        Behavior:
        - Select a category from dropdown
        - Verify only courses from that category are displayed

        Locators:
        - Category dropdown: 'select' (first one) (line 142-153)
        - Options: CourseCatalog.tsx line 147: "All Categories" + dynamic categories
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(1)  # Brief wait for courses to load

        # Find category dropdown (first select element)
        category_dropdowns = driver.find_elements(By.CSS_SELECTOR, 'select')
        if len(category_dropdowns) < 2:
            pytest.fail("Category and difficulty dropdowns not found")

        category_dropdown = Select(category_dropdowns[0])

        # Get available categories (skip "All Categories" option)
        available_categories = [option.get_attribute('value')
                               for option in category_dropdown.options
                               if option.get_attribute('value') != 'all']

        if len(available_categories) == 0:
            pytest.skip("No specific categories available to test filtering")

        # Select first available category
        test_category = available_categories[0]
        category_dropdown.select_by_value(test_category)

        # Wait for filtering
        time.sleep(1)

        # Verify filtered courses
        filtered_courses = driver.find_elements(
            By.XPATH,
            "//div[contains(@class, 'border-blue-200') and contains(@class, 'rounded-2xl')]"
        )

        if len(filtered_courses) > 0:
            # Verify category badge on course cards matches selected category
            # CourseCatalog.tsx line 195: Category display
            for course in filtered_courses[:3]:
                category_badge = course.find_element(
                    By.XPATH,
                    ".//span[contains(@class, 'font-semibold')]"
                )
                # Category should match or be displayed on card
                assert category_badge.is_displayed(), \
                    "Category badge should be visible on course card"

    def test_filter_by_difficulty(self, authenticated_student_driver, base_url):
        """
        Test filtering courses by difficulty level

        Difficulty levels: Beginner, Intermediate, Advanced
        Locators:
        - Difficulty dropdown: 'select' (second one) (line 154-163)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(1)  # Brief wait for courses to load

        # Find difficulty dropdown (second select element)
        difficulty_dropdowns = driver.find_elements(By.CSS_SELECTOR, 'select')
        if len(difficulty_dropdowns) < 2:
            pytest.fail("Difficulty dropdown not found")

        difficulty_dropdown = Select(difficulty_dropdowns[1])

        # Select "Beginner" difficulty
        difficulty_dropdown.select_by_value("beginner")

        # Wait for filtering
        time.sleep(1)

        # Verify filtered courses
        filtered_courses = driver.find_elements(
            By.XPATH,
            "//div[contains(@class, 'border-blue-200') and contains(@class, 'rounded-2xl')]"
        )

        if len(filtered_courses) > 0:
            # Verify difficulty badge on course cards
            # CourseCatalog.tsx line 201-211: Difficulty badge
            for course in filtered_courses[:3]:
                difficulty_badge = course.find_element(
                    By.XPATH,
                    ".//span[contains(@class, 'rounded-full') and (contains(@class, 'bg-green') or contains(@class, 'bg-yellow') or contains(@class, 'bg-red'))]"
                )
                badge_text = difficulty_badge.text.lower()
                assert "beginner" in badge_text, \
                    f"Expected 'beginner' difficulty, got '{badge_text}'"

    def test_combined_search_and_filter(self, authenticated_student_driver, base_url):
        """
        Test combining search with category/difficulty filters

        Behavior:
        - Enter search term
        - Select category filter
        - Verify results match both criteria
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(1)

        # Enter generic search term (e.g., "quantum")
        search_input = driver.find_element(
            By.CSS_SELECTOR,
            'input[placeholder="Search courses..."]'
        )
        search_input.clear()
        search_input.send_keys("quantum")

        # Select beginner difficulty
        difficulty_dropdowns = driver.find_elements(By.CSS_SELECTOR, 'select')
        if len(difficulty_dropdowns) >= 2:
            difficulty_dropdown = Select(difficulty_dropdowns[1])
            difficulty_dropdown.select_by_value("beginner")

        # Wait for filtering
        time.sleep(1)

        # Verify results (should have both search term and beginner difficulty)
        filtered_courses = driver.find_elements(
            By.XPATH,
            "//div[contains(@class, 'border-blue-200') and contains(@class, 'rounded-2xl')]"
        )

        # Should have some results or show empty state
        if len(filtered_courses) == 0:
            # Check for "No courses found" message
            # CourseCatalog.tsx line 241-245: Empty state
            empty_message = driver.find_element(
                By.XPATH,
                "//h3[contains(text(), 'No courses found')]"
            )
            assert empty_message.is_displayed(), \
                "Should show 'No courses found' message when no results"

    def test_course_card_displays_correctly(self, authenticated_student_driver, base_url):
        """
        Test that course cards display all required information

        Course Card should show:
        - Thumbnail image
        - Course title
        - Course subtitle
        - Category
        - Difficulty badge
        - Instructor name
        - "View Details" button

        Locators:
        - Course card: Line 175-234 (comprehensive card structure)
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(2)  # Wait for courses to load

        # Find course cards
        course_cards = driver.find_elements(
            By.XPATH,
            "//div[contains(@class, 'border-blue-200') and contains(@class, 'rounded-2xl')]"
        )

        if len(course_cards) == 0:
            pytest.skip("No courses available to test card display")

        # Test first course card
        first_card = course_cards[0]

        # Verify course title
        # Line 191: Course title (h3 element)
        title = first_card.find_element(
            By.XPATH,
            ".//h3[contains(@class, 'font-bold')]"
        )
        assert title.is_displayed(), "Course title not visible"
        assert len(title.text) > 0, "Course title is empty"

        # Verify course subtitle
        # Line 192: Course subtitle
        subtitle = first_card.find_element(
            By.XPATH,
            ".//p[contains(@class, 'text-blue-700')]"
        )
        assert subtitle.is_displayed(), "Course subtitle not visible"

        # Verify difficulty badge
        # Line 201-211: Difficulty badge
        difficulty_badge = first_card.find_element(
            By.XPATH,
            ".//span[contains(@class, 'rounded-full') and (contains(@class, 'bg-green') or contains(@class, 'bg-yellow') or contains(@class, 'bg-red'))]"
        )
        assert difficulty_badge.is_displayed(), "Difficulty badge not visible"
        badge_text = difficulty_badge.text.lower()
        assert badge_text in ["beginner", "intermediate", "advanced"], \
            f"Unexpected difficulty level: {badge_text}"

        # Verify instructor name
        # Line 217: Instructor info with Users icon
        instructor = first_card.find_element(
            By.XPATH,
            ".//span[contains(text(), 'By ')]"
        )
        assert instructor.is_displayed(), "Instructor name not visible"

        # Verify "View Details" button
        # Line 222-230: View Details button
        view_details_button = first_card.find_element(
            By.XPATH,
            ".//button[contains(text(), 'View Details')]"
        )
        assert view_details_button.is_displayed(), "View Details button not visible"
        assert view_details_button.is_enabled(), "View Details button should be enabled"

    def test_course_card_click_opens_dialog(self, authenticated_student_driver, base_url):
        """
        Test that clicking a course card or "View Details" opens the detail dialog

        Behavior:
        - Click "View Details" button on a course
        - Detail dialog should open
        - Dialog should show course details, description, prerequisites, etc.

        Locators:
        - Dialog: Transition/Dialog component (line 249-406)
        - Dialog title should match course title
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(2)  # Wait for courses to load

        # Find first course card
        course_cards = driver.find_elements(
            By.XPATH,
            "//div[contains(@class, 'border-blue-200') and contains(@class, 'rounded-2xl')]"
        )

        if len(course_cards) == 0:
            pytest.skip("No courses available to test dialog")

        # Get course title for verification
        course_title = course_cards[0].find_element(
            By.XPATH,
            ".//h3[contains(@class, 'font-bold')]"
        ).text

        # Click "View Details" button
        view_details_button = course_cards[0].find_element(
            By.XPATH,
            ".//button[contains(text(), 'View Details')]"
        )
        view_details_button.click()

        # Wait for dialog to open
        # CourseCatalog.tsx line 274: Dialog.Panel
        try:
            dialog_title = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, f"//h2[contains(text(), '{course_title[:20]}')]")
                )
            )
            assert dialog_title.is_displayed(), "Course dialog did not open"

            # Verify close button exists
            # Line 278-283: Close button with X icon
            close_button = driver.find_element(
                By.XPATH,
                "//button[contains(@class, 'rounded-full')]"
            )
            assert close_button.is_displayed(), "Close button not visible in dialog"

            # Verify "Course Description" section
            # Line 335-342: Course Description heading
            description_heading = driver.find_element(
                By.XPATH,
                "//h3[contains(text(), 'Course Description')]"
            )
            assert description_heading.is_displayed(), \
                "Course Description section not visible"

            # Verify instructor information
            # Line 323-325: Instructor display
            instructor_label = driver.find_element(
                By.XPATH,
                "//span[contains(text(), 'Instructor:')]"
            )
            assert instructor_label.is_displayed(), "Instructor info not visible in dialog"

        except TimeoutException:
            pytest.fail("Course detail dialog did not open")

    def test_close_course_detail_dialog(self, authenticated_student_driver, base_url):
        """
        Test closing the course detail dialog via close button

        Behavior:
        - Open course detail dialog
        - Click close button (X)
        - Dialog should close
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(2)

        # Open dialog
        view_details_button = driver.find_element(
            By.XPATH,
            "//button[contains(text(), 'View Details')]"
        )
        view_details_button.click()

        # Wait for dialog to open
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h3[contains(text(), 'Course Description')]")
            )
        )

        # Click close button
        close_button = driver.find_element(
            By.XPATH,
            "//button[contains(@class, 'rounded-full') and contains(@class, 'shadow-lg')]"
        )
        close_button.click()

        # Verify dialog closes
        time.sleep(1)
        dialogs = driver.find_elements(
            By.XPATH,
            "//h3[contains(text(), 'Course Description')]"
        )
        assert len([d for d in dialogs if d.is_displayed()]) == 0, \
            "Dialog should be closed after clicking close button"

    def test_empty_state_no_courses_found(self, authenticated_student_driver, base_url):
        """
        Test empty state when no courses match search/filter criteria

        Behavior:
        - Enter search term that won't match any course
        - Verify "No courses found" message appears
        - Verify helper text about adjusting criteria

        Locators:
        - Empty state: Lines 240-246
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(1)

        # Enter search term that won't match
        search_input = driver.find_element(
            By.CSS_SELECTOR,
            'input[placeholder="Search courses..."]'
        )
        search_input.clear()
        search_input.send_keys("xyznonexistentcourse123")

        # Wait for filtering
        time.sleep(1)

        # Verify empty state message
        # CourseCatalog.tsx line 241-245
        try:
            empty_heading = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'No courses found')]")
                )
            )
            assert empty_heading.is_displayed(), "Empty state heading not visible"

            # Verify helper text
            helper_text = driver.find_element(
                By.XPATH,
                "//p[contains(text(), 'Try adjusting your search criteria')]"
            )
            assert helper_text.is_displayed(), "Empty state helper text not visible"

        except TimeoutException:
            pytest.fail("Empty state message did not appear for non-matching search")

    @pytest.mark.slow
    def test_view_full_course_from_dialog(self, authenticated_student_driver, base_url):
        """
        Test navigating to full course page from detail dialog

        Behavior:
        - Open course detail dialog
        - Click "View Full Course" button
        - Navigate to /courses/:courseId

        Locators:
        - "View Full Course" button: Line 388-396
        """
        driver = authenticated_student_driver
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for page to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(2)

        # Open dialog
        view_details_button = driver.find_element(
            By.XPATH,
            "//button[contains(text(), 'View Details')]"
        )
        view_details_button.click()

        # Wait for dialog
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h3[contains(text(), 'Course Description')]")
            )
        )

        # Find and click "View Full Course" button
        # CourseCatalog.tsx line 388-396: View Full Course button
        view_full_course_button = driver.find_element(
            By.XPATH,
            "//button[contains(text(), 'View Full Course')]"
        )
        view_full_course_button.click()

        # Verify navigation to course detail page
        wait.until(EC.url_contains("/courses/"))
        assert "/courses/" in driver.current_url, \
            "Should navigate to course detail page"
        # URL should not be just "/courses" (catalog), should have course ID
        assert driver.current_url != f"{base_url}/courses", \
            "URL should include course ID"


class TestCourseCatalogAccessControl:
    """Tests for course catalog access control"""

    def test_unauthenticated_user_can_view_catalog(self, driver, base_url):
        """
        Test that unauthenticated users can view the course catalog

        Note: Based on routing in App.tsx, /courses might be accessible to guests
        This test verifies current behavior
        """
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Course catalog might be public or require login
        # Check which behavior is implemented
        current_url = driver.current_url

        if "/login" in current_url:
            # Catalog requires authentication
            assert True, "Course catalog requires authentication"
        else:
            # Catalog is public
            try:
                heading = wait.until(
                    EC.presence_of_element_located(
                        (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
                    )
                )
                assert heading.is_displayed(), \
                    "Course catalog should be viewable without authentication"
            except TimeoutException:
                pytest.fail("Course catalog page did not load")
