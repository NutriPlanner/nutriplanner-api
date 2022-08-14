/* eslint-disable security/detect-object-injection */
const allLicensees = {
    adv   : { name: 'Advanced', priority: 2 },
    pro   : { name: 'Pro', priority: 1 },
    basic : { name: 'Basic', priority: 0 },
}

const LICENSEE = {
    ADV   : 'adv',
    PRO   : 'pro',
    BASIC : 'basic',
}

const licensees = Object.keys(allLicensees)
const licenseeProps = new Map(Object.entries(allLicensees))

module.exports = {
    LICENSEE,
    licensees,
    licenseeProps,
}
