export default function handler(request, response) {
  request.headers.append("X-MAL-CLIENT-ID", process.env.MAL_CLIENT_ID);
}