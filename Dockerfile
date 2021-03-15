# Use an official Python runtime based on Debian 10 "buster" as a parent image.
FROM python:3.8.1-slim-buster
ENV PYTHONUNBUFFERED=1

# For node
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

# Install system packages required by Wagtail and Django.
RUN apt-get update --yes --quiet && apt-get install --yes --quiet --no-install-recommends \
    build-essential \
    libpq-dev \
    libmariadbclient-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    libwebp-dev \
    gettext \
 && rm -rf /var/lib/apt/lists/*

# For webpack (to generate bundles)
RUN apt-get install nodejs -y

# Setup workdir
RUN mkdir /src
WORKDIR /src

# JS dependencies
COPY package.json /src/
RUN npm install

# Python dependencies
COPY requirements.txt /src/
RUN pip install -r /src/requirements.txt

COPY . /src
