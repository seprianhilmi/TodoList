import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [kegiatan, setKegiatan] = useState("");
  const [listKegiatan, setListKegiatan] = useState([]);

  // Function to fetch initial data from the server when the component mounts
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kegiatan');
      setListKegiatan(response.data); // Assuming the response data is an array of kegiatan
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const handleInput = (e) => {
    setKegiatan(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/kegiatan', { nama: kegiatan });
      setKegiatan("");
      // Refetch data after adding new kegiatan
      fetchData();
    } catch (error) {
      console.error('Error adding kegiatan:', error);
    }
  };

  const deleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/kegiatan/${id}`);
      // Remove the deleted kegiatan from the list
      const updatedList = listKegiatan.filter(item => item._id !== id);
      setListKegiatan(updatedList);
    } catch (error) {
      console.error('Error deleting kegiatan:', error);
    }
  };

  return (
    <div className='m-5'>
      {/* JUDUL */}
      <div className='p-2 text-semibold text-5xl font-serif bg-blue-200 rounded-lg text-center'> To Do List</div>
     
      {/* FORM */}
      <div className='mt-2 flex'>
        <form className='p-2 mx-auto'>
          <input 
            type='text' 
            className='border-2 border-black rounded-lg p-1 w-[300px]' 
            placeholder='Input Kegiatan'
            value={kegiatan}
            onChange={handleInput} 
          />
          <button 
            className='bg-blue-200 text-semibold rounded-lg p-1 ml-2'
            onClick={handleSubmit}
          >Add Task</button>
        </form>
      </div>

      {/* List */}
      <div className='mt-2'>
        {listKegiatan.map((kegiatan, index) => (
          <div key={kegiatan._id} className='p-2 bg-blue-200 rounded-lg border-2 border-black mb-2'>
            <div className='flex justify-between'>
              <div className='text-semibold p-1 text-xl'>{kegiatan.nama}</div>
              <button 
                className='bg-red-200 rounded-lg p-1 border-2 border-black w-[100px] hover:bg-green-200 hover:font-semibold'
                onClick={() => deleteClick(kegiatan._id)}
              >Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
