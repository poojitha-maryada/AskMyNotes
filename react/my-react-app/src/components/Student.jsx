function Student({students}) {
  return (
    <div className="Student">
        {students.map((student)=> (
            <div
                key = {student.name}
                    style = {{
                        border: "2px solid  red",
                        margin: "10px",
                        padding: "10px",
                    }}
            >
                <h2>{student.name}</h2>
                <p>Course: {student.course}</p>
                <p>Year: {student.year}</p>
                <p>Skill: {student.skill}</p>
            </div>            
        ))}
    </div>
  );
}

export default Student;