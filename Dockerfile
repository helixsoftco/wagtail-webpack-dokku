# Use an official Python runtime based on Debian 10 "buster" as a parent image.
FROM python:3.8.1-slim-buster
ENV PYTHONUNBUFFERED=1

# Install system packages required by Wagtail and Django.
RUN apt-get update --yes --quiet && apt-get install --yes --quiet --no-install-recommends \
    build-essential \
    libpq-dev \
    libmariadbclient-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    libwebp-dev \
 && rm -rf /var/lib/apt/lists/*

RUN apt-get update

# For localizations
RUN apt-get install gettext -y

# Setup workdir
RUN mkdir /src
WORKDIR /src

# Python dependencies
COPY requirements.txt /src/
RUN pip install -r /src/requirements.txt

COPY . /src
