export function notFound(request, response) {
  response.status(404).json({
    error: 'Not Found',
    path: request.originalUrl
  });
}
