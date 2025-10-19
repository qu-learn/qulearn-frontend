import React from "react";
import { useNavigate } from "react-router-dom";
import { useEnrollInCourseMutation } from "../utils/api";

interface EnrollButtonProps {
  courseId: string;
  isLoggedIn: boolean;
  userRole?: string;
}

const CourseCatalogEnrollButton: React.FC<EnrollButtonProps> = ({ courseId, isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  const [enrollInCourse, { isLoading }] = useEnrollInCourseMutation();

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || userRole !== "student") {
      navigate("/register");
      return;
    }
    try {
      await enrollInCourse({ courseId }).unwrap();
      navigate(`/student/courses/${courseId}`);
    } catch (error) {
      // Optionally show error
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={isLoading}
      className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
    >
      {isLoggedIn && userRole === "student" ? (isLoading ? "Enrolling..." : "Enroll to the course") : "Enroll to the course"}
    </button>
  );
};

export default CourseCatalogEnrollButton;
