import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editUser } from '../Redux/auth/thunks';
import { useNavigate } from 'react-router';

const EditProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    image: user?.image || '',
  });
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (formdata) => {
    return new Promise( async (resolve, reject) => {
      try{
        const {data} = await axios.post(`/blogs/upload`, formdata, {
          headers: {
              "Content-Type" : 'muiltipart/form-data',
          }
        });
        resolve(data.imageUrl);
      }catch(err){
        reject(err.response?.data.error || err.message)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("image", image);
    const token = localStorage.getItem("userToken");
    try{ 
      let imageUrl;
      if(image){
        imageUrl = await handleUpload(formdata);
      }else{
        imageUrl = formData.image
      }

      const changes = {
        ...formData,
        image: imageUrl
      };
      dispatch(editUser(token, changes)).then(() => navigate(`/profile/${user._id}`));
    }catch(err){

    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Add Bio"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Profile Image URL</label>
          <div>
            <img src={formData.image || "https://via.placeholder.com/50"} alt="user" />
            <input type="file" onChange={handleFileChange} />
          </div>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
