# Use an official Python runtime based on Debian 10 "buster" as a parent image.
FROM python:3.9-slim-bullseye

# Set environment variables.
# 1. Force Python stdout and stderr streams to be unbuffered.
ENV PYTHONUNBUFFERED=1

# Install system packages required by Wagtail and Django.
RUN apt-get update --yes --quiet && apt-get install --yes --quiet --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    libwebp-dev \
    gettext \
 && rm -rf /var/lib/apt/lists/*

# Add group:user that will be used in the container.
RUN groupadd --gid 2000 wagtail
RUN useradd --uid 2000 --gid wagtail --create-home wagtail

# Use /src folder as a directory where the source code is stored.
WORKDIR /src

# Set this directory to be owned by the "wagtail" user.
RUN chown wagtail:wagtail /src

# Python dependencies
COPY requirements.txt /src/
RUN pip install -r /src/requirements.txt

# Copy the source code of the project into the container.
COPY --chown=wagtail:wagtail . /src

# Use user "wagtail" to run the build commands and the server itself.
USER wagtail
