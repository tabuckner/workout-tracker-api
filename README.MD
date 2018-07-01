# Workout Tracker REST API

Simple RESTful API for the Workout Tracker project.

## Description

Currently only a few routes, can be ran via Yarn/NPM or Docker. Data is hosted remotely, no need to worry about volumes or data persistence yet.

### NOTICE

Certain routes will now return a 'not authorized' error if you do not include a valid JWT token in an Authorization Header, (e.g. Bearer <JWT-Token>)

## Getting Started

### Dependencies

#### Docker

* Docker :)

#### Locally

* Yarn/NPM

### Installing

#### Docker

* Build the Image with a tag that makes sense (e.g. wtapi:test or wtapi:0.0.1)
```bash
docker build -t wtapi:test .
```
* Run the Image
```bash
docker run -d -p 3000:3000 wtapi:test
```
#### Locally via NPM or Yarn

* Install
```bash
<yarn/npm> install
```
* Start
```bash
<yarn/npm run> start
```
* Start in Dev Mode
```bash
<yarn/npm run> start:dev
```

## Help

1-800-COME-ON-NOW

## Authors

* **Taylor Buckner** - *Initial work* - [tabuckner](https://github.com/tabuckner)

## Version History

* 0.0.1
    * Initial Release

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
