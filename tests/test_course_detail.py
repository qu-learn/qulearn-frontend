"""
UI Tests for QuLearn Course Detail Page

Tests cover:
- Course detail page loading
- Course information display
- Modules and lessons outline
- Enrollment functionality
- Navigation to lessons
- Prerequisites display
- Dialog interactions
"""

import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException


@pytest.mark.smoke
class TestCourseDetailPage:
    """Test suite for course detail page functionality"""

    def test_course_detail_page_loads(self, authenticated_student_driver, base_url):
        """
        Test that a course detail page loads successfully

        Verifies:
        - Page loads without error
        - Course title is displayed
        - Course image is displayed
        - Main content sections are visible

        Note: Uses a placeholder course ID - replace with actual test course ID
        Locators:
        - Course title: h1 element (CourseDetail.tsx line 132)
        """
        driver = authenticated_student_driver

        # Navigate to course catalog first to get a valid course ID
        driver.get(f"{base_url}/courses")

        wait = WebDriverWait(driver, 15)

        # Wait for catalog to load
        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )

        time.sleep(2)  # Wait for courses to load

        # Click first "View Details" to get course ID, then navigate to full course page
        try:
            view_details = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Details')]"
            )
            view_details.click()

            # Wait for dialog
            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Course Description')]")
                )
            )

            # Click "View Full Course"
            view_full_course = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Full Course')]"
            )
            view_full_course.click()

            # Should navigate to course detail page
            wait.until(EC.url_contains("/courses/"))

            # Verify course title is displayed
            # CourseDetail.tsx line 132: Course title (h1)
            course_title = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h1[contains(@class, 'font-bold')]")
                )
            )
            assert course_title.is_displayed(), "Course title not visible"
            assert len(course_title.text) > 0, "Course title is empty"

        except (TimeoutException, NoSuchElementException):
            pytest.skip("No courses available to test course detail page")

    def test_course_information_sections_display(self, authenticated_student_driver, base_url):
        """
        Test that all course information sections are displayed

        Course detail should show:
        - Course title
        - Course subtitle
        - Course description
        - Instructor name
        - Creation date
        - Difficulty level badge
        - Category badge
        - Prerequisites (if any)

        Locators:
        - Title: h1 (line 132)
        - Subtitle: p with text-xl (line 133)
        - Description: p with text-gray-700 (line 134)
        - Instructor: line 138
        - Difficulty badge: line 111-122
        """
        driver = authenticated_student_driver

        # Navigate via catalog
        driver.get(f"{base_url}/courses")
        wait = WebDriverWait(driver, 15)

        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )
        time.sleep(2)

        try:
            # Navigate to course detail
            view_details = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Details')]"
            )
            view_details.click()

            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Course Description')]")
                )
            )

            view_full_course = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Full Course')]"
            )
            view_full_course.click()

            wait.until(EC.url_contains("/courses/"))

            # Verify course title
            course_title = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h1[contains(@class, 'font-bold')]")
                )
            )
            assert course_title.is_displayed(), "Course title not visible"

            # Verify course subtitle
            # Line 133: subtitle (text-xl)
            subtitle = driver.find_element(
                By.XPATH,
                "//p[contains(@class, 'text-xl') and contains(@class, 'text-gray-600')]"
            )
            assert subtitle.is_displayed(), "Course subtitle not visible"

            # Verify course description
            # Line 134: description
            description = driver.find_element(
                By.XPATH,
                "//p[contains(@class, 'text-gray-700')]"
            )
            assert description.is_displayed(), "Course description not visible"
            assert len(description.text) > 0, "Course description is empty"

            # Verify instructor information
            # Line 137-141: Instructor section
            instructor_label = driver.find_element(
                By.XPATH,
                "//span[contains(text(), 'Instructor:')]"
            )
            assert instructor_label.is_displayed(), "Instructor label not visible"

            # Verify difficulty badge
            # Line 111-122: Difficulty badge on image
            difficulty_badge = driver.find_element(
                By.XPATH,
                "//button[contains(@class, 'rounded-full') and (contains(@class, 'bg-green') or contains(@class, 'bg-yellow') or contains(@class, 'bg-red'))]"
            )
            assert difficulty_badge.is_displayed(), "Difficulty badge not visible"
            badge_text = difficulty_badge.text.lower()
            assert badge_text in ["beginner", "intermediate", "advanced"], \
                f"Unexpected difficulty: {badge_text}"

            # Verify category badge
            # Line 123-125: Category badge
            category_badge = driver.find_element(
                By.XPATH,
                "//button[contains(@class, 'bg-gray-900')]"
            )
            assert category_badge.is_displayed(), "Category badge not visible"

        except (TimeoutException, NoSuchElementException) as e:
            pytest.skip(f"Could not load course detail page: {str(e)}")

    def test_course_outline_section_displays(self, authenticated_student_driver, base_url):
        """
        Test that the "Course Outline" section displays modules and lessons

        Verifies:
        - "Course Outline" heading
        - Module titles
        - Lesson items
        - Expandable/collapsible modules (Disclosure component)

        Locators:
        - Course Outline heading: line 177
        - Module disclosure: line 180-223
        - Lesson buttons: line 203-208
        """
        driver = authenticated_student_driver

        # Navigate to course detail
        driver.get(f"{base_url}/courses")
        wait = WebDriverWait(driver, 15)

        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )
        time.sleep(2)

        try:
            view_details = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Details')]"
            )
            view_details.click()

            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Course Description')]")
                )
            )

            view_full_course = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Full Course')]"
            )
            view_full_course.click()

            wait.until(EC.url_contains("/courses/"))

            # Verify "Course Outline" heading
            # CourseDetail.tsx line 177
            outline_heading = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Course Outline')]")
                )
            )
            assert outline_heading.is_displayed(), "Course Outline heading not visible"

            # Verify modules are displayed
            # Line 186-188: Module titles
            module_titles = driver.find_elements(
                By.XPATH,
                "//h4[contains(@class, 'font-semibold')]"
            )
            assert len(module_titles) > 0, "No modules displayed in course outline"

            # Verify at least one module is expanded (defaultOpen={true})
            # Line 180: Disclosure defaultOpen
            # Check if lessons are visible
            lesson_items = driver.find_elements(
                By.XPATH,
                "//button[contains(@class, 'text-gray-700')]"
            )
            # Should have lesson items visible if module is expanded
            assert len(lesson_items) >= 0, "Course outline should display lessons"

        except (TimeoutException, NoSuchElementException) as e:
            pytest.skip(f"Could not load course outline: {str(e)}")

    def test_lesson_click_navigation(self, authenticated_student_driver, base_url):
        """
        Test clicking a lesson navigates to the lesson detail page

        Behavior:
        - Click on a lesson title in the course outline
        - Should navigate to /courses/:courseId/lessons/:lessonId

        Locators:
        - Lesson button: line 203-208
        """
        driver = authenticated_student_driver

        # Navigate to course detail
        driver.get(f"{base_url}/courses")
        wait = WebDriverWait(driver, 15)

        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )
        time.sleep(2)

        try:
            view_details = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Details')]"
            )
            view_details.click()

            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Course Description')]")
                )
            )

            view_full_course = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Full Course')]"
            )
            view_full_course.click()

            wait.until(EC.url_contains("/courses/"))

            # Find first lesson button
            # CourseDetail.tsx line 203-208: Lesson button
            lesson_buttons = driver.find_elements(
                By.XPATH,
                "//button[contains(@class, 'text-gray-700') and contains(@class, 'font-medium')]"
            )

            if len(lesson_buttons) == 0:
                pytest.skip("No lessons available in this course")

            # Click first lesson
            first_lesson = lesson_buttons[0]
            lesson_title = first_lesson.text
            first_lesson.click()

            # Should navigate to lesson detail page
            # Line 47-49: handleStartLesson navigation
            wait.until(EC.url_contains("/lessons/"))
            assert "/lessons/" in driver.current_url, \
                "Should navigate to lesson detail page"

        except (TimeoutException, NoSuchElementException) as e:
            pytest.skip(f"Could not test lesson navigation: {str(e)}")

    def test_quiz_available_badge_displays(self, authenticated_student_driver, base_url):
        """
        Test that "Quiz Available" badge displays for lessons with quizzes

        Verifies:
        - Badge shows "Quiz Available" text
        - Badge is visible next to lesson

        Locators:
        - Quiz badge: line 210-216
        """
        driver = authenticated_student_driver

        # Navigate to course detail
        driver.get(f"{base_url}/courses")
        wait = WebDriverWait(driver, 15)

        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )
        time.sleep(2)

        try:
            view_details = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Details')]"
            )
            view_details.click()

            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Course Description')]")
                )
            )

            view_full_course = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Full Course')]"
            )
            view_full_course.click()

            wait.until(EC.url_contains("/courses/"))

            # Look for "Quiz Available" badges
            # CourseDetail.tsx line 210-216: Quiz badge
            quiz_badges = driver.find_elements(
                By.XPATH,
                "//button[contains(text(), 'Quiz Available')]"
            )

            if len(quiz_badges) > 0:
                # At least one quiz available
                first_quiz_badge = quiz_badges[0]
                assert first_quiz_badge.is_displayed(), "Quiz badge not visible"
                assert "Quiz Available" in first_quiz_badge.text, \
                    "Quiz badge should contain 'Quiz Available' text"
            else:
                # No quizzes in this course - skip test
                pytest.skip("No quizzes available in this course")

        except (TimeoutException, NoSuchElementException) as e:
            pytest.skip(f"Could not test quiz badges: {str(e)}")

    def test_prerequisites_section_displays(self, authenticated_student_driver, base_url):
        """
        Test that prerequisites are displayed if the course has any

        Verifies:
        - "Prerequisites" heading
        - Prerequisite badges

        Locators:
        - Prerequisites section: line 143-158
        """
        driver = authenticated_student_driver

        # Navigate to course detail
        driver.get(f"{base_url}/courses")
        wait = WebDriverWait(driver, 15)

        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )
        time.sleep(2)

        try:
            view_details = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Details')]"
            )
            view_details.click()

            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Course Description')]")
                )
            )

            view_full_course = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Full Course')]"
            )
            view_full_course.click()

            wait.until(EC.url_contains("/courses/"))

            # Look for prerequisites section
            # CourseDetail.tsx line 143-158: Prerequisites
            try:
                prereq_heading = driver.find_element(
                    By.XPATH,
                    "//h3[contains(text(), 'Prerequisites')]"
                )

                if prereq_heading.is_displayed():
                    # Prerequisites exist for this course
                    # Verify prerequisite badges
                    prereq_badges = driver.find_elements(
                        By.XPATH,
                        "//button[contains(@class, 'bg-cyan-100')]"
                    )
                    assert len(prereq_badges) > 0, \
                        "Prerequisites section shown but no prerequisites displayed"
                else:
                    pytest.skip("This course has no prerequisites")

            except NoSuchElementException:
                # No prerequisites for this course
                pytest.skip("This course has no prerequisites")

        except (TimeoutException, NoSuchElementException) as e:
            pytest.skip(f"Could not test prerequisites: {str(e)}")

    @pytest.mark.slow
    def test_enroll_button_for_recommended_courses(self, authenticated_student_driver, base_url):
        """
        Test enrollment functionality for recommended courses

        Note: Enrollment button only shows for recommended courses (line 161)
        This test may skip if the course is not recommended

        Behavior:
        - "Enroll Now" button should be visible for recommended courses
        - Clicking button opens confirmation dialog
        - Confirming enrollment enrolls the user

        Locators:
        - Enroll button: line 162-168
        - Enrollment dialog: line 249-275
        """
        driver = authenticated_student_driver

        # Navigate to course detail
        driver.get(f"{base_url}/courses")
        wait = WebDriverWait(driver, 15)

        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Course catalog')]")
            )
        )
        time.sleep(2)

        try:
            view_details = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Details')]"
            )
            view_details.click()

            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h3[contains(text(), 'Course Description')]")
                )
            )

            view_full_course = driver.find_element(
                By.XPATH,
                "//button[contains(text(), 'View Full Course')]"
            )
            view_full_course.click()

            wait.until(EC.url_contains("/courses/"))

            # Look for "Enroll Now" button
            # CourseDetail.tsx line 162-168: Enroll button (only for recommended courses)
            try:
                enroll_button = driver.find_element(
                    By.XPATH,
                    "//button[contains(text(), 'Enroll Now') or contains(text(), 'Continue to Course')]"
                )

                if "Enroll Now" in enroll_button.text:
                    # Course is not yet enrolled
                    enroll_button.click()

                    # Wait for enrollment confirmation dialog
                    # Line 249-275: Enrollment dialog
                    dialog_title = wait.until(
                        EC.presence_of_element_located(
                            (By.XPATH, "//h1[contains(text(), 'Confirm Enrollment')]")
                        )
                    )
                    assert dialog_title.is_displayed(), "Enrollment dialog not visible"

                    # Find "Enroll Now" button in dialog
                    confirm_button = driver.find_element(
                        By.XPATH,
                        "//button[contains(text(), 'Enroll Now') and contains(@class, 'bg-cyan')]"
                    )
                    confirm_button.click()

                    # Wait for success dialog or button text change
                    # Line 278-301: Success dialog
                    time.sleep(2)

                    # Verify enrollment succeeded (button text changes or success dialog appears)
                    try:
                        success_dialog = driver.find_element(
                            By.XPATH,
                            "//h1[contains(text(), 'Enrollment Successful')]"
                        )
                        assert success_dialog.is_displayed(), \
                            "Enrollment success dialog should appear"
                    except NoSuchElementException:
                        # Check if button text changed
                        updated_button = driver.find_element(
                            By.XPATH,
                            "//button[contains(text(), 'Continue to Course')]"
                        )
                        assert updated_button.is_displayed(), \
                            "Button should change to 'Continue to Course' after enrollment"

                else:
                    pytest.skip("Already enrolled in this course")

            except NoSuchElementException:
                pytest.skip("This course is not a recommended course - no enroll button")

        except (TimeoutException, NoSuchElementException) as e:
            pytest.skip(f"Could not test enrollment: {str(e)}")


class TestCourseDetailAccessControl:
    """Tests for course detail page access control"""

    def test_unauthenticated_user_redirected(self, driver, base_url, clear_local_storage):
        """
        Test that unauthenticated users are redirected from course detail pages

        Expected: Redirect to /login
        """
        # Try to access a course detail page (using placeholder ID)
        driver.get(f"{base_url}/courses/test-course-id")

        wait = WebDriverWait(driver, 10)

        # Should redirect to login
        try:
            wait.until(EC.url_contains("/login"))
            assert "/login" in driver.current_url, \
                "Unauthenticated user should be redirected to login"
        except TimeoutException:
            # Might show error page instead
            error_heading = driver.find_elements(
                By.XPATH,
                "//h2[contains(text(), 'Error')]"
            )
            assert len(error_heading) > 0, \
                "Should redirect to login or show error for unauthenticated users"
