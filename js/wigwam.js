
/**
 * Wigwam web framework runtime JS.
 *
 * Fork me on github: https://github.com/micha/wigwam
 */
(function($) {

  var api   = [{"name":"NiM\\API\\Order","methods":{
              "1":{"name":"clientInfo","tags":{"role":[[{"name":"loggedIn","args":[]}]],"verb":[[{"name":"get","args":[]}]]},"params":[{"name":"promo","optional":false},{"name":"dataTracking","optional":true}],"verb":"get","route":"/NiM/API/Order/clientInfo"},
              "2":{"name":"loginOrder","tags":{"role":[[{"name":"require","args":["email"]},{"name":"getLock","args":["email"]},{"name":"doLogin","args":["email","passwd","brand"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"email","optional":false},{"name":"passwd","optional":false},{"name":"brand","optional":false},{"name":"promo","optional":false}],"verb":"post","route":"/NiM/API/Order/loginOrder"},
              "3":{"name":"personalInfo","tags":{"role":[[{"name":"allow","args":[]},{"name":"","args":[]}],[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]},{"name":"ownOrder","args":["clientID","orderID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"brand","optional":false},{"name":"clientID","optional":false},{"name":"orderID","optional":false},{"name":"email","optional":false},{"name":"first","optional":false},{"name":"last","optional":false},{"name":"gender","optional":false},{"name":"phone","optional":false}],"verb":"post","route":"/NiM/API/Order/personalInfo"},
              "4":{"name":"accountSetup","tags":{"role":[[{"name":"require","args":["email"]},
                    {"name":"getLock","args":["email"]},
                    {"name":"doRegister","args":["email","passwd","agreeterms","brand","first","last","phone","gender"]}
                  ]],
              "verb":[[{"name":"post","args":[]}]]},
              "params":[{"name":"brand","optional":false},{"name":"email","optional":false},{"name":"first","optional":false},{"name":"last","optional":false},{"name":"gender","optional":false},
                {"name":"phone","optional":false},{"name":"passwd","optional":false},{"name":"zip","optional":false},{"name":"agreeterms","optional":false},{"name":"promo","optional":false}
              ],
              "verb":"post","route":"/NiM/API/Order/accountSetup"},
              "5":{"name":"replaceOrder","tags":{"role":[[{"name":"allow","args":[]},{"name":"","args":[]}],[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"promo","optional":false},{"name":"restrict","optional":true,"default":false}],"verb":"post","route":"/NiM/API/Order/replaceOrder"},"6":{"name":"cancelOrder","tags":{"role":[[{"name":"allow","args":[]},{"name":"","args":[]}],[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false}],"verb":"post","route":"/NiM/API/Order/cancelOrder"},"7":{"name":"shippingAddressExt","tags":{"role":[[{"name":"allow","args":[]},{"name":"","args":[]}],[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]},{"name":"ownOrder","args":["clientID","orderID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"orderID","optional":false},{"name":"promo","optional":false},{"name":"address1","optional":false},{"name":"address2","optional":false},{"name":"city","optional":false},{"name":"state","optional":false},{"name":"zip","optional":false},{"name":"promote","optional":false},{"name":"deliverynotes","optional":false}],"verb":"post","route":"/NiM/API/Order/shippingAddressExt"},"8":{"name":"shippingAddress","tags":{"role":[[{"name":"allow","args":[]},{"name":"","args":[]}],[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]},{"name":"ownOrder","args":["clientID","orderID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"orderID","optional":false},{"name":"promo","optional":false},{"name":"address1","optional":false},{"name":"address2","optional":false},{"name":"city","optional":false},{"name":"state","optional":false},{"name":"zip","optional":false},{"name":"promote","optional":false},{"name":"deliverynotes","optional":false}],"verb":"post","route":"/NiM/API/Order/shippingAddress"},"9":{"name":"billingInfo","tags":{"role":[[{"name":"allow","args":[]},{"name":"","args":[]}],[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]},{"name":"ownOrder","args":["clientID","orderID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"orderID","optional":false},{"name":"existing","optional":false},{"name":"clientID","optional":false},{"name":"address1","optional":false},{"name":"address2","optional":false},{"name":"city","optional":false},{"name":"state","optional":false},{"name":"zip","optional":false},{"name":"ccName","optional":false},{"name":"ccNum","optional":false},{"name":"ccExpM","optional":false},{"name":"ccExpY","optional":false},{"name":"ccCVV","optional":false},{"name":"startDate","optional":false}],"verb":"post","route":"/NiM/API/Order/billingInfo"}}},{"name":"NiM\\API\\Member","methods":{"1":{"name":"clientInfo","tags":{"role":[[{"name":"loggedIn","args":[]}]],"verb":[[{"name":"get","args":[]}]]},"params":[],"verb":"get","route":"/NiM/API/Member/clientInfo"},"2":{"name":"clientMenu","tags":{"role":[[{"name":"self","args":["clientID"]}]],"verb":[[{"name":"get","args":[]}]]},"params":[{"name":"clientID","optional":false}],"verb":"get","route":"/NiM/API/Member/clientMenu"},"3":{"name":"login","tags":{"role":[[{"name":"require","args":["email","passwd"]},{"name":"doLogin","args":["email","passwd","brand"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"email","optional":false},{"name":"passwd","optional":false},{"name":"brand","optional":false}],"verb":"post","route":"/NiM/API/Member/login"},"4":{"name":"logout","tags":{"role":[[{"name":"doLogout","args":[]}]],"verb":[[{"name":"post","args":[]}]]},"params":[],"verb":"post","route":"/NiM/API/Member/logout"},"5":{"name":"forgotPassword","tags":{"role":[[{"name":"allow","args":[]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"email","optional":false},{"name":"brand","optional":true,"default":3}],"verb":"post","route":"/NiM/API/Member/forgotPassword"},"6":{"name":"chooseMeal","tags":{"role":[[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"cycleID","optional":false},{"name":"sqldate","optional":false},{"name":"mealcat","optional":false},{"name":"mealID","optional":false}],"verb":"post","route":"/NiM/API/Member/chooseMeal"},"7":{"name":"updateBilling","tags":{"role":[[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"address1","optional":false},{"name":"address2","optional":false},{"name":"city","optional":false},{"name":"state","optional":false},{"name":"zip","optional":false},{"name":"ccName","optional":false},{"name":"ccNum","optional":false},{"name":"ccExpM","optional":false},{"name":"ccExpY","optional":false},{"name":"ccCVV","optional":false}],"verb":"post","route":"/NiM/API/Member/updateBilling"},"8":{"name":"updateEmail","tags":{"role":[[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]},{"name":"password","args":["clientID","passwd"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"passwd","optional":false},{"name":"email","optional":false},{"name":"email2","optional":false}],"verb":"post","route":"/NiM/API/Member/updateEmail"},"9":{"name":"updatePassword","tags":{"role":[[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]},{"name":"password","args":["clientID","passwd"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"passwd","optional":false},{"name":"newpasswd","optional":false},{"name":"newpasswd2","optional":false}],"verb":"post","route":"/NiM/API/Member/updatePassword"},"10":{"name":"updatePromote","tags":{"role":[[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"promote","optional":false}],"verb":"post","route":"/NiM/API/Member/updatePromote"},"11":{"name":"contactUs","tags":{"role":[[{"name":"getLock","args":["clientID"]},{"name":"self","args":["clientID"]},{"name":"require","args":["message"]}]],"verb":[[{"name":"post","args":[]}]]},"params":[{"name":"clientID","optional":false},{"name":"message","optional":false}],"verb":"post","route":"/NiM/API/Member/contactUs"}}}];
  var base  = "/order/rpc";
  var mode  = "development";

  function nestedObj(a, b, c) {
    var x = c,
        k = a.pop();
    $.each(a, function(i,v) {
      if (!x[v]) x[v] = {};
      x = x[v];
    });
    x[k] = b;
  };

  function getConf() {
    var ret={},query,i,pair;

    query = $('script')
      .last()
      .attr('src')
      .replace(/^[^\?]*\??/, '')
      .split('&');

    $.each(query, function(i,v) {
      pair = query[i].split('=');
      ret[decodeURIComponent(pair.shift())] =decodeURIComponent(pair.pop());
    });

    ret.base = base;
    ret.argv = getArgv();
    ret.api  = api;
    ret.mode = mode;

    return ret;
  }

  function getArgv() {
    var q={};
    
    $.each(
      window.location.search.replace(/^\?/,'').split('&'),
      function(i,v) {
        var p=v.split('=');
        q[decodeURIComponent(p[0])]=decodeURIComponent(p[1]);
      }
    );

    return q;
  }

  function makeApi(api) {
    $.each(api, function(i, app) {
      var base = app.name.split('\\');
      $.each(app.methods, function(i, method) {
        var doAsync, doSync;

        doAsync = function() {
          var argv=Array.prototype.slice.call(arguments), 
              data={}, ret;

          $.each(method.params, function(i,v) {
            data[v.name] = (argv.length == 1 && $.type(argv[0]) == "object")
              ? argv[0][v.name]
              : argv[i];
          });

          return function(success, error, complete, sync) {
            return Wigwam.ajax(
              method.verb,
              method.route,
              data,
              success,
              error,
              complete,
              !sync
            );
          };
        };

        doSync = function() {
          var argv=Array.prototype.slice.call(arguments), 
              ret, ex;

          doAsync.apply(window, argv)(
            function(data) { ret = data },
            function(err) { ex = err },
            function() {},
            true
          );

          if (ex) throw ex;
          return ret;
        };

        nestedObj(base.concat([method.name]), doAsync, window);
        nestedObj(base.concat([method.name]), doSync, window.Wigwam.sync);
      });
    });
  }

  function makeErrClass(proto, type) {
    var F = function(data) { $.extend(this, data); this.type = type };
    F.prototype = new proto();
    return F;
  }

  window.Wigwam = {
    data: {},

    csrfToken: 0,
    badCSRFCount: 0,

    cfg: getConf(),

    ajax: function(method, url, data, callback, errcallback, complete, async) {
      var argv = Array.prototype.slice.call(arguments), process, opt;
  
      if ((method = method.toUpperCase()) == 'GET' || method == 'POST')
        process = true;
      else
        data = JSON.stringify(data);
      
      opts = {
        async:        async,
        type:         method,
        processData:  process,
        dataType:     'json',
        url:          Wigwam.cfg.base+url,
        data:         data,
        accepts: {
          json: 'application/json'
        },
        headers: {
          'X-CSRFToken': Wigwam.csrfToken
        },
        success: function(data, textStatus, xhr) {
          Wigwam.csrfToken = xhr.getResponseHeader('X-CSRFToken');
          if ($.isFunction(callback))
            callback(data);
        },
        error: function(xhr,stat,err) {
          var body, token, e;
          try {
            body  = JSON.parse(xhr.responseText),
            token = body ? body.token : '',
            e     = (body && body.exception)
                      ? eval(body.exception.replace(/\\/, '.')) 
                      : undefined;
            Wigwam.csrfToken = xhr.getResponseHeader('X-CSRFToken');
          } catch (err) {
            body  = {exception: "Wigwam\\ServerException",
                     type:      "Wigwam.ServerException",
                     message:   "There was an error communicating with the " +
                                "server. Please try again."};
            e     = Wigwam.ServerException;
          }
          e = e ? new e(body) : new Error(err);
          if (e instanceof Wigwam.BadCSRFToken && ++Wigwam.badCSRFCount < 2) {
            Wigwam.csrfToken = body.token;          
            Wigwam.ajax.apply(window, argv);
          } else if ($.isFunction(errcallback)) {
            errcallback(e);
          }
        },
        complete: complete
      };

      if (!process)
        opts.contentType = 'application/json';

      return $.ajax(opts);
    },

    onError: function() {
      var argv=Array.prototype.slice.call(arguments), 
          dmsg="An error occurred. Please try again. Please call\n"
            +"customer service if this problem persists.";
      return function(err) {
        var x, msg;
        while (x = argv.shift()) {
          if ($.type(x) === 'string')
            dmsg = x;
          else if (err instanceof x)
            return alert($.type(msg = argv.shift()) === 'string' ? msg : err.message);
        }
        alert(dmsg);
      };
    },

    async: function(proc, success, error, finaly) {
      return proc(success, error, finaly);
    },

    sync: {}

  };

  Wigwam.Exception       = makeErrClass(Error, 'Wigwam.Exception');
  Wigwam.BadArgument     = makeErrClass(Wigwam.Exception, 'Wigwam.BadArgument');
  Wigwam.NotAllowed      = makeErrClass(Wigwam.Exception, 'Wigwam.NotAllowed');
  Wigwam.BadCredentials  = makeErrClass(Wigwam.NotAllowed, 'Wigwam.BadCredentials');
  Wigwam.BadCSRFToken    = makeErrClass(Wigwam.NotAllowed, 'Wigwam.BadCSRFToken');
  Wigwam.Notice          = makeErrClass(Wigwam.Exception, 'Wigwam.Notice');
  Wigwam.NotAcceptable   = makeErrClass(Wigwam.Exception, 'Wigwam.NotAcceptable');
  Wigwam.ServerException = makeErrClass(Wigwam.Exception, 'Wigwam.ServerException');
  Wigwam.Ignore          = makeErrClass(Wigwam.Exception, 'Wigwam.Ignore');
  Wigwam.InvalidCreditCard = makeErrClass(Wigwam.Exception, 'Wigwam.InvalidCreditCard');
  Wigwam.FatalException  = makeErrClass(Wigwam.Exception, 'Wigwam.FatalException');
  Wigwam.PromoException  = makeErrClass(Wigwam.Exception, 'Wigwam.PromoException');
  Wigwam.Warning         = makeErrClass(Wigwam.Exception, 'Wigwam.Warning');
  Wigwam.NotFound        = makeErrClass(Wigwam.Exception, 'Wigwam.NotFound');
  Wigwam.Util            = {};

  makeApi(api);

})(jQuery);
