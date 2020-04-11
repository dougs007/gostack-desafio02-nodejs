const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs: techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if (findRepositoryIndex === -1) {
    return response
      .status(400)
      .json({ error: 'Sorry, Repository does not found.' });
  }

  const updRepository = {
    id,
    url,
    title,
    techs: techs,
    likes: repositories[findRepositoryIndex].likes
  };

  repositories[findRepositoryIndex] = updRepository;

  return response.json(updRepository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if (findRepositoryIndex >= 0) {
    repositories.splice(findRepositoryIndex, 1);
  } else {
    return response
      .status(400)
      .json({ error: 'Sorry, Repository does not found.' });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepository = repositories.find(repository =>
    repository.id === id
  );

  if (!findRepository) {
    return response
      .status(400)
      .json({ error: 'Sorry, Repository does not found.' });
  }

  findRepository.likes += 1;
  return response.json(findRepository);
});

module.exports = app;
