const Stringify = require('querystring').stringify

const $axios = require('./../services/axios.js')
const $fb = require('./../services/facebook')

/**
 * Turn on profile picture guard 
 */
exports.submit = function (req, res) {
  var { accessToken } = req.body
  const URL = 'https://graph.facebook.com/graphql'

  if (typeof accessToken === 'string' && accessToken.length > 0) {
    $fb.getUserInfo(accessToken, (err, user) => {
      if (err) {
        res.status(400).json({ 'error': 'SUBMIT_GUARD_001' })
      } else {
        var id = user.id
        var data = `variables={"0":{"is_shielded":true,"session_id":"9b78191c-84fd-4ab6-b0aa-19b39f04a6bc","actor_id":"${id}","client_mutation_id":"b0316dd6-3fd6-4beb-aed4-bb29c5dc64b0"}}&method=post&doc_id=1477043292367183&query_name=IsShieldedSetMutation&strip_defaults=true&strip_nulls=true&locale=en_US&client_country_code=US&fb_api_req_friendly_name=IsShieldedSetMutation&fb_api_caller_class=IsShieldedSetMutation`
        $axios.public.post(URL, data, {
          headers: {
            'Authorization': 'OAuth ' + accessToken
          }
        })
          .then((extraRes) => {
            if (extraRes.data && extraRes.data.errors) {
              res.status(400).json({ 'error': 'SUBMIT_GUARD_002' })
            } else {
              res.json(null)
            }
          })
          .catch((err) => {
            res.status(500).json({ 'error': '500_SUBMIT_GUARD_001' })
            console.log(err.message)
          })
      }
    })
  }
  else {
    res.status(400).json({ 'error': 'MISSING_DATA' })
  }
}