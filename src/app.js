const cors = require("cors");
const express = require("express");
const { uuid } = require("uuidv4");

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];
const uuidValidator = require("./middlewares/uuidValidator");
const respositoryValidator = require("./middlewares/createRespositoryValidator");
const updatedRepositoryValidator = require("./middlewares/updateRespositoryValidator");

function repositoryFactory(params, isNew) {
  const { id, title, url, techs, likes } = params;
  return {
    id: isNew ? uuid() : id,
    title,
    url,
    techs: techs,
    likes: isNew || !likes ? 0 : likes,
  };
}

function findRepositoryIndex(id) {
  return repositories.findIndex((repository) => repository.id === id);
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", respositoryValidator, (request, response) => {
  const repository = repositoryFactory(request.body, true);

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put(
  "/repositories/:id",
  updatedRepositoryValidator,
  (request, response) => {
    const { id } = request.params;
    const index = findRepositoryIndex(id);

    if (index < 0) {
      return response.status(400).json({ message: "not found" });
    }

    const { title, url, techs } = repositoryFactory(request.body);

    repositories[index].title = title;
    repositories[index].url = url;
    repositories[index].techs = techs;

    return response.status(200).json(repositories[index]);
  }
);

app.delete("/repositories/:id", uuidValidator, (request, response) => {
  const { id } = request.params;

  const index = findRepositoryIndex(id);

  if (index < 0) {
    return response.status(400).json({ message: "not found" });
  }

  repositories.splice(index, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", uuidValidator, (request, response) => {
  const { id } = request.params;

  const index = findRepositoryIndex(id);

  if (index < 0) {
    return response.status(404).json({ message: "not found" });
  }

  repositories[index].likes += 1;

  return response.status(200).json(repositories[index]);
});

module.exports = app;
