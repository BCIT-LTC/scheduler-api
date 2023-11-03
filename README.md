# OpenLab Scheduler Api

> This is the API and works as a backend for OpenLabs Scheduler WEB

OpenLab Scheduler is a web application designed to help BCIT's Nursing instructors communicate the calendar of the OpenLab to students. Students are also able to view announcements about the lab and take surveys that help instructors gain insights into students' learning.

## Required Technologies

- Node/Express
- Docker

## Running the Application

With Docker:

1. Ensure Docker is running on your local machine
1. In the root of the project, run `docker compose up`
1. This may take a long time, be patient

    - The database will be filled with one welcome announcement

1. Open `http://localhost:8000/api` to see the Rest endpoints

If you run into an error that says `"can't find file \r\n"`, go to the `docker-entrypoint.sh` file and change the End of Line sequence from `CRLF` to `LF` (in the bottom right)

