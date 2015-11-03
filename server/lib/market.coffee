request = require 'request-json'
Client = request.JsonClient
log = require('printit')
    prefix: 'market'
exec = require('child_process').exec
fs = require 'fs'
del = require 'del'
url = require 'url'
apps = {}
isDownloading = false

# sort the applications list by official/community status, then by name
comparator = (a, b) ->
    if a.comment is 'official application' \
    and b.comment isnt 'official application'
        return -1
    else if a.comment isnt 'official application' \
    and b.comment is 'official application'
        return 1
    else if a.name > b.name
        return 1
    else if a.name < b.name
        return -1
    else
        return 0

download = module.exports.download = (callback) ->

    isDownloading = true

    # Retrieve market path
    if process.env.MARKET?
        # Use a specific market
        path = process.env.MARKET
    else
        # Use default market
        path = "https://registry.cozycloud.cc/cozy-registry.json"

    version = 0
    if fs.existsSync './market.json'
        data = fs.readFileSync './market.json', 'utf8'
        oldMarket = JSON.parse(data)
        version = oldMarket.version
    path = path + "?version=#{version}"
    path = url.parse path
    client = new Client "#{path.protocol}//#{path.host}"
    client.headers['user-agent'] = 'cozy'
    client.get path.pathname, (err, res, body) ->
        if not err and body.apps_list?
            apps = body.apps_list
            fs.writeFileSync './market.json', JSON.stringify(body)
        else if oldMarket?
            apps = oldMarket.apps_list
        else
            apps = null
        callback err, apps


getApps = module.exports.getApps = (cb) ->
    if Object.keys(apps).length > 0
        cb null, apps
    else if fs.existsSync './market.json'
        data = fs.readFileSync './market.json', 'utf8'
        market = JSON.parse(data)
        cb null, market.apps_list
    else
        if isDownloading
            setTimeout () ->
                getApps cb
            , 1000
        else
            download cb

module.exports.getApp = (app) ->
    if apps.app?
        return [null, apps[app]]
    else
        return ['not found', null]
