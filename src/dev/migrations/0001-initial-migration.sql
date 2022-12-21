-- Create Students Table (This will need a review of the actual source data)

CREATE TABLE students (
  student_number REAL PRIMARY KEY,
  student_name VARCHAR(128) NOT NULL
);

-- Create Staff Table

CREATE TABLE staff (

);

-- Create District Table

CREATE TABLE district (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL
);

-- Create Schools Table

CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  district SERIAL NOT NULL REFERENCES district(id)
);

-- Create Events Table

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  actions VARCHAR(128)[]
);
