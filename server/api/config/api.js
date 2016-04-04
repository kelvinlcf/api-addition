// Router.route( '/', function() {
//   // Two parts here. Oof. So, our friend CORS is fussy. In order to get our
//   // request through, we need to do two things: let it know that the request
//   // is allowed from the originating server AND, let it know what options it
//   // is allowed to send with the request.

//   // There are two types of requests happening: OPTIONS and the actual request.
//   // An OPTIONS request is known as a "pre-flight" request. Before the actual
//   // request is run, it will ask if it is allowed to make the request, AND,
//   // if the data it's asking to pass over is allowed.

//   // Setting Access-Control-Allow-Origin answers the first question, by saying
//   // what domains requests are allowed to be made from (in this case * is equal
//   // to saying "anywhere").
//   this.response.setHeader( 'Access-Control-Allow-Origin', '*' );

//   // Here, we check the request method to see if it's an OPTIONS request, or,
//   // a pre-flight check. If it is, we pass along a list of allowed headers and
//   // methods, followed by an end to that request (the pre-flight). Once this is
//   // received by the requesting server, it will attempt to perform the actual
//   // request (GET, POST, PUT, or DELETE).
//   if ( this.request.method === "OPTIONS" ) {
//     this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
//     this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
//     this.response.end( 'Set OPTIONS.' );
//   } else {
//     // If we've already passed through the OPTIONS request, we go ahead and call
//     // our actual HTTP method.
//     API.handleRequest( this, this.request.method );
//   }
// }, { where: 'server' } );


API = {
  connection: function( request ) {
    var getRequestContents = API.utility.getRequestContents( request );
    return { data: getRequestContents };
  },
  handleRequest: function( context, method ) {
    var connection = API.connection( context.request );
    if ( !connection.error ) {
      API.methods[ method ]( context, connection );
    } else {
      API.utility.response( context, 401, connection );
    }
  },
  methods: {
    // GET: function( context, connection ) {
    //   // Check to see if our request has any data. If it doesn't, we want to
    //   // return all pizzas for the owner. If it does, we want to search for
    //   // pizzas matching that query.
    //   var hasData   = API.utility.hasData( connection.data ),
    //       // the validation does nothing at the moment
    //       validData = API.utility.validate( connection.data, { "a": String, "b": String });


    //   if ( hasData && validData ) {
    //     var total = MATH.add(parseInt(connection.data['a']),parseInt(connection.data['b']));
    //     API.utility.response( context, 200, {
    //       a: connection.data['a'],
    //       b: connection.data['b'],

    //       total: total
    //     });
    //   } else {
    //       API.utility.response( context, 404, { error: 404, message: "No numbers found, dude." } );
    //   }
    // },
    POST: function( context, connection ) {
      // Make sure that our request has data and that the data is valid.
      var hasData   = API.utility.hasData( connection.data ),
          // the validation does nothing at the moment
          validData = API.utility.validate( connection.data, { "a": String, "b": String });

      if ( hasData && validData ) {
        var total = MATH.add(parseInt(connection.data['a']),parseInt(connection.data['b']));
        API.utility.response( context, 200, {
          a: connection.data['a'],
          b: connection.data['b'],

          total: total
        });
      } else {
          API.utility.response( context, 404, { error: 404, message: "No numbers found, dude." } );
      }
    },
    // PUT: function( context, connection ) {
    //   var hasQuery  = API.utility.hasData( connection.data ),
    //       validData = API.utility.validate( connection.data, Match.OneOf(
    //         { "_id": String, "name": String },
    //         { "_id": String, "crust": String },
    //         { "_id": String, "toppings": [ String ] },
    //         { "_id": String, "name": String, "crust": String },
    //         { "_id": String, "name": String, "toppings": [ String ] },
    //         { "_id": String, "crust": String, "toppings": [ String ] },
    //         { "_id": String, "name": String, "crust": String, "toppings": [ String ] }
    //       ));

    //   if ( hasQuery && validData ) {
    //     // Save the ID of the pizza we want to update and then sanatize our
    //     // data so that it only includes name, crust, and toppings parameters.
    //     var pizzaId = connection.data._id;
    //     delete connection.data._id;

    //     var getPizza = Pizza.findOne( { "_id": pizzaId }, { fields: { "_id": 1 } } );

    //     if ( getPizza ) {
    //       Pizza.update( { "_id": pizzaId }, { $set: connection.data } );
    //       API.utility.response( context, 200, { "message": "Pizza successfully updated!" } );
    //     } else {
    //       API.utility.response( context, 404, { "message": "Can't update a non-existent pizza, homeslice." } );
    //     }
    //   } else {
    //     API.utility.response( context, 403, { error: 403, message: "PUT calls must have a pizza ID and at least a name, crust, or toppings passed in the request body in the correct formats (String, String, Array)." } );
    //   }
    // },
    // DELETE: function( context, connection ) {
    //   var hasQuery  = API.utility.hasData( connection.data ),
    //       validData = API.utility.validate( connection.data, { "_id": String } );

    //   if ( hasQuery && validData ) {
    //     var pizzaId  = connection.data._id;
    //     var getPizza = Pizza.findOne( { "_id": pizzaId }, { fields: { "_id": 1 } } );

    //     if ( getPizza ) {
    //       Pizza.remove( { "_id": pizzaId } );
    //       API.utility.response( context, 200, { "message": "Pizza removed!" } );
    //     } else {
    //       API.utility.response( context, 404, { "message": "Can't delete a non-existent pizza, homeslice." } );
    //     }
    //   } else {
    //     API.utility.response( context, 403, { error: 403, message: "DELETE calls must have an _id (and only an _id) in the request body in the correct format (String)." } );
    //   }
    // }
  },
  utility: {
    getRequestContents: function( request ) {
      return request.query;
      // switch( request.method ) {
      //   case "GET":
      //     return request.query;
      //   case "POST":
      //   case "PUT":
      //   case "DELETE":
      //     return request.body;
      // }
    },
    hasData: function( data ) {
      return Object.keys( data ).length > 1 ? true : false;
      // return true;
    },
    response: function( context, statusCode, data ) {
      context.response.setHeader( 'Content-Type', 'application/json' );
      context.response.statusCode = statusCode;
      context.response.end( JSON.stringify( data ) );
    },
    validate: function( data, pattern ) {
      return true;
      return Match.test( data, pattern );
    }
  }
};

MATH = {
  add: function (a, b) {
    return a+b;
  }
}
