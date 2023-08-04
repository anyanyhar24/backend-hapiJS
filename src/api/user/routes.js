const routes = (handler, authorizationService) => [
  {
    method: 'POST',
    path: '/user',
    handler: handler.postUserHandler,
    options: {
      payload: {
        allow: ['application/json', 'multipart/form-data'],
        multipart: true,
        output: 'data'
      }
    }
  },
  {
    method: 'GET',
    path: '/user',
    handler: handler.getAllUserHandler
  },
  {
    method: 'GET',
    path: '/userPaginate',
    handler: handler.getAllUserByPaginateHandler
  },
  {
    method: 'GET',
    path: '/user/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'jwt_fruits_clasification'
    }
  },
  {
    method: 'PUT',
    path: '/user/{id}',
    handler: handler.putUserByIdHandler,
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
    path: '/user/{id}',
    handler: handler.deleteUserByIdHandler,
    options: {
      auth: 'jwt_fruits_clasification'
    }
  }
]

module.exports = routes
