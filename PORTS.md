# Service Ports Configuration

## Updated Ports (Avoiding Conflicts)

Due to port conflicts on your system, the following ports have been adjusted:

### Infrastructure Services
- **PostgreSQL**: `5433` (instead of 5432)
- **Redis**: `6380` (instead of 6379)
- **Elasticsearch**: `9200` (standard)
- **MinIO**: `9000` (API) and `9001` (Console)

### Application Services
- **API**: `3000` (standard)
- **Public Portal**: `4000` (instead of 3001)
- **Admin Dashboard**: `4001` (instead of 3002)
- **Candidate Portal**: `4002` (instead of 3003)
- **Nginx**: `80` (HTTP) and `443` (HTTPS)

## Access URLs

- **Public Job Portal**: http://localhost:4000 or http://localhost/
- **Admin Dashboard**: http://localhost:4001 or http://localhost/admin
- **Candidate Portal**: http://localhost:4002 or http://localhost/candidate
- **API**: http://localhost:3000/api or http://localhost/api
- **MinIO Console**: http://localhost:9001
- **Elasticsearch**: http://localhost:9200

## Database Connection

If connecting from outside Docker:
- Host: `localhost`
- Port: `5433`
- Database: `cruise_recruitment`
- User: `cruise_user`
- Password: `cruise_password_change_in_prod`

## Redis Connection

If connecting from outside Docker:
- Host: `localhost`
- Port: `6380`

## Notes

- All services are accessible through Nginx reverse proxy on port 80
- Direct access to services is also available on their individual ports
- Update your `.env` files if you need to connect services from outside Docker

