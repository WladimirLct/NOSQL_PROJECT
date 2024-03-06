# Use an official Python runtime as a parent image
FROM python:3.10-slim

#Copy the current directory contents into the container at ./
COPY . ./

EXPOSE 5000

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install gunicorn
RUN pip install gunicorn

WORKDIR /server

# Run app.py when the container launches
# Specify the command to run your Flask application with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]
