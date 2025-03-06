import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Container } from "react-bootstrap";

const StudentForm = ({ fetchStudents }) => {
  const [student, setStudent] = useState({ name: "", age: "", email: "", phone: "" });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/students", student);
      Swal.fire("Success", "Student added successfully", "success");
      setStudent({ name: "", age: "", email: "", phone: "" });
      fetchStudents(); 
    } catch (error) {
      Swal.fire("Error", "Failed to add student", "error");
    }
  };

  return (
    <Container>
      <h3>Add New Member</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Student Name</Form.Label>
          <Form.Control type="text" name="name" value={student.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Student Age</Form.Label>
          <Form.Control type="number" name="age" value={student.age} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Student Email</Form.Label>
          <Form.Control type="email" name="email" value={student.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" name="phone" value={student.phone} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" className="mt-2">Submit</Button>
      </Form>
    </Container>
  );
};

export default StudentForm;
