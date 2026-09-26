let students = [
  {
    id: 1,
    name: "Juan Pérez",
    grade: 20,
    age: 23,
    email: "juan.perez@ejemplo.com",
    phone: "+51 987654321",
    enrollmentNumber: "2025001",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Algoritmos", "Bases de Datos", "Redes"],
    gpa: 3.8,
    status: "Activo",
    admissionDate: "2022-03-01"
  },
  {
    id: 2,
    name: "María López",
    grade: 14,
    age: 21,
    email: "maria.lopez@ejemplo.com",
    phone: "+51 912345678",
    enrollmentNumber: "2025002",
    course: "Diseño y Desarrollo de Software C24",
    year: 2,
    subjects: ["Algoritmos", "Programación Web"],
    gpa: 3.2,
    status: "Activo",
    admissionDate: "2023-03-01"
  },
  {
    id: 3,
    name: "Carlos Ramírez",
    grade: 17,
    age: 24,
    email: "carlos.ramirez@ejemplo.com",
    phone: "+51 998877665",
    enrollmentNumber: "2025003",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Bases de Datos", "Redes", "Testing"],
    gpa: 3.6,
    status: "Inactivo",
    admissionDate: "2022-03-01"
  },
  {
    id: 4,
    name: "Lucía Torres",
    grade: 9,
    age: 20,
    email: "lucia.torres@ejemplo.com",
    phone: "+51 965432109",
    enrollmentNumber: "2025004",
    course: "Diseño y Desarrollo de Software C24",
    year: 1,
    subjects: ["Algoritmos"],
    gpa: 2.5,
    status: "Activo",
    admissionDate: "2024-03-01"
  },
  {
    id: 5,
    name: "Steven Saldaña",
    grade: 100,
    age: 22,
    email: "steven.saldana@ejemplo.com",
    phone: "+51 999888777",
    enrollmentNumber: "2025005",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Algoritmos", "Bases de Datos", "Redes", "Testing"],
    gpa: 4.0,
    status: "Activo",
    admissionDate: "2022-03-01"
  },
  {
    id: 6,
    name: "Fiorella Quispe",
    grade: 16,
    age: 20,
    email: "fiorella.quispe@ejemplo.com",
    phone: "+51 934567123",
    enrollmentNumber: "2025006",
    course: "Diseño y Desarrollo de Software C24",
    year: 2,
    subjects: ["Programación Web", "Bases de Datos"],
    gpa: 3.4,
    status: "Activo",
    admissionDate: "2023-08-01"
  },
  {
    id: 7,
    name: "Jhonatan Huamán",
    grade: 11,
    age: 25,
    email: "jhonatan.huaman@ejemplo.com",
    phone: "+51 945612378",
    enrollmentNumber: "2025007",
    course: "Diseño y Desarrollo de Software C24",
    year: 4,
    subjects: ["Redes", "Testing"],
    gpa: 2.9,
    status: "Inactivo",
    admissionDate: "2021-03-01"
  },
  {
    id: 8,
    name: "Rosa Mamani",
    grade: 19,
    age: 22,
    email: "rosa.mamani@ejemplo.com",
    phone: "+51 956781234",
    enrollmentNumber: "2025008",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Algoritmos", "Testing"],
    gpa: 3.9,
    status: "Activo",
    admissionDate: "2022-08-01"
  },
  {
    id: 9,
    name: "Anderson Ccahuana",
    grade: 13,
    age: 21,
    email: "anderson.ccahuana@ejemplo.com",
    phone: "+51 923456789",
    enrollmentNumber: "2025009",
    course: "Diseño y Desarrollo de Software C24",
    year: 2,
    subjects: ["Programación Web"],
    gpa: 3.0,
    status: "Activo",
    admissionDate: "2023-03-01"
  }
];

function getAll() {
  return students;
}

function getById(id) {
  return students.find(s => s.id === id);
}

function create(student) {
  student.id = students.length > 0 ? students[students.length - 1].id + 1 : 1;
  students.push(student);
  return student;
}

function update(id, updateData) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updateData };
    return students[index];
  }
  return null;
}

function remove(id) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    return students.splice(index, 1)[0];
  }
  return null;
}

function listByStatus(status) {
  return students.filter(s => s.status === status);
}

function listByGrade(exactGrade) {
  return students.filter(s => s.grade === exactGrade);
}

module.exports = { getAll, getById, create, update, remove, listByStatus, listByGrade };