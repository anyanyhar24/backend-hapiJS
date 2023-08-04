const routes = (handler) => [
  {
    method: 'POST',
    path: '/fruits',
    handler: handler.PostFruitsHandler,
    options: {
      auth: 'jwt_fruits_clasification',
      payload: {
        allow: ['application/json', 'multipart/form-data'],
        multipart: true,
        output: 'data'
      }
    }
  },
  {
    method: 'GET',
    path: '/fruits',
    handler: handler.getAllFruitsHandler,
    options: {
      auth: 'jwt_fruits_clasification'
    }
  },
  {
    method: 'GET',
    path: '/fruits/paginate',
    handler: handler.getAllFruitsWithPaginateHandler,
    options: {
      auth: 'jwt_fruits_clasification'
    }
  },
  {
    method: 'GET',
    path: '/fruits/{id}',
    handler: handler.getFruitsByIdHandler,
    options: {
      auth: 'jwt_fruits_clasification'
    }
  },
  {
    method: 'GET',
    path: '/fruits/name/{name}',
    handler: handler.getFruitsByNameHandler,
    options: {
      auth: 'jwt_fruits_clasification'
    }
  },
  {
    method: 'Put',
    path: '/fruits/{id}',
    handler: handler.PutFruitsHandler,
    options: {
      auth: 'jwt_fruits_clasification',
      payload: {
        allow: ['application/json', 'multipart/form-data'],
        multipart: true,
        output: 'data'
      }
    }
  },
  {
    method: 'DELETE',
    path: '/fruits/{id}',
    handler: handler.deleteFruitsByIdHandler,
    options: {
      auth: 'jwt_fruits_clasification'
    }
  }
]

module.exports = routes
