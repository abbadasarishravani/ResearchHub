const express = require('express');
const Paper = require('../models/paper.model');
const router = express.Router();

// GET all papers
router.get('/', async (req, res) => {
  try {
    const papers = await Paper.find({});
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new paper
router.post('/', async (req, res) => {
  const { title, content, author } = req.body;
  
  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Please provide title, content and author' });
  }

  try {
    const newPaper = new Paper({ title, content, author });
    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET a single paper by ID
router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (update) a paper by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedPaper = await Paper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPaper) return res.status(404).json({ message: 'Paper not found' });
    res.json(updatedPaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a paper by ID
router.delete('/:id', async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
