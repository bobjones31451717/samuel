const { param } = require('./externalRoutes');

module.exports = (function() {

    'use strict';
    const bodyParser = require('body-parser')
    const express = require("express");
    const middlewares = require('express').Router();

    middlewares.use(bodyParser.json());
    middlewares.use(express.urlencoded({extended: true}))

    return middlewares;
})();