/* eslint-disable security/detect-non-literal-fs-filename */
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const config = require('../config/config')

const createTransporter = async () => {
    const oAuth2Client = new google.auth.OAuth2(
        config.email.oauth.clientId,
        config.email.oauth.clientSecret,
        config.email.oauth.redirectUrl,
    )
    oAuth2Client.setCredentials( { refresh_token: config.email.oauth.refreshToken } )

    const accessToken = await new Promise( (resolve, reject) => {
        oAuth2Client.getAccessToken( (err, token) => {
            if (err) reject()
            resolve(token)
        } )
    } )

    const transporter = nodemailer.createTransport( {
        service : 'gmail',
        auth    : {
            type         : 'OAuth2',
            user         : config.email.oauth.user,
            accessToken,
            clientId     : config.email.oauth.clientId,
            clientSecret : config.email.oauth.clientSecret,
            refreshToken : config.email.oauth.refreshToken,
        },
    } )

    return transporter
}

const sendMail = async (options) => {
    const emailOptions = _.cloneDeep(options)
    const emailTransporter = await createTransporter()

    let htmlToSend = emailOptions.html || emailOptions.text || ''
    if (!emailOptions.html && emailOptions.template) {
        const templatesPath = path.join(process.cwd(), '/src/templates/', emailOptions.template, '.hbs')
        const emailTemplateSource = fs.readFileSync(templatesPath, 'utf8')
        const template = handlebars.compile(emailTemplateSource)
        htmlToSend = template(emailOptions.context || {} )

        delete emailOptions.template
        delete emailOptions.context
    }

    await emailTransporter.sendMail( {
        from : `"no-reply" <${config.email.oauth.user}>`,
        ...emailOptions,
        html : htmlToSend,
    } )
}

module.exports = {
    sendMail,
}
