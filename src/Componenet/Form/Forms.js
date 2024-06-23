import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Button, TextField, Typography } from '@mui/material';
import './form.css'; // Import your custom CSS for additional styling

function Forms() {
  const [formData, setFormData] = useState({
    Name: '',
    phoneNo: '',
    email: '',
    dob: null,
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [mydata, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://663c7a9a17145c4d8c366435.mockapi.io/crud/dreamSol');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        dob: formData.dob ? formatDate(formData.dob) : null,
        uid: 'BTROUS452',
        UserType: 'User',
      };
      if (editId) {
        const response = await fetch(`https://663c7a9a17145c4d8c366435.mockapi.io/crud/dreamSol/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });
        const jsonData = await response.json();
        console.log('Record updated:', jsonData);
      } else {
        const response = await fetch('https://663c7a9a17145c4d8c366435.mockapi.io/crud/dreamSol', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });
        const jsonData = await response.json();
        console.log('New record created:', jsonData);
      }
      fetchData();
      setFormData({
        Name: '',
        phoneNo: '',
        email: '',
        dob: null,
      });
      setEditId(null);
    } catch (error) {
      console.error('Error creating/updating record:', error);
    }
  };

  const handleEdit = async (id, itemData) => {
    setEditId(id);
    setEditData(itemData);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://663c7a9a17145c4d8c366435.mockapi.io/crud/dreamSol/${id}`, {
        method: 'DELETE',
      });
      console.log('Record deleted:', id);
      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <Box sx={{ padding: '30px 300px', backgroundColor: '#0079ff40' }}>
      <Box sx={{ backgroundColor: 'white', padding: '20px' }}>
        <Typography variant='h5' gutterBottom>
          {editId ? 'Edit Form' : 'Add New Record'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant='h6'>Name</Typography>
          <TextField
            id="Name"
            label="Name"
            variant="outlined"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Typography variant='h6'>Phone No</Typography>
          <TextField
            id="phoneNo"
            label="Phone Number"
            variant="outlined"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Typography variant='h6'>Email</Typography>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <div className="date-picker-container" style={{ width: '600px' }}>
            <Typography variant='h6'>Date of Birth</Typography>
            <DatePicker
              selected={formData.dob ? new Date(formData.dob) : null}
              onChange={(date) => setFormData({ ...formData, dob: date })}
              placeholderText="Date of Birth"
              dateFormat="dd/MM/yyyy"
              className="date-picker-input"
              style={{ width: '680px' }} // Apply width directly to DatePicker component
            />
          </div>

          <Button variant='contained' type="submit" sx={{ marginTop: 2 }}>
            {editId ? 'Update' : 'Submit'}
          </Button>
        </form>

        <Typography variant='h5' mt={3}>Records</Typography>
        <ul>
          {mydata.map((item) => (
            <li key={item.id}>
              <Typography variant='subtitle1'>
                <strong>Name:</strong> {item.Name} <br />
                <strong>Phone No:</strong> {item.phoneNo} <br />
                <strong>Email:</strong> {item.email} <br />
                <strong>Date of Birth:</strong> {item.dob}<br />
              </Typography>
              <Button variant="outlined" onClick={() => handleEdit(item.id, item)} sx={{ marginRight: 1 }}>
                Edit
              </Button>
              <Button variant='outlined' onClick={() => handleDelete(item.id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}

export default Forms;
