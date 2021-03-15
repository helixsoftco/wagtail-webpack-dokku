# Use an official Python runtime based on Debian 10 "buster" as a parent image.
# Info: as of March 2021 python:3.8.1-slim-buster doesn't work because it skips istalling nodejs and npm from nodesource (See: https://github.com/nodejs/help/issues/554)
FROM python:3.8.1
ENV PYTHONUNBUFFERED=1

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

# Nodejs plus npm is required for webpack (to generate bundles)
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update && apt-get install nodejs -y

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
