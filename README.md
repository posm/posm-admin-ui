# POSM Admin UI

This is the [POSM](http://posm.io) admin user interface.
It's intended for use with [posm-admin](https://github.com/posm/posm-admin) and [posm-auth](https://github.com/posm/posm-auth).

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Getting Started

### Setting up configuration

```bash
# Create an environment file
touch .env
```

The environment file should define these variables:

```sh
REACT_APP_POSM_AUTH_END_POINT=http://localhost:8050
```

### Running locally

```bash
yarn install
yarn start
```

You will also need to run [posm-auth](https://github.com/posm/posm-auth).

# Building

```bash
yarn build
```
