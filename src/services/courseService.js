import axios from "axios";

export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:8080/api/courses",
    courseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
