import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function unused() {

  async function fetchS3BucketData() {
    const response = await axios.get('http://localhost:5000/get-bucket-data');
    const data = response.data;

    console.log(data);
  }

  async function fetchFoundationModels() {
    const response = await axios.get('http://localhost:5000/list-FMs');
    const data = response.data;

    console.log(data);
  }

  async function invokeBedrock() {
    const response = await axios.get('http://localhost:5000/invoke-Bedrock-GenAI');
    const data = response.data;

    console.log(data['content'][0]['text']);
  }

  try {
    // fetchS3BucketData();
    // fetchFoundationModels();
    // invokeBedrock();
  } catch (error) {
    console.error('Error fetching data:', error);
  }



  return (
    <div className='override-bootstrap'>
      <div className="chat-container">
        <div className="title-bar">

        </div>
        <div className="main-content">
          
        </div>
      </div>
    </div>
  );
}

export default unused;

