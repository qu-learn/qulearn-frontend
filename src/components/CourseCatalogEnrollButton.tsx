import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useEnrollInCourseMutation,
  useGetMyEnrollmentsQuery,
  useGetCourseByIdQuery,
} from "../utils/api";

interface EnrollButtonProps {
  courseId: string;
  isLoggedIn: boolean;
  userRole?: string;
  onEnrolled?: (courseId: string) => void;
}

const CourseCatalogEnrollButton: React.FC<EnrollButtonProps> = ({ courseId, isLoggedIn, userRole, onEnrolled }) => {
  const navigate = useNavigate();
  const [enrollInCourse, { isLoading }] = useEnrollInCourseMutation();

  // skip fetching enrollments when not logged in to avoid unnecessary requests
  const { data: enrollData } = useGetMyEnrollmentsQuery(undefined, { skip: !isLoggedIn });

  // fetch current course to read prerequisites
  const { data: courseData } = useGetCourseByIdQuery(courseId);

  const isEnrolled = !!enrollData?.enrollments?.some((e) => e.course?.id === courseId);

  // check prerequisites: if any prerequisite course is not completed (progress < 100) -> block enroll
  const prerequisites: string[] = courseData?.course?.prerequisites ?? [];

  let unmetPrereq: { id: string; title?: string; progress?: number } | null = null;
  if (isLoggedIn && prerequisites.length > 0) {
    for (const pid of prerequisites) {
      const enrollment = enrollData?.enrollments?.find((en) => en.course?.title === pid);
      if (!enrollment || (typeof enrollment.progressPercentage === "number" && enrollment.progressPercentage < 100)) {
        unmetPrereq = {
          id: pid,
          title: enrollment?.course?.title,
          progress: enrollment?.progressPercentage,
        };
        break;
      }
    }
  }

  // For future: Handle unmet prerequisites
  unmetPrereq = null;

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEnrolled) return;
    if (!isLoggedIn || userRole !== "student") {
      navigate("/register");
      return;
    }
    // if prerequisite unmet, do nothing (button is disabled already)
    if (unmetPrereq) return;

    try {
      await enrollInCourse({ courseId }).unwrap();
      if (onEnrolled) {
        onEnrolled(courseId);
      }
      navigate(`/courses/${courseId}/dashboard`);
    } catch (error) {
      // Optionally show error
    }
  };

  // show unmet prerequisites label and disable when there are unmet prerequisites
  const hasUnmetPrereq = !!unmetPrereq;
  const label = hasUnmetPrereq
    ? "Unmet Prerequisites"
    : isEnrolled
    ? "Enrolled"
    : isLoading
    ? "Enrolling..."
    : "Enroll to the course";

  const titleAttr = hasUnmetPrereq ? `Unmet prerequisite:` : undefined;

  return (
    <button
      onClick={handleEnroll}
      disabled={isLoading || isEnrolled || hasUnmetPrereq}
      title={titleAttr}
      className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
};

export default CourseCatalogEnrollButton;
