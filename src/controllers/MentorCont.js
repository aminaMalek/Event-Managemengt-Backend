const Mentor = require('../models/Mentor');
const { generatePasswordHash } = require('./utils/passwordUtils');

// Controller function to create a new mentor
const addMentor = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        
        const hashedPassword = await generatePasswordHash(password);

        
        const newMentor = new Mentor({
            username,
            email,
            password: hashedPassword
        });

        // Save the new mentor to the database
        const savedMentor = await newMentor.save();

        res.status(201).json(savedMentor);
    } catch (error) {
        console.error('Error creating mentor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to retrieve mentor information
const getMentorById = async (req, res) => {
    try {
        const mentorId = req.params.id;

        // Find the mentor by ID in the database
        const mentor = await Mentor.findById(mentorId);

        res.json(mentor);
    } catch (error) {
        console.error('Error retrieving mentor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to update mentor profile
const updateMentorProfile = async (req, res) => {
    try {
        const mentorId = req.params.id;
        const { username, email, newPassword } = req.body;

        // Hash the new password if provided
        let hashedPassword;
        if (newPassword) {
            hashedPassword = await generatePasswordHash(newPassword);
        }

        // Update mentor profile in the database
        const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, {
            username,
            email,
            password: hashedPassword // Update password if provided
        }, { new: true });

        res.json(updatedMentor);
    } catch (error) {
        console.error('Error updating mentor profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to delete mentor
const deleteMentor = async (req, res) => {
    try {
        const mentorId = req.params.id;

        // Delete mentor from the database
        await Mentor.findByIdAndDelete(mentorId);

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting mentor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const MentorLogin = async (req, res) => {
    const { email, password } = req.body; // Assuming email and password are sent in the request body
  
    try {
      // Find the user by email
      const user = await Mentor.findOne({ email });
  
      // If user not found, return error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the password matches
      const isPasswordValid = await user.comparePassword(password);
  
      // If password is invalid, return error
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // If email and password are correct, login successful
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = {
    addMentor,
    getMentorById,
    updateMentorProfile,
    deleteMentor ,
    MentorLogin
};