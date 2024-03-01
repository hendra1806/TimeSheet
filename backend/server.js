const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(bodyParser.json());
app.use(cors());

// GET all ActivityList gabung dengan Project
app.get('/activity-list', async (req, res) => {
  try {
    const { searchName, projectId } = req.query;
    let query = `
      SELECT al.id, al.activityName, al.projectId, al.startDate, al.endDate, al.startTime, al.endTime, p.Name AS projectName
      FROM ActivityList al
      LEFT JOIN Project p ON al.projectId = p.id`;

    const values = [];

    if (searchName) {
      query += ` WHERE al.activityName ILIKE $1`;
      values.push(`%${searchName}%`);
    }

    if (projectId) {
      query += `${searchName ? ' AND' : ' WHERE'} al.projectId = $${values.length + 1}`;
      values.push(projectId);
    }

    const result = await pool.query(query, values);
    
    const projectNameMap = {};
    const projectIds = result.rows.map(row => row.projectId);
    const projectResult = await pool.query('SELECT id, Name FROM Project WHERE id = ANY($1)', [projectIds]);
    projectResult.rows.forEach(row => {
      projectNameMap[row.id] = row.Name;
    });

    result.rows.forEach(row => {
      row.projectName = projectNameMap[row.projectId];
      delete row.projectId;
    });

    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// CREATE new ActivityList
app.post('/activity-list', async (req, res) => {
  try {
    const { activityName, projectId, startDate, endDate, startTime, endTime } = req.body;

    const query = `
      INSERT INTO ActivityList (activityName, projectId, startDate, endDate, startTime, endTime)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;

    const values = [activityName, projectId, startDate, endDate, startTime, endTime];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// UPDATE ActivityList
app.put('/activity-list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { activityName, projectId, startDate, endDate, startTime, endTime } = req.body;
    const query = `
      UPDATE ActivityList
      SET activityName = $2, projectId = $3, startDate = $4, endDate = $5, startTime = $6, endTime = $7
      WHERE id = $1
      RETURNING *`;

    const values = [id, activityName, projectId, startDate, endDate, startTime, endTime];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE ActivityList
app.delete('/activity-list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      DELETE FROM ActivityList
      WHERE id = $1`;

    await pool.query(query, [id]);
    res.json({ message: 'ActivityList deleted successfully' });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all Project
app.get('/projects', async (req, res) => {
  try {
    const query = `
      SELECT * FROM Project`;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CREATE new Project
app.post('/projects', async (req, res) => {
  try {
    const { name } = req.body;
    const query = `
      INSERT INTO Project (Name)
      VALUES ($1)
      RETURNING *`;

    const result = await pool.query(query, [name]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE Project
app.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      DELETE FROM Project
      WHERE id = $1`;

    await pool.query(query, [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
