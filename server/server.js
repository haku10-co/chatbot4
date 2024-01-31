import express from 'express';
import { run } from './OpenAI.js';
import cors from 'cors';

const app = express();
const port = 5005;

app.use(cors()); // Add this line

app.use(express.json());

app.post('/api/run', async (req, res) => {
  const initialInput = req.body.initialInput;
  const generator = run(initialInput);

  for await (const response of generator) {
    res.json({ response });
  }
});

app.listen(port, () => {
  console.log(`Node.js server is running at http://localhost:${port}`);
});