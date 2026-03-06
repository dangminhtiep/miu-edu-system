import { mockStudents } from "@/lib/students/mock";

export default async function Students() {
  const students = mockStudents as Array<{
    id: number;
    name: string;
    grade: string;
  }>;

  return (
    <div>
      <h1>Danh sách học sinh</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - {student.grade}
          </li>
        ))}
      </ul>
    </div>
  );
}
