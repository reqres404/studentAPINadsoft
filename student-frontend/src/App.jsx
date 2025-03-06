import { useState, useEffect } from "react";
import { Modal, Button, Table, Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const App = () => {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", age: "", phone: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const studentsPerPage = 10; // Same as backend

    // Fetch students
    useEffect(() => {
        fetchStudents(currentPage);
    }, [currentPage]);

    const fetchStudents = async (page) => {
        try {
            const response = await fetch(`http://localhost:5000/students?page=${page}&limit=${studentsPerPage}`);
            const data = await response.json();
            if (response.ok) {
                setStudents(data.students);
                setTotalPages(data.totalPages);
            } else {
                throw new Error("Failed to fetch students.");
            }
        } catch (error) {
            Swal.fire("Error!", error.message, "error");
        }
    };

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit (ADD STUDENT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                Swal.fire("Success!", "Student added successfully!", "success");
                fetchStudents(currentPage);
                setShowModal(false);
                setFormData({ name: "", email: "", age: "", phone: "" });
            } else {
                Swal.fire("Error!", data.error || "Failed to add student.", "error");
            }
        } catch (error) {
            Swal.fire("Error!", "Something went wrong.", "error");
        }
    };

    // Handle student delete
    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/students/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    Swal.fire("Deleted!", "Student has been deleted.", "success");
                    fetchStudents(currentPage);
                } else {
                    Swal.fire("Error!", "Failed to delete student.", "error");
                }
            } catch (error) {
                Swal.fire("Error!", "Something went wrong.", "error");
            }
        }
    };

    // Pagination Handling
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="container">
            <h2 className="my-4 text-center">All Students</h2>
            <Button variant="success" onClick={() => setShowModal(true)} className="mb-3">Add New Student</Button>
            
            {/* Student Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index + 1 + (currentPage - 1) * studentsPerPage}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.age}</td>
                                <td>{student.phone}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(student.id)}>🗑</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No students found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>

            {/* Add Student Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Name</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label>Age</label>
                            <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label>Phone</label>
                            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <Button variant="success" type="submit">Submit</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default App;
