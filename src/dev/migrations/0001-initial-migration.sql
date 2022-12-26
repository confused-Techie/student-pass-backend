-- Create Students Table (This will need a review of the actual source data)

CREATE TABLE students (
  student_number REAL PRIMARY KEY,
  student_first_name VARCHAR(128) NOT NULL,
  student_last_name VARCHAR(128) NOT NULL,
  contact_number VARCHAR(128),
  contact_email VARCHAR(128)
);

-- Create Staff Table

CREATE TABLE staff (

);

-- Create District Table

CREATE TABLE district (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  settings JSONB
);

-- Create Schools Table

CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  district SERIAL NOT NULL REFERENCES district(id),
  settings JSONB
);

-- Create Events Table

CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  event_name VARCHAR(128) NOT NULL UNIQUE
);

-- Create Actions Table

CREATE TABLE actions (
  action_id SERIAL PRIMARY KEY,
  action_name VARCHAR(128),
  event_id SERIAL NOT NULL REFERENCES events(event_id)
);
