async function getStudents() {
  const res = await fetch("http://localhost:3000/api/students");
  return res.json();
}

export default async function Students() {
  const students = await getStudents();

  return (
    <div>
      <h1>Danh sách học sinh</h1>
      <ul>
        {students.map((student: any) => (
          <li key={student.id}>
            {student.name} - {student.grade}
          </li>
        ))}
      </ul>
    </div>
  );
}